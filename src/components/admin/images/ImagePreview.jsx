'use client';

import { useEffect, useState } from 'react';
import { X, AlertTriangle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

// 파일 크기 포맷
function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// 압축률 계산
function getCompressionRate(original, compressed) {
  if (!original || !compressed) return 0;
  return Math.round((1 - compressed / original) * 100);
}

export function ImagePreview({
  file,
  previewUrl,
  originalInfo,
  estimatedInfo,
  variants,
  qualityWarning = false,
  onRemove,
  className,
}) {
  const [imageUrl, setImageUrl] = useState(previewUrl || null);

  useEffect(() => {
    if (file && !previewUrl) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [file, previewUrl]);

  return (
    <div className={cn(
      'relative rounded-xl border bg-card p-4',
      className
    )}>
      {/* 삭제 버튼 */}
      {onRemove && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-2 -top-2 size-6 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
          onClick={onRemove}
        >
          <X className="size-4" />
        </Button>
      )}

      <div className="flex gap-4">
        {/* 이미지 썸네일 */}
        <div className="relative size-32 flex-shrink-0 overflow-hidden rounded-lg bg-muted">
          {imageUrl && (
            <img
              src={imageUrl}
              alt={file?.name || 'Preview'}
              className="size-full object-contain"
            />
          )}
        </div>

        {/* 정보 */}
        <div className="flex-1 space-y-3">
          {/* 파일명 */}
          <div>
            <p className="font-medium truncate" title={file?.name}>
              {file?.name || 'Unknown'}
            </p>
          </div>

          {/* 원본 정보 */}
          {originalInfo && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">원본</p>
              <div className="flex flex-wrap gap-2 text-sm">
                <span className="rounded bg-muted px-2 py-0.5">
                  {originalInfo.width} x {originalInfo.height}
                </span>
                <span className="rounded bg-muted px-2 py-0.5">
                  {formatSize(originalInfo.size || file?.size)}
                </span>
              </div>
            </div>
          )}

          {/* 압축 예상 정보 (일반 이미지) */}
          {estimatedInfo && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">압축 후 예상</p>
              <div className="flex flex-wrap items-center gap-2 text-sm">
                <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">
                  {estimatedInfo.width} x {estimatedInfo.height}
                </span>
                <span className="rounded bg-primary/10 px-2 py-0.5 text-primary">
                  ~{formatSize(estimatedInfo.size)}
                </span>
                {estimatedInfo.compressionRate > 0 && (
                  <span className="rounded bg-green-100 px-2 py-0.5 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                    -{estimatedInfo.compressionRate}%
                  </span>
                )}
              </div>
            </div>
          )}

          {/* 4단계 해상도 정보 (캐릭터 이미지) */}
          {variants && variants.length > 0 && (
            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground">생성될 해상도</p>
              <div className="flex flex-wrap gap-1">
                {variants.map((v) => (
                  <span
                    key={v.size}
                    className="rounded bg-muted px-2 py-0.5 text-xs"
                  >
                    {v.size}px {v.estimatedSize && `(~${formatSize(v.estimatedSize)})`}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 품질 경고 */}
          {qualityWarning && (
            <div className="flex items-center gap-2 rounded-lg bg-yellow-50 px-3 py-2 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">
              <AlertTriangle className="size-4 flex-shrink-0" />
              <p className="text-xs">
                원본 해상도가 2000px 미만입니다. 고해상도 이미지 권장.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * 다중 파일 미리보기 (일반 이미지용)
 */
export function ImagePreviewList({
  files,
  onRemove,
  className,
}) {
  if (!files || files.length === 0) return null;

  return (
    <div className={cn('space-y-3', className)}>
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          대기열 ({files.length}개)
        </p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        {files.map((item, index) => (
          <ImagePreviewItem
            key={item.id || index}
            file={item.file}
            index={index}
            onRemove={() => onRemove?.(index)}
          />
        ))}
      </div>
    </div>
  );
}

/**
 * 간단한 미리보기 아이템 (다중 업로드용)
 */
function ImagePreviewItem({ file, index, onRemove }) {
  const [preview, setPreview] = useState(null);
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);

    const img = new Image();
    img.onload = () => {
      setDimensions({ width: img.width, height: img.height });
    };
    img.src = url;

    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="relative flex items-center gap-3 rounded-lg border bg-card p-3">
      <Button
        variant="ghost"
        size="icon"
        className="absolute -right-2 -top-2 size-5 rounded-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
        onClick={onRemove}
      >
        <X className="size-3" />
      </Button>

      <div className="size-12 flex-shrink-0 overflow-hidden rounded bg-muted">
        {preview && (
          <img src={preview} alt="" className="size-full object-cover" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="truncate text-sm font-medium">{file.name}</p>
        <div className="flex gap-2 text-xs text-muted-foreground">
          {dimensions && <span>{dimensions.width}x{dimensions.height}</span>}
          <span>{formatSize(file.size)}</span>
        </div>
      </div>
    </div>
  );
}
