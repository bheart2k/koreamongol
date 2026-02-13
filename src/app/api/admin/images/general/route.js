import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import crypto from 'crypto';
import { auth, isAdmin } from '@/lib/auth';
import { r2Client, r2Config } from '@/lib/r2-config';
import { processGeneralImage } from '@/lib/image-processing';

// 허용된 카테고리
const ALLOWED_CATEGORIES = ['banners', 'icons', 'general'];

/**
 * POST /api/admin/images/general
 * 일반 이미지 업로드 (다중 파일)
 */
export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: '로그인이 필요합니다.' },
        { status: 401 }
      );
    }

    if (!isAdmin(session)) {
      return NextResponse.json(
        { error: '관리자 권한이 필요합니다.' },
        { status: 403 }
      );
    }

    const formData = await request.formData();
    const files = formData.getAll('files');
    const category = formData.get('category') || 'general';

    // 카테고리 검증
    if (!ALLOWED_CATEGORIES.includes(category)) {
      return NextResponse.json(
        { error: '유효하지 않은 카테고리입니다. (banners, icons, general)' },
        { status: 400 }
      );
    }

    // 파일 검증
    if (!files || files.length === 0) {
      return NextResponse.json(
        { error: '업로드할 파일이 없습니다.' },
        { status: 400 }
      );
    }

    const uploaded = [];
    const failed = [];

    for (const file of files) {
      try {
        // 파일 버퍼 추출
        const buffer = Buffer.from(await file.arrayBuffer());
        const mimeType = file.type || 'image/jpeg';

        // 이미지 압축 (300KB / 1920px)
        const processed = await processGeneralImage(buffer, mimeType);

        // 파일명 생성
        const randomString = crypto.randomBytes(16).toString('hex');
        const fileName = `general/${category}/${randomString}.${processed.extension}`;

        // R2 업로드
        const command = new PutObjectCommand({
          Bucket: r2Config.bucket,
          Key: fileName,
          Body: processed.buffer,
          ContentType: processed.mimeType,
        });

        await r2Client.send(command);

        uploaded.push({
          originalName: file.name,
          key: fileName,
          url: `${r2Config.publicUrl}/${fileName}`,
          size: processed.buffer.length,
          originalSize: buffer.length,
          width: processed.metadata.width,
          height: processed.metadata.height,
        });
      } catch (error) {
        console.error(`Failed to upload ${file.name}:`, error);
        failed.push({
          name: file.name,
          error: error.message,
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: {
        uploaded,
        failed,
        category,
      },
    });
  } catch (error) {
    console.error('General image upload error:', error);
    return NextResponse.json(
      { error: '이미지 업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}
