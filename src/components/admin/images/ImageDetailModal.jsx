'use client';

import { useState } from 'react';
import { Copy, Check, Trash2, ExternalLink, ImageOff } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

// 키에서 파일명 추출
function getFileName(key) {
  if (!key) return '';
  const parts = key.split('/');
  return parts[parts.length - 1];
}

/**
 * 단일 이미지 상세 모달
 */
export function ImageDetailModal({
  open,
  onOpenChange,
  image,
  onDelete,
  deleting = false,
}) {
  const [copied, setCopied] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [imgError, setImgError] = useState(false);

  if (!image) return null;

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(image.url);
      setCopied(true);
      toast.success('URL이 복사되었습니다.');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('복사에 실패했습니다.');
    }
  };

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await onDelete?.();
    setConfirmOpen(false);
    onOpenChange?.(false);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="truncate">
              {getFileName(image.key)}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 이미지 미리보기 */}
            <div className="flex justify-center rounded-lg bg-muted p-4">
              {!imgError ? (
                <img
                  src={image.url}
                  alt={getFileName(image.key)}
                  className="max-h-80 object-contain"
                  onError={() => setImgError(true)}
                />
              ) : (
                <div className="flex size-40 items-center justify-center">
                  <ImageOff className="size-12 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* 정보 테이블 */}
            <div className="rounded-lg border">
              <table className="w-full text-sm">
                <tbody className="divide-y">
                  <tr>
                    <td className="px-4 py-2 font-medium text-muted-foreground">경로</td>
                    <td className="px-4 py-2 break-all">{image.key}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-muted-foreground">크기</td>
                    <td className="px-4 py-2">{formatSize(image.size)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-muted-foreground">수정일</td>
                    <td className="px-4 py-2">{formatDate(image.lastModified)}</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-medium text-muted-foreground">URL</td>
                    <td className="px-4 py-2">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={image.url}
                          readOnly
                          className="flex-1 truncate rounded border bg-muted px-2 py-1 text-xs"
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 flex-shrink-0"
                          onClick={handleCopyUrl}
                        >
                          {copied ? (
                            <Check className="size-4 text-green-500" />
                          ) : (
                            <Copy className="size-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="size-7 flex-shrink-0"
                          asChild
                        >
                          <a href={image.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="size-4" />
                          </a>
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="mr-2 size-4" />
                {deleting ? '삭제 중...' : '삭제'}
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange?.(false)}
              >
                닫기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="이미지 삭제"
        description="이 이미지를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="삭제"
        onConfirm={confirmDelete}
        variant="error"
        loading={deleting}
      />
    </>
  );
}

/**
 * 캐릭터 포즈 상세 모달 (여러 해상도 표시)
 */
export function CharacterDetailModal({
  open,
  onOpenChange,
  variants = [],
  onDelete,
  deleting = false,
}) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  if (!variants || variants.length === 0) return null;

  // 포즈 이름 추출
  const getPoseName = () => {
    const key = variants[0]?.key || '';
    const fileName = getFileName(key).replace(/\.(webp|png|jpg|jpeg)$/i, '');
    return fileName.replace(/-(lg|md|sm)$/, '');
  };

  // 총 용량
  const totalSize = variants.reduce((sum, v) => sum + (v.size || 0), 0);

  const handleDelete = () => {
    setConfirmOpen(true);
  };

  const confirmDelete = async () => {
    await onDelete?.();
    setConfirmOpen(false);
    onOpenChange?.(false);
  };

  // 해상도별 정렬 (원본 → lg → md → sm)
  const sortedVariants = [...variants].sort((a, b) => {
    const order = { '': 0, '-lg': 1, '-md': 2, '-sm': 3 };
    const getSuffix = (key) => {
      const name = getFileName(key).replace(/\.(webp|png|jpg|jpeg)$/i, '');
      if (name.endsWith('-sm')) return '-sm';
      if (name.endsWith('-md')) return '-md';
      if (name.endsWith('-lg')) return '-lg';
      return '';
    };
    return (order[getSuffix(a.key)] || 0) - (order[getSuffix(b.key)] || 0);
  });

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{getPoseName()}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* 해상도별 이미지 그리드 */}
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              {sortedVariants.map((variant) => (
                <VariantCard key={variant.key} variant={variant} />
              ))}
            </div>

            {/* 요약 정보 */}
            <div className="rounded-lg border p-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">
                  총 {variants.length}개 해상도
                </span>
                <span className="font-medium">{formatSize(totalSize)}</span>
              </div>
            </div>

            {/* 액션 버튼 */}
            <div className="flex justify-end gap-2">
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting}
              >
                <Trash2 className="mr-2 size-4" />
                {deleting ? '삭제 중...' : '모두 삭제'}
              </Button>
              <Button
                variant="outline"
                onClick={() => onOpenChange?.(false)}
              >
                닫기
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="캐릭터 이미지 삭제"
        description={`"${getPoseName()}" 포즈의 모든 해상도 이미지(${variants.length}개)를 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        confirmText="모두 삭제"
        onConfirm={confirmDelete}
        variant="error"
        loading={deleting}
      />
    </>
  );
}

function VariantCard({ variant }) {
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);

  const getSizeLabel = () => {
    const name = getFileName(variant.key).replace(/\.(webp|png|jpg|jpeg)$/i, '');
    if (name.endsWith('-sm')) return '200px';
    if (name.endsWith('-md')) return '500px';
    if (name.endsWith('-lg')) return '1000px';
    return '2000px';
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(variant.url);
      setCopied(true);
      toast.success('URL 복사됨');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('복사 실패');
    }
  };

  return (
    <div className="space-y-2 rounded-lg border p-2">
      <div className="aspect-square overflow-hidden rounded bg-muted">
        {!imgError ? (
          <img
            src={variant.url}
            alt=""
            className="size-full object-contain"
            onError={() => setImgError(true)}
            loading="lazy"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <ImageOff className="size-6 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-medium">{getSizeLabel()}</span>
          <Button
            variant="ghost"
            size="icon"
            className="size-6"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="size-3 text-green-500" />
            ) : (
              <Copy className="size-3" />
            )}
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">{formatSize(variant.size)}</p>
      </div>
    </div>
  );
}
