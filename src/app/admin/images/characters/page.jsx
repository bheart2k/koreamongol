'use client';

import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { RotateCcw, Upload, Loader2, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/animate-ui/components/radix/popover';
import { ImageDropzone } from '@/components/admin/images/ImageDropzone';
import { ImagePreview } from '@/components/admin/images/ImagePreview';
import { CharacterImageGrid } from '@/components/admin/images/ImageGrid';
import { CharacterDetailModal } from '@/components/admin/images/ImageDetailModal';
import { cn } from '@/lib/utils';

const CHARACTERS = [
  { id: 'tiger', name: '호루', description: '호랑이 마스코트' },
  { id: 'sapsal', name: '누리', description: '삽살개 마스코트' },
];

const RESOLUTION_SIZES = [
  { size: 2000, label: '원본' },
  { size: 1000, label: 'lg' },
  { size: 500, label: 'md' },
  { size: 200, label: 'sm' },
];

export default function CharacterImagesPage() {
  // 폼 상태
  const [character, setCharacter] = useState('tiger');
  const [pose, setPose] = useState('');
  const [poseKo, setPoseKo] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [originalInfo, setOriginalInfo] = useState(null);
  const [qualityWarning, setQualityWarning] = useState(false);
  const [uploading, setUploading] = useState(false);

  // 기존 이미지 목록
  const [existingImages, setExistingImages] = useState([]);
  const [loading, setLoading] = useState(true);

  // 상세 모달
  const [selectedVariants, setSelectedVariants] = useState(null);
  const [detailOpen, setDetailOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // 기존 이미지 목록 로드
  const fetchImages = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/images?prefix=characters/${character}/`);
      const data = await res.json();
      if (data.success) {
        setExistingImages(data.data.images || []);
      }
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  }, [character]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  // 파일 선택 핸들러
  const handleFileSelected = useCallback((files) => {
    const file = files[0];
    if (!file) return;

    setSelectedFile(file);

    // 미리보기 URL 생성
    const url = URL.createObjectURL(file);
    setPreview(url);

    // 이미지 해상도 확인
    const img = new Image();
    img.onload = () => {
      const maxDim = Math.max(img.width, img.height);
      setQualityWarning(maxDim < 2000);
      setOriginalInfo({
        width: img.width,
        height: img.height,
        size: file.size,
      });
    };
    img.src = url;
  }, []);

  // 폼 초기화
  const resetForm = useCallback(() => {
    setPose('');
    setPoseKo('');
    setSelectedFile(null);
    if (preview) {
      URL.revokeObjectURL(preview);
    }
    setPreview(null);
    setOriginalInfo(null);
    setQualityWarning(false);
  }, [preview]);

  // 업로드 핸들러
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.warning('이미지를 선택해주세요.');
      return;
    }

    if (!pose) {
      toast.warning('포즈 이름을 입력해주세요.');
      return;
    }

    if (!/^[a-z0-9-]+$/.test(pose)) {
      toast.warning('포즈 이름은 영문 소문자, 숫자, 하이픈만 사용할 수 있습니다.');
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('character', character);
      formData.append('pose', pose);
      if (poseKo) {
        formData.append('poseKo', poseKo);
      }

      const res = await fetch('/api/admin/images/characters', {
        method: 'POST',
        body: formData,
      });

      const result = await res.json();

      if (result.success) {
        const { variants, qualityWarning } = result.data;
        const undersizedCount = variants.filter(v => v.isUndersized).length;

        if (undersizedCount > 0) {
          toast.warning(
            `"${pose}" 포즈가 업로드되었습니다. (${undersizedCount}개 해상도가 원본 크기로 저장됨)`,
            { duration: 5000 }
          );
        } else {
          toast.success(`"${pose}" 포즈가 업로드되었습니다. (${variants.length}개 해상도)`);
        }
        resetForm();
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
  const handleSelectImage = (variants) => {
    setSelectedVariants(variants);
    setDetailOpen(true);
  };

  // 이미지 삭제
  const handleDeleteImage = async (variants) => {
    if (!variants || variants.length === 0) return;

    setDeleting(true);

    try {
      const keys = variants.map((v) => v.key).join(',');
      const res = await fetch(`/api/admin/images?keys=${encodeURIComponent(keys)}`, {
        method: 'DELETE',
      });

      const result = await res.json();

      if (result.success) {
        toast.error(`${result.data.deleted.length}개 이미지가 삭제되었습니다.`);
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

  // 예상 해상도 정보
  const estimatedVariants = originalInfo
    ? RESOLUTION_SIZES.map(({ size, label }) => {
        const scale = Math.min(1, size / Math.max(originalInfo.width, originalInfo.height));
        const estimatedSize = Math.round(originalInfo.size * scale * 0.3); // WebP 압축 예상
        return { size, label, estimatedSize };
      })
    : [];

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold">캐릭터 이미지</h1>
          <p className="text-muted-foreground">
            호루(호랑이)와 누리(삽살개) 캐릭터 이미지를 관리합니다.
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
                  <p className="font-medium text-foreground">4단계 해상도 자동 생성</p>
                  <ul className="mt-1 space-y-1 text-muted-foreground">
                    <li>• 원본: <span className="text-foreground">2000px</span></li>
                    <li>• lg: <span className="text-foreground">1000px</span></li>
                    <li>• md: <span className="text-foreground">500px</span></li>
                    <li>• sm: <span className="text-foreground">200px</span></li>
                  </ul>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <p className="font-medium text-foreground">저장 경로</p>
                  <p className="mt-1 text-muted-foreground font-mono text-xs">
                    characters/{'{캐릭터}'}/{'{포즈}'}.webp
                  </p>
                </div>
                <p className="text-xs text-muted-foreground">
                  * 원본 2000px 미만 시 품질 경고 표시
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
          {/* 캐릭터 선택 */}
          <div className="space-y-2">
            <Label>캐릭터 선택</Label>
            <div className="flex gap-4">
              {CHARACTERS.map((char) => (
                <button
                  key={char.id}
                  type="button"
                  onClick={() => setCharacter(char.id)}
                  className={cn(
                    'flex-1 rounded-lg border p-4 text-left transition-all',
                    character === char.id
                      ? 'border-primary bg-primary/5 ring-2 ring-primary'
                      : 'hover:border-primary/50'
                  )}
                >
                  <p className="font-medium">{char.name}</p>
                  <p className="text-sm text-muted-foreground">{char.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* 포즈 정보 입력 */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="pose">포즈 이름 (영문) <span className="text-destructive">*</span></Label>
              <Input
                id="pose"
                placeholder="예: happy, greeting, think"
                value={pose}
                onChange={(e) => setPose(e.target.value.toLowerCase())}
              />
              <p className="text-xs text-muted-foreground">
                영문 소문자, 숫자, 하이픈만 사용
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="poseKo">한글 설명 (선택)</Label>
              <Input
                id="poseKo"
                placeholder="예: 행복한 표정"
                value={poseKo}
                onChange={(e) => setPoseKo(e.target.value)}
              />
            </div>
          </div>

          {/* 드롭존 */}
          {!selectedFile && (
            <ImageDropzone
              onFilesSelected={handleFileSelected}
              multiple={false}
              disabled={uploading}
            />
          )}

          {/* 미리보기 */}
          {selectedFile && originalInfo && (
            <ImagePreview
              file={selectedFile}
              previewUrl={preview}
              originalInfo={originalInfo}
              variants={estimatedVariants}
              qualityWarning={qualityWarning}
              onRemove={resetForm}
            />
          )}

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2">
            {selectedFile && (
              <Button
                variant="outline"
                onClick={resetForm}
                disabled={uploading}
              >
                <RotateCcw className="mr-2 size-4" />
                초기화
              </Button>
            )}
            <Button
              onClick={handleUpload}
              disabled={uploading}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  업로드 중...
                </>
              ) : (
                <>
                  <Upload className="mr-2 size-4" />
                  저장하기
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
            {CHARACTERS.find((c) => c.id === character)?.name} 이미지
          </h2>
          <Button variant="ghost" size="sm" onClick={fetchImages}>
            <RotateCcw className="mr-2 size-4" />
            새로고침
          </Button>
        </div>

        <CharacterImageGrid
          images={existingImages}
          loading={loading}
          onSelect={handleSelectImage}
          onDelete={handleDeleteImage}
          emptyMessage="아직 업로드된 이미지가 없습니다."
        />
      </div>

      {/* 상세 모달 */}
      <CharacterDetailModal
        open={detailOpen}
        onOpenChange={setDetailOpen}
        variants={selectedVariants}
        onDelete={() => handleDeleteImage(selectedVariants)}
        deleting={deleting}
      />
    </div>
  );
}
