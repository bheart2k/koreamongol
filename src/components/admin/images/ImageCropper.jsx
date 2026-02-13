'use client';

import { useCallback, useRef, useState } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const ASPECT_OPTIONS = [
  { label: '자유', value: null },
  { label: '1:1', value: 1 },
  { label: '16:9', value: 16 / 9 },
  { label: '4:3', value: 4 / 3 },
];

export function ImageCropper({
  open,
  onOpenChange,
  imageSrc,
  fileName,
  onComplete,
}) {
  const imgRef = useRef(null);
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState(null);
  const [aspect, setAspect] = useState(null);
  const [processing, setProcessing] = useState(false);

  // 이미지 로드 시 초기 크롭 영역 설정
  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;

    const newCrop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        aspect || width / height,
        width,
        height
      ),
      width,
      height
    );

    setCrop(newCrop);
  }, [aspect]);

  // 비율 변경 시 크롭 영역 재설정
  const handleAspectChange = (newAspect) => {
    setAspect(newAspect);

    if (imgRef.current) {
      const { width, height } = imgRef.current;

      if (newAspect) {
        const newCrop = centerCrop(
          makeAspectCrop(
            {
              unit: '%',
              width: 90,
            },
            newAspect,
            width,
            height
          ),
          width,
          height
        );
        setCrop(newCrop);
      }
    }
  };

  // 크롭된 이미지를 Blob으로 변환
  const getCroppedImageBlob = useCallback(() => {
    return new Promise((resolve, reject) => {
      if (!imgRef.current || !completedCrop) {
        reject(new Error('이미지 또는 크롭 영역이 없습니다.'));
        return;
      }

      const image = imgRef.current;
      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      const pixelCrop = {
        x: completedCrop.x * scaleX,
        y: completedCrop.y * scaleY,
        width: completedCrop.width * scaleX,
        height: completedCrop.height * scaleY,
      };

      canvas.width = pixelCrop.width;
      canvas.height = pixelCrop.height;

      const ctx = canvas.getContext('2d');
      ctx.drawImage(
        image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );

      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('이미지 변환에 실패했습니다.'));
          }
        },
        'image/jpeg',
        0.95
      );
    });
  }, [completedCrop]);

  // 크롭 완료
  const handleComplete = async () => {
    if (!completedCrop) {
      toast.warning('크롭 영역을 선택해주세요.');
      return;
    }

    setProcessing(true);

    try {
      const blob = await getCroppedImageBlob();
      onComplete?.(blob, fileName);
      onOpenChange?.(false);
    } catch (error) {
      console.error('Crop error:', error);
      toast.error('이미지 크롭에 실패했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  // 크롭 없이 원본 사용
  const handleSkip = async () => {
    if (!imageSrc) return;

    setProcessing(true);

    try {
      // 원본 이미지를 Blob으로 변환
      const response = await fetch(imageSrc);
      const blob = await response.blob();
      onComplete?.(blob, fileName);
      onOpenChange?.(false);
    } catch (error) {
      console.error('Skip crop error:', error);
      toast.error('이미지 처리에 실패했습니다.');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>이미지 크롭</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 비율 선택 */}
          <div className="space-y-2">
            <Label>크롭 비율</Label>
            <div className="flex gap-2">
              {ASPECT_OPTIONS.map((option) => (
                <Button
                  key={option.label}
                  variant={aspect === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleAspectChange(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* 크롭 영역 */}
          <div className="flex justify-center rounded-lg bg-muted p-4">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={aspect}
                className="max-w-full"
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="크롭할 이미지"
                  onLoad={onImageLoad}
                  className="max-w-full max-h-[50vh] object-contain"
                />
              </ReactCrop>
            )}
          </div>

          {/* 안내 */}
          <p className="text-sm text-muted-foreground text-center">
            드래그하여 크롭 영역을 조절하세요.
          </p>

          {/* 액션 버튼 */}
          <div className="flex justify-end gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange?.(false)}
              disabled={processing}
            >
              취소
            </Button>
            <Button
              variant="secondary"
              onClick={handleSkip}
              disabled={processing}
            >
              원본 사용
            </Button>
            <Button
              onClick={handleComplete}
              disabled={processing || !completedCrop}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 size-4 animate-spin" />
                  처리 중...
                </>
              ) : (
                '크롭 적용'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
