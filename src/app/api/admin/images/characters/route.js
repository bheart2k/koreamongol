import { NextResponse } from 'next/server';
import { PutObjectCommand } from '@aws-sdk/client-s3';
import { auth, isAdmin } from '@/lib/auth';
import { r2Client, r2Config } from '@/lib/r2-config';
import { processCharacterImage, CHARACTER_SIZES } from '@/lib/image-processing';

// 허용된 캐릭터 타입
const ALLOWED_CHARACTERS = ['tiger', 'sapsal'];

// 포즈명 검증 정규식 (영문 소문자, 숫자, 하이픈)
const POSE_NAME_REGEX = /^[a-z0-9-]+$/;

/**
 * POST /api/admin/images/characters
 * 캐릭터 이미지 업로드 (4단계 해상도 생성)
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
    const file = formData.get('file');
    const character = formData.get('character');
    const pose = formData.get('pose');
    const poseKo = formData.get('poseKo') || '';

    // 필수 값 검증
    if (!file) {
      return NextResponse.json(
        { error: '이미지 파일이 필요합니다.' },
        { status: 400 }
      );
    }

    if (!character || !ALLOWED_CHARACTERS.includes(character)) {
      return NextResponse.json(
        { error: '유효하지 않은 캐릭터입니다. (tiger 또는 sapsal)' },
        { status: 400 }
      );
    }

    if (!pose) {
      return NextResponse.json(
        { error: '포즈 이름이 필요합니다.' },
        { status: 400 }
      );
    }

    if (!POSE_NAME_REGEX.test(pose)) {
      return NextResponse.json(
        { error: '포즈 이름은 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.' },
        { status: 400 }
      );
    }

    // 파일 버퍼 추출
    const buffer = Buffer.from(await file.arrayBuffer());

    // 4단계 해상도 이미지 생성
    const { variants, metadata, qualityWarning } = await processCharacterImage(buffer);

    // R2에 각 해상도 업로드
    const uploadedVariants = [];

    for (const variant of variants) {
      const fileName = `characters/${character}/${pose}${variant.suffix}.${variant.extension}`;

      const command = new PutObjectCommand({
        Bucket: r2Config.bucket,
        Key: fileName,
        Body: variant.buffer,
        ContentType: variant.mimeType,
        Metadata: {
          'x-pose-name': pose,
          'x-pose-ko': poseKo,
          'x-target-size': String(variant.targetSize),
          'x-is-undersized': String(variant.isUndersized),
        },
      });

      await r2Client.send(command);

      uploadedVariants.push({
        suffix: variant.suffix,
        targetSize: variant.targetSize,
        width: variant.width,
        height: variant.height,
        fileSize: variant.fileSize,
        url: `${r2Config.publicUrl}/${fileName}`,
        key: fileName,
        isUndersized: variant.isUndersized,
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        character,
        pose,
        poseKo,
        variants: uploadedVariants,
        originalMetadata: metadata,
        qualityWarning,
      },
    });
  } catch (error) {
    console.error('Character image upload error:', error);
    return NextResponse.json(
      { error: '이미지 업로드에 실패했습니다.' },
      { status: 500 }
    );
  }
}
