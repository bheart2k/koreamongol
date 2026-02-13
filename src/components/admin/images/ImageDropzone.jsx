'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Upload, ImagePlus } from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
const WARNING_SIZE = 100 * 1024 * 1024; // 100MB

export function ImageDropzone({
  onFilesSelected,
  accept = 'image/*',
  multiple = false,
  disabled = false,
  className,
  children,
}) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef(null);
  const dropzoneRef = useRef(null);

  // 파일 검증
  const validateFiles = useCallback((files) => {
    const validFiles = [];

    for (const file of files) {
      // 타입 검증
      if (!ALLOWED_TYPES.includes(file.type)) {
        toast.warning(`${file.name}: 지원하지 않는 형식입니다. (JPG, PNG, GIF, WebP만 가능)`);
        continue;
      }

      // 크기 경고 (업로드는 허용)
      if (file.size > WARNING_SIZE) {
        toast.warning(`${file.name}: 파일 크기가 100MB를 초과합니다. 업로드 시간이 오래 걸릴 수 있습니다.`);
      }

      validFiles.push(file);
    }

    return validFiles;
  }, []);

  // 파일 처리
  const handleFiles = useCallback((files) => {
    if (disabled) return;

    const fileArray = Array.from(files);
    const validFiles = validateFiles(fileArray);

    if (validFiles.length > 0) {
      if (multiple) {
        onFilesSelected?.(validFiles);
      } else {
        onFilesSelected?.([validFiles[0]]);
      }
    }
  }, [disabled, multiple, onFilesSelected, validateFiles]);

  // 파일 선택 핸들러
  const handleInputChange = useCallback((e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
    e.target.value = '';
  }, [handleFiles]);

  // 드래그 이벤트 핸들러
  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) {
      setIsDragging(true);
    }
  }, [disabled]);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (disabled) return;

    const files = e.dataTransfer?.files;
    if (files && files.length > 0) {
      handleFiles(files);
    }
  }, [disabled, handleFiles]);

  // 클립보드 붙여넣기 핸들러
  const handlePaste = useCallback((e) => {
    if (disabled) return;

    const items = e.clipboardData?.items;
    if (!items) return;

    const imageFiles = [];

    for (const item of items) {
      if (ALLOWED_TYPES.includes(item.type)) {
        const file = item.getAsFile();
        if (file) {
          imageFiles.push(file);
        }
      }
    }

    if (imageFiles.length > 0) {
      e.preventDefault();
      handleFiles(imageFiles);
    }
  }, [disabled, handleFiles]);

  // 클립보드 이벤트 등록
  useEffect(() => {
    const dropzone = dropzoneRef.current;
    if (!dropzone) return;

    // 드롭존에 포커스가 있을 때만 붙여넣기 동작
    const handleFocus = () => {
      document.addEventListener('paste', handlePaste);
    };

    const handleBlur = () => {
      document.removeEventListener('paste', handlePaste);
    };

    dropzone.addEventListener('focus', handleFocus);
    dropzone.addEventListener('blur', handleBlur);

    // 전역 붙여넣기도 지원
    document.addEventListener('paste', handlePaste);

    return () => {
      dropzone.removeEventListener('focus', handleFocus);
      dropzone.removeEventListener('blur', handleBlur);
      document.removeEventListener('paste', handlePaste);
    };
  }, [handlePaste]);

  // 클릭으로 파일 선택
  const handleClick = useCallback(() => {
    if (!disabled) {
      inputRef.current?.click();
    }
  }, [disabled]);

  return (
    <div
      ref={dropzoneRef}
      tabIndex={0}
      onClick={handleClick}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        'relative flex flex-col items-center justify-center gap-4 p-8',
        'rounded-xl border-2 border-dashed transition-all cursor-pointer',
        'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
        isDragging
          ? 'border-primary bg-primary/5'
          : 'border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        className="hidden"
        disabled={disabled}
      />

      {children || (
        <>
          <div className={cn(
            'flex size-16 items-center justify-center rounded-full',
            isDragging ? 'bg-primary/10' : 'bg-muted'
          )}>
            {isDragging ? (
              <ImagePlus className="size-8 text-primary" />
            ) : (
              <Upload className="size-8 text-muted-foreground" />
            )}
          </div>

          <div className="text-center">
            <p className="text-sm font-medium">
              {isDragging ? '여기에 놓으세요' : '클릭하거나 파일을 드래그하세요'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {multiple ? '여러 파일 선택 가능' : 'JPG, PNG, GIF, WebP'}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Ctrl+V로 붙여넣기 가능
            </p>
          </div>
        </>
      )}
    </div>
  );
}
