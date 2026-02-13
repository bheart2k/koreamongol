'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RotateCcw, Upload, Loader2, Trash2, Crop, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/animate-ui/components/radix/switch';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/animate-ui/components/radix/popover';
import { ImageDropzone } from '@/components/admin/images/ImageDropzone';
import { ImagePreviewList } from '@/components/admin/images/ImagePreview';
import { ImageGrid } from '@/components/admin/images/ImageGrid';
import { ImageDetailModal } from '@/components/admin/images/ImageDetailModal';
import { ImageCropper } from '@/components/admin/images/ImageCropper';
import { cn } from '@/lib/utils';

const CATEGORIES = [
  { id: 'general', name: '일반', description: '기타 범용 이미지' },
  { id: 'banners', name: '배너', description: '홈, 이벤트 등의 배너 이미지' },
  { id: 'icons', name: '아이콘', description: '아이콘 및 로고 이미지' },
];

export default function GeneralImagesPage() {
  // 폼 상태
  const [category, setCategory] = useState('general');
  const [cropEnabled, setCropEnabled] = useState(false);
  const [pendingFiles, setPendingFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  // 크롭 모달
  const [cropQueue, setCropQueue] = useState([]);
  const [currentCropIndex, setCurrentCropIndex] = useState(0);
  const [cropperOpen, setCropperOpen] = useState(false);
  const [currentCropSrc, setCurrentCropSrc] = useState(null);
  const [currentCropFileName, setCurrentCropFileName] = useState('');

  // 기존 이미지 목록
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 상세 모달
  const [selectedImage, setSelectedImage] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 기존 이미지 목록 로드
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/images?prefix=general/${category}/`);
      const data = await res.json();
      if (data.success) {
        setExistingImages(data.data.images || []);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // 파일 선택 핸들러
  const handleFilesSelected = useCallback((files) => {
    if (cropEnabled) {
      // 크롭 모드: 대기열에 추가하고 크롭 시작
      setCropQueue(files);
      setCurrentCropIndex(0);
      startCrop(files, 0);
    } else {
      // 일반 모드: 바로 대기열에 추가
      const newFiles = files.map((file, idx) => ({
        id: `${Date.now()}-${idx}`,
        file,
        name: file.name,
      }));
      setPendingFiles((prev) => [...prev, ...newFiles]);
    }
  }, [cropEnabled]);

  // 크롭 시작
  const startCrop = (files, index) => {
    if (index >= files.length) {
      setCropQueue([]);
      setCurrentCropIndex(0);
      return;
    }

    const file = files[index];
    const url = URL.createObjectURL(file);
    setCurrentCropSrc(url);
    setCurrentCropFileName(file.name);
    setCropperOpen(true);
  };

  // 크롭 완료
  const handleCropComplete = (blob, fileName) => {
    // 대기열에 추가
    const newFile = {
      id: `${Date.now()}-${currentCropIndex}`,
      file: blob,
      name: fileName,
    };
    setPendingFiles((prev) => [...prev, newFile]);

    // 다음 파일 크롭
    const nextIndex = currentCropIndex + 1;
    setCurrentCropIndex(nextIndex);

    if (nextIndex < cropQueue.length) {
      startCrop(cropQueue, nextIndex);
    } else {
      setCropQueue([]);
      setCropperOpen(false);
      if (currentCropSrc) {
        URL.revokeObjectURL(currentCropSrc);
      }
    }
  };

  // 크롭 취소
  const handleCropCancel = () => {
    setCropperOpen(false);
    setCropQueue([]);
    setCurrentCropIndex(0);
    if (currentCropSrc) {
      URL.revokeObjectURL(currentCropSrc);
    }
  };

  // 대기열에서 파일 제거
  const handleRemoveFromQueue = (index) => {
    setPendingFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // 대기열 초기화
  const handleClearQueue = () => {
    setPendingFiles([]);
  };

  // 업로드 핸들러
  const handleUpload = async () => {
    if (pendingFiles.length === 0) {
      toast.warning('업로드할 파일을 선택해주세요.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('category', category);

      pendingFiles.forEach((item) => {
        formData.append('files', item.file, item.name);
      });

      const res = await fetch('/api/admin/images/general', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        const { uploaded, failed } = result.data;

        if (uploaded.length > 0) {
          toast.success(`${uploaded.length}개 이미지가 업로드되었습니다.`);
        }

        if (failed.length > 0) {
          toast.warning(`${failed.length}개 이미지 업로드에 실패했습니다.`);
        }

        setPendingFiles([]);
        fetchImages();
      } else {
        throw new Error(result.error || '업로드 실패');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error(error.message || '업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  };

  // 이미지 상세 보기
  const handleSelectImage = (image) => {
    setSelectedImage(image);
    setDetailOpen(true);
  };

  // 이미지 삭제
  const handleDeleteImage = async (image) => {
    if (!image) return;

    setDeleting(true);

    try {
      const res = await fetch(`/api/admin/images?keys=${encodeURIComponent(image.key)}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (result.success) {
        toast.error('이미지가 삭제되었습니다.');
        setDetailOpen(false);
        fetchImages();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error('Delete error:', error);
      toast.error('삭제에 실패했습니다.');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">일반 이미지</h1>
          <p className="text-muted-foreground">
            배너, 아이콘 등 범용 이미지를 관리합니다.
          </p>
        </div>
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <HelpCircle className="size-5" />
            </Button>
          </PopoverTrigger>
          <PopoverContent align="end" className="w-80">
            <div className="space-y-3">
              <h4 className="font-semibold">이미지 처리 정보</h4>
              <div className="space-y-2 text-sm">
                <div className="rounded-lg bg-muted p-3">
                  <p className="font-medium text-foreground">압축 설정</p>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• 목표 용량: <span className="text-foreground">300KB</span></li>
                    <li>• 최대 해상도: <span className="text-foreground">1920px</span></li>
                    <li>• 출력 포맷: <span className="text-foreground">WebP</span> (불가 시 JPEG)</li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="font-medium text-foreground">지원 형식</p>
                  <p className="mt-1 text-muted-foreground">JPG, PNG, GIF, WebP</p>
                </div>
                <p className="text-xs text-muted-foreground">
                  * 100MB 이상 파일은 업로드 전 경고 표시
                </p>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>

      {/* 업로드 섹션 */}
      <div className="rounded-xl border bg-card p-6">
        <h2 className="mb-6 text-lg font-semibold">이미지 업로드</h2>

        <div className="space-y-6">
          {/* 카테고리 선택 */}
          <div className="space-y-2">
            <Label>카테고리 선택</Label>
            <div className="flex flex-wrap gap-3">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setCategory(cat.id)}
                  className={cn(
                    'rounded-lg border px-4 py-2 text-left transition-all',
                    category === cat.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary'
                      : 'hover:border-primary/50'
                  )}
                >
                  <p className="font-medium">{cat.name}</p>
                  <p className="text-xs text-muted-foreground">{cat.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 크롭 토글 */}
          <div className="flex items-center gap-3">
            <Switch
              id="crop-mode"
              checked={cropEnabled}
              onCheckedChange={setCropEnabled}
            />
            <Label htmlFor="crop-mode" className="flex items-center gap-2 cursor-pointer">
              <Crop className="size-4" />
              크롭 기능 사용
            </Label>
            {cropEnabled && (
              <span className="text-xs text-muted-foreground">
                파일 선택 후 각 이미지를 크롭할 수 있습니다.
              </span>
            )}
          </div>

          {/* 드롭존 */}
          <ImageDropzone
            onFilesSelected={handleFilesSelected}
            multiple={true}
            disabled={uploading}
          />

          {/* 대기열 */}
          {pendingFiles.length > 0 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="font-medium">대기열 ({pendingFiles.length}개)</p>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleClearQueue}
                  disabled={uploading}
                >
                  <Trash2 className="mr-2 size-4" />
                  모두 삭제
                </Button>
              </div>
              <ImagePreviewList
                files={pendingFiles}
                onRemove={handleRemoveFromQueue}
              />
            </div>
          )}

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2">
            <Button
              onClick={handleUpload}
              disabled={pendingFiles.length === 0 || uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="mr-2 size-4" />
                  저장하기 ({pendingFiles.length}개)
                </>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* 기존 이미지 목록 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">
            {CATEGORIES.find((c) => c.id === category)?.name} 이미지
          </h2>
          <Button variant="ghost" size="sm" onClick={fetchImages}>
            <RotateCcw className="mr-2 size-4" />
            새로고침
          </Button>
        </div>

        <ImageGrid
          images={existingImages}
          loading={loading}
          onSelect={handleSelectImage}
          onDelete={handleDeleteImage}
          emptyMessage="아직 업로드된 이미지가 없습니다."
        />
      </div>

      {/* 상세 모달 */}
      <ImageDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        image={selectedImage}
        onDelete={() => handleDeleteImage(selectedImage)}
        deleting={deleting}
      />

      {/* 크롭 모달 */}
      <ImageCropper
        open={cropperOpen}
        onOpenChange={(open) => {
          if (!open) handleCropCancel();
        }}
        imageSrc={currentCropSrc}
        fileName={currentCropFileName}
        onComplete={handleCropComplete}
      />
    </div>
  );
}
