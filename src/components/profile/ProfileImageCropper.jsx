'use client';

import { useState, useRef, useCallback } from 'react';
import ReactCrop, { centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

/**
 * 프로필 이미지 크롭 컴포넌트
 * - 1:1 비율 크롭
 * - 원형 미리보기
 * - 업로드 처리
 */
export default function ProfileImageCropper({
  open,
  onClose,
  imageSrc,
  userId,
  onSuccess,
}) {
  const [crop, setCrop] = useState();
  const [completedCrop, setCompletedCrop] = useState();
  const [isUploading, setIsUploading] = useState(false);
  const imgRef = useRef(null);

  // 이미지 로드 시 중앙에 정사각형 크롭 영역 설정
  const onImageLoad = useCallback((e) => {
    const { width, height } = e.currentTarget;

    // 1:1 비율로 중앙에 크롭 영역 설정
    const crop = centerCrop(
      makeAspectCrop(
        {
          unit: '%',
          width: 90,
        },
        1, // aspect ratio 1:1
        width,
        height
      ),
      width,
      height
    );

    setCrop(crop);
  }, []);

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

      // 크롭된 영역 크기
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

  // 업로드 처리
  const handleUpload = async () => {
    try {
      setIsUploading(true);

      const blob = await getCroppedImageBlob();
      const formData = new FormData();
      formData.append('file', blob, 'profile.jpg');
      formData.append('folder', 'profiles');
      formData.append('userId', userId);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        onSuccess(result.data.url);
        onClose();
      } else {
        throw new Error(result.error || '업로드 실패');
      }
    } catch (error) {
      console.error('프로필 이미지 업로드 오류:', error);
      toast.error('이미지 업로드에 실패했습니다.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>프로필 이미지 편집</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 크롭 영역 */}
          <div className="relative max-h-[60vh] overflow-auto flex items-center justify-center bg-muted/30 rounded-lg p-2">
            {imageSrc && (
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={1}
                circularCrop
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

          {/* 안내 문구 */}
          <p className="text-sm text-muted-foreground text-center">
            드래그하여 프로필로 사용할 영역을 선택하세요
          </p>

          {/* 버튼 */}
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={onClose} disabled={isUploading}>
              취소
            </Button>
            <Button onClick={handleUpload} disabled={isUploading || !completedCrop}>
              {isUploading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  업로드 중...
                </>
              ) : (
                '적용하기'
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
