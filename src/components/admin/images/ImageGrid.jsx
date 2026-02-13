'use client';

import { useState } from 'react';
import { Trash2, Copy, Check, ImageOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

// 파일 크기 포맷
function formatSize(bytes) {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

// 날짜 포맷
function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// 키에서 파일명 추출
function getFileName(key) {
  if (!key) return '';
  const parts = key.split('/');
  return parts[parts.length - 1];
}

export function ImageGrid({
  images = [],
  loading = false,
  onSelect,
  onDelete,
  emptyMessage = '이미지가 없습니다.',
  className,
}) {
  if (loading) {
    return (
      <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }

  if (!images || images.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-12">
        <ImageOff className="mb-4 size-12 text-muted-foreground" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4', className)}>
      {images.map((image) => (
        <ImageGridItem
          key={image.key}
          image={image}
          onSelect={() => onSelect?.(image)}
          onDelete={() => onDelete?.(image)}
        />
      ))}
    </div>
  );
}

function ImageGridItem({ image, onSelect, onDelete }) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleCopyUrl = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(image.url);
      setCopied(true);
      toast.success('URL이 복사되었습니다.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('복사에 실패했습니다.');
    }
  };

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    onDelete?.();
  };

  return (
    <>
      <div
        className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card transition-all hover:ring-2 hover:ring-primary"
        onClick={onSelect}
      >
        {/* 이미지 */}
        <div className="aspect-square bg-muted">
          {!imgError ? (
            <img
              src={image.url}
              alt={getFileName(image.key)}
              className="size-full object-contain"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <ImageOff className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* 정보 영역 */}
        <div className="relative px-2 py-3">
          <p className="truncate text-xs font-medium" title={getFileName(image.key)}>
            {getFileName(image.key)}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatSize(image.size)}
          </p>

          {/* 호버 시 버튼 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center gap-4 px-2 bg-black/90 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              className="h-10 border-destructive/50 bg-transparent text-red-400 hover:bg-destructive hover:text-white"
              onClick={handleDeleteClick}
            >
              <Trash2 className="size-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-10 border-white/30 bg-transparent px-3 text-white hover:bg-white hover:text-black"
              onClick={handleCopyUrl}
            >
              {copied ? <Check className="size-5 text-green-400" /> : <Copy className="size-5" />}
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="이미지 삭제"
        description={`"${getFileName(image.key)}" 이미지를 삭제하시겠습니까?`}
        confirmText="삭제"
        onConfirm={handleConfirmDelete}
        variant="error"
      />
    </>
  );
}

/**
 * 캐릭터 이미지 그리드 (포즈별 그룹핑)
 */
export function CharacterImageGrid({
  images = [],
  loading = false,
  onSelect,
  onDelete,
  emptyMessage = '이미지가 없습니다.',
  className,
}) {
  // 포즈별로 그룹핑 (suffix 제외한 기본 이름 기준)
  const groupedImages = groupByPose(images);

  if (loading) {
    return (
      <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4', className)}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square animate-pulse rounded-lg bg-muted"
          />
        ))}
      </div>
    );
  }

  if (Object.keys(groupedImages).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-xl border bg-card py-12">
        <ImageOff className="mb-4 size-12 text-muted-foreground" />
        <p className="text-muted-foreground">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={cn('grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4', className)}>
      {Object.entries(groupedImages).map(([pose, variants]) => (
        <CharacterPoseCard
          key={pose}
          pose={pose}
          variants={variants}
          onSelect={() => onSelect?.(variants)}
          onDelete={() => onDelete?.(variants)}
        />
      ))}
    </div>
  );
}

// 포즈별 그룹핑 헬퍼
function groupByPose(images) {
  const groups = {};

  for (const image of images) {
    // characters/tiger/happy.webp → happy
    // characters/tiger/happy-lg.webp → happy
    const fileName = getFileName(image.key);
    const baseName = fileName.replace(/\.(webp|png|jpg|jpeg)$/i, '');
    const pose = baseName.replace(/-(lg|md|sm)$/, '');

    if (!groups[pose]) {
      groups[pose] = [];
    }
    groups[pose].push(image);
  }

  return groups;
}

function CharacterPoseCard({ pose, variants, onSelect, onDelete }) {
  const [imgError, setImgError] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  // 원본 (suffix 없는) 이미지 찾기
  const mainImage = variants.find((v) => {
    const name = getFileName(v.key).replace(/\.(webp|png|jpg|jpeg)$/i, '');
    return !name.endsWith('-lg') && !name.endsWith('-md') && !name.endsWith('-sm');
  }) || variants[0];

  // 총 용량
  const totalSize = variants.reduce((sum, v) => sum + (v.size || 0), 0);

  const handleDeleteClick = (e) => {
    e.stopPropagation();
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    setConfirmOpen(false);
    onDelete?.();
  };

  return (
    <>
      <div
        className="group relative cursor-pointer overflow-hidden rounded-lg border bg-card transition-all hover:ring-2 hover:ring-primary"
        onClick={onSelect}
      >
        {/* 메인 이미지 */}
        <div className="aspect-square bg-muted">
          {!imgError && mainImage ? (
            <img
              src={mainImage.url}
              alt={pose}
              className="size-full object-contain"
              onError={() => setImgError(true)}
              loading="lazy"
            />
          ) : (
            <div className="flex size-full items-center justify-center">
              <ImageOff className="size-8 text-muted-foreground" />
            </div>
          )}
        </div>

        {/* 정보 영역 */}
        <div className="relative px-2 py-3">
          <p className="truncate text-sm font-medium">{pose}</p>
          <p className="text-xs text-muted-foreground">
            {variants.length}개 · {formatSize(totalSize)}
          </p>

          {/* 호버 시 버튼 오버레이 */}
          <div className="absolute inset-0 flex items-center justify-center bg-black/90 opacity-0 transition-opacity group-hover:opacity-100">
            <Button
              variant="ghost"
              size="sm"
              className="h-8 border-destructive/50 bg-transparent px-3 text-red-400 hover:bg-destructive hover:text-white"
              onClick={handleDeleteClick}
            >
              <Trash2 className="mr-1.5 size-4" />
              삭제
            </Button>
          </div>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="캐릭터 이미지 삭제"
        description={`"${pose}" 포즈의 모든 해상도(${variants.length}개)를 삭제하시겠습니까?`}
        confirmText="삭제"
        onConfirm={handleConfirmDelete}
        variant="error"
      />
    </>
  );
}
