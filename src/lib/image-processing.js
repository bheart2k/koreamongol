import sharp from 'sharp';

// 캐릭터 이미지 해상도 단계
export const CHARACTER_SIZES = [
  { suffix: '', size: 2000 },
  { suffix: '-lg', size: 1000 },
  { suffix: '-md', size: 500 },
  { suffix: '-sm', size: 200 },
];

// 일반 이미지 설정
export const GENERAL_IMAGE_CONFIG = {
  targetSize: 300 * 1024, // 300KB
  maxDimension: 1920,
  quality: 85,
};

/**
 * 캐릭터 이미지 4단계 해상도 생성
 * @param {Buffer} buffer - 원본 이미지 버퍼
 * @returns {Promise<{variants: Array, metadata: Object, qualityWarning: boolean}>}
 */
export async function processCharacterImage(buffer) {
  const image = sharp(buffer);
  const metadata = await image.metadata();

  const maxDimension = Math.max(metadata.width, metadata.height);
  const qualityWarning = maxDimension < 2000;

  const variants = [];

  for (const { suffix, size } of CHARACTER_SIZES) {
    let resizedImage = sharp(buffer);

    // 원본이 목표 해상도보다 작은지 체크
    const isUndersized = maxDimension < size;

    // 원본보다 큰 사이즈는 리사이즈하지 않고 원본 사용 (업스케일 안함)
    if (!isUndersized) {
      resizedImage = resizedImage.resize(size, size, {
        fit: 'inside',
        withoutEnlargement: true,
      });
    }

    // WebP로 변환 (투명 배경 유지)
    const outputBuffer = await resizedImage
      .webp({ quality: 85, alphaQuality: 100 })
      .toBuffer();

    const resizedMetadata = await sharp(outputBuffer).metadata();

    variants.push({
      suffix,
      targetSize: size,
      buffer: outputBuffer,
      width: resizedMetadata.width,
      height: resizedMetadata.height,
      fileSize: outputBuffer.length,
      mimeType: 'image/webp',
      extension: 'webp',
      isUndersized, // 목표 해상도 미달 여부
    });
  }

  return {
    variants,
    metadata: {
      originalWidth: metadata.width,
      originalHeight: metadata.height,
      format: metadata.format,
    },
    qualityWarning,
  };
}

/**
 * 일반 이미지 압축 (300KB / 1920px 목표)
 * @param {Buffer} buffer - 원본 이미지 버퍼
 * @param {string} mimeType - 원본 MIME 타입
 * @returns {Promise<{buffer: Buffer, mimeType: string, extension: string, metadata: Object}>}
 */
export async function processGeneralImage(buffer, mimeType) {
  const { targetSize, maxDimension } = GENERAL_IMAGE_CONFIG;

  let image = sharp(buffer);
  const metadata = await image.metadata();

  // 1920px 초과 시 리사이징
  if (metadata.width > maxDimension || metadata.height > maxDimension) {
    image = image.resize(maxDimension, maxDimension, {
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  // 이미 작은 파일은 그대로 반환
  if (buffer.length <= targetSize &&
      metadata.width <= maxDimension &&
      metadata.height <= maxDimension) {
    return {
      buffer,
      mimeType,
      extension: getExtension(mimeType),
      metadata: {
        width: metadata.width,
        height: metadata.height,
        originalSize: buffer.length,
        compressedSize: buffer.length,
      },
    };
  }

  // WebP로 변환하며 품질 조절
  let quality = 85;
  let outputBuffer = await image.webp({ quality }).toBuffer();

  while (outputBuffer.length > targetSize && quality > 20) {
    quality -= 10;
    outputBuffer = await image.webp({ quality }).toBuffer();
  }

  // WebP로도 안 되면 JPEG로 시도
  if (outputBuffer.length > targetSize) {
    quality = 80;
    outputBuffer = await image.jpeg({ quality }).toBuffer();

    while (outputBuffer.length > targetSize && quality > 20) {
      quality -= 10;
      outputBuffer = await image.jpeg({ quality }).toBuffer();
    }

    const finalMetadata = await sharp(outputBuffer).metadata();
    return {
      buffer: outputBuffer,
      mimeType: 'image/jpeg',
      extension: 'jpg',
      metadata: {
        width: finalMetadata.width,
        height: finalMetadata.height,
        originalSize: buffer.length,
        compressedSize: outputBuffer.length,
      },
    };
  }

  const finalMetadata = await sharp(outputBuffer).metadata();
  return {
    buffer: outputBuffer,
    mimeType: 'image/webp',
    extension: 'webp',
    metadata: {
      width: finalMetadata.width,
      height: finalMetadata.height,
      originalSize: buffer.length,
      compressedSize: outputBuffer.length,
    },
  };
}

/**
 * MIME 타입에서 확장자 추출
 */
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
 * 파일 크기 포맷팅
 * @param {number} bytes
 * @returns {string}
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
