import { NextResponse } from 'next/server';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import sharp from 'sharp';
import { r2Client, r2Config } from '@/lib/r2-config';

// 설정
const TARGET_SIZE = 300 * 1024; // 300KB
const MAX_DIMENSION = 1920; // 최대 너비/높이

// 프로필 이미지 설정
const PROFILE_TARGET_SIZE = 50 * 1024; // 50KB
const PROFILE_DIMENSION = 400; // 400x400px

/**
 * 이미지 압축 및 리사이징 (서버 사이드)
 * - 300KB 초과 시 압축
 * - 1920px 초과 시 리사이징
 */
async function processImage(buffer, mimeType) {
  try {
    let image = sharp(buffer);
    const metadata = await image.metadata();

    // 1920px 초과 시 리사이징
    if (metadata.width > MAX_DIMENSION || metadata.height > MAX_DIMENSION) {
      image = image.resize(MAX_DIMENSION, MAX_DIMENSION, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // 300KB 이하면 리사이징만 적용 후 반환
    if (buffer.length <= TARGET_SIZE && metadata.width <= MAX_DIMENSION && metadata.height <= MAX_DIMENSION) {
      return { buffer, mimeType, extension: getExtension(mimeType) };
    }

    // WebP로 변환하며 품질 조절
    let quality = 85;
    let outputBuffer = await image.webp({ quality }).toBuffer();

    // 300KB 초과 시 품질 낮춰가며 재압축
    while (outputBuffer.length > TARGET_SIZE && quality > 20) {
      quality -= 10;
      outputBuffer = await image.webp({ quality }).toBuffer();
    }

    // WebP로도 안 되면 JPEG로 시도
    if (outputBuffer.length > TARGET_SIZE) {
      quality = 80;
      outputBuffer = await image.jpeg({ quality }).toBuffer();

      while (outputBuffer.length > TARGET_SIZE && quality > 20) {
        quality -= 10;
        outputBuffer = await image.jpeg({ quality }).toBuffer();
      }

      return { buffer: outputBuffer, mimeType: 'image/jpeg', extension: 'jpg' };
    }

    return { buffer: outputBuffer, mimeType: 'image/webp', extension: 'webp' };
  } catch (error) {
    console.error('이미지 처리 실패:', error);
    return { buffer, mimeType, extension: getExtension(mimeType) };
  }
}

function getExtension(mimeType) {
  const map = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
  };
  return map[mimeType] || 'jpg';
}

/**
 * 프로필 이미지 처리 (서버 사이드)
 * - 400x400px 정사각형 리사이즈
 * - 50KB 목표 압축
 */
async function processProfileImage(buffer) {
  try {
    let image = sharp(buffer);
    const metadata = await image.metadata();

    // 정사각형으로 크롭 (중앙 기준)
    const size = Math.min(metadata.width, metadata.height);
    const left = Math.floor((metadata.width - size) / 2);
    const top = Math.floor((metadata.height - size) / 2);

    image = image.extract({ left, top, width: size, height: size });

    // 400x400으로 리사이즈
    image = image.resize(PROFILE_DIMENSION, PROFILE_DIMENSION, {
      fit: 'cover',
      withoutEnlargement: false,
    });

    // WebP로 변환하며 품질 조절
    let quality = 85;
    let outputBuffer = await image.webp({ quality }).toBuffer();

    // 50KB 초과 시 품질 낮춰가며 재압축
    while (outputBuffer.length > PROFILE_TARGET_SIZE && quality > 20) {
      quality -= 10;
      outputBuffer = await image.webp({ quality }).toBuffer();
    }

    // WebP로도 안 되면 JPEG로 시도
    if (outputBuffer.length > PROFILE_TARGET_SIZE) {
      quality = 80;
      outputBuffer = await image.jpeg({ quality }).toBuffer();

      while (outputBuffer.length > PROFILE_TARGET_SIZE && quality > 20) {
        quality -= 10;
        outputBuffer = await image.jpeg({ quality }).toBuffer();
      }

      return { buffer: outputBuffer, mimeType: 'image/jpeg', extension: 'jpg' };
    }

    return { buffer: outputBuffer, mimeType: 'image/webp', extension: 'webp' };
  } catch (error) {
    console.error('프로필 이미지 처리 실패:', error);
    throw error;
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');
    const folder = formData.get('folder') || 'banners'; // posts, banners, profiles
    const boardType = formData.get('boardType'); // blog, free, notice
    const sessionId = formData.get('sessionId'); // 임시 업로드용
    const userId = formData.get('userId'); // 프로필 이미지용

    if (!file) {
      return NextResponse.json({ success: false, error: '파일이 필요합니다.' }, { status: 400 });
    }

    // 프로필 이미지 업로드 시 userId 필수
    if (folder === 'profiles' && !userId) {
      return NextResponse.json({ success: false, error: '프로필 업로드에는 userId가 필요합니다.' }, { status: 400 });
    }

    // 파일 버퍼 추출
    let buffer = Buffer.from(await file.arrayBuffer());
    let fileType = file.type || 'image/jpeg';
    let fileExtension;

    // 프로필 이미지는 별도 처리
    if (folder === 'profiles') {
      const processed = await processProfileImage(buffer);
      buffer = processed.buffer;
      fileType = processed.mimeType;
      fileExtension = processed.extension;
    } else {
      // 일반 이미지 압축 및 리사이징
      const processed = await processImage(buffer, fileType);
      buffer = processed.buffer;
      fileType = processed.mimeType;
      fileExtension = processed.extension;
    }

    // 경로 생성
    // - 프로필: profiles/{userId}.{ext} (덮어쓰기)
    // - 배너: banners/{파일명}
    // - 게시글 작성 중: posts/temp/{sessionId}/{파일명}
    // - 게시글 저장 후: posts/{boardType}/{postId}/{파일명}
    let fileName;
    if (folder === 'profiles') {
      fileName = `profiles/${userId}.${fileExtension}`;
    } else if (folder === 'posts' && sessionId) {
      const randomString = crypto.randomBytes(16).toString('hex');
      fileName = `posts/temp/${sessionId}/${randomString}.${fileExtension}`;
    } else {
      const randomString = crypto.randomBytes(16).toString('hex');
      fileName = `${folder}/${randomString}-${Date.now()}.${fileExtension}`;
    }

    // R2 업로드 (S3 호환 API)
    const command = new PutObjectCommand({
      Bucket: r2Config.bucket,
      Key: fileName,
      Body: buffer,
      ContentType: fileType,
    });

    await r2Client.send(command);

    // R2 URL 생성 (프로필은 캐시 방지를 위해 타임스탬프 쿼리 추가)
    let fileUrl = `${r2Config.publicUrl}/${fileName}`;
    if (folder === 'profiles') {
      fileUrl = `${fileUrl}?t=${Date.now()}`;
    }

    return NextResponse.json({
      success: true,
      data: {
        url: fileUrl,
        key: fileName
      }
    });

  } catch (error) {
    console.error('R2 파일 업로드 중 오류 발생:', error);
    return NextResponse.json({ success: false, error: '파일 업로드 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// R2 파일 삭제
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const fileUrl = searchParams.get('url');

    if (!fileUrl) {
      return NextResponse.json({ success: false, error: 'URL이 필요합니다.' }, { status: 400 });
    }

    // URL에서 R2 key 추출
    let key;
    try {
      const urlObj = new URL(fileUrl);
      key = decodeURIComponent(urlObj.pathname.substring(1));
    } catch {
      key = fileUrl;
    }

    if (!key) {
      return NextResponse.json({ success: false, error: '유효하지 않은 URL입니다.' }, { status: 400 });
    }

    const command = new DeleteObjectCommand({
      Bucket: r2Config.bucket,
      Key: key,
    });

    await r2Client.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('R2 파일 삭제 중 오류:', error);
    return NextResponse.json({ success: false, error: '파일 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

// CORS 설정
export async function OPTIONS() {
  return NextResponse.json(
    { success: true },
    {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization'
      }
    }
  );
}
