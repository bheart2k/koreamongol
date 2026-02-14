'use client';

import { useState } from 'react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { cva } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

const iconWrapperVariants = cva(
  'w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl text-white font-medium',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-br from-accent-light to-accent',
        warning: 'bg-gradient-to-br from-[#D4A017] to-status-warning',
        error: 'bg-gradient-to-br from-[#C43B38] to-status-error',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const actionButtonVariants = cva(
  'px-5 py-2.5 rounded-lg text-[14px] font-semibold tracking-wide transition-all cursor-pointer font-sans',
  {
    variants: {
      variant: {
        default: 'bg-accent text-accent-foreground hover:bg-accent-dark',
        warning: 'bg-status-warning text-white hover:bg-status-warning-dark',
        error: 'bg-status-error text-white hover:bg-status-error-dark',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
);

const icons = {
  default: '?',
  warning: '!',
  error: '🗑',
};

/**
 * ConfirmDialog - 확인/취소 다이얼로그
 *
 * 사용법 1: trigger 방식 (단순)
 * <ConfirmDialog
 *   trigger={<Button>삭제</Button>}
 *   title="삭제하시겠습니까?"
 *   description="이 작업은 되돌릴 수 없습니다."
 *   variant="error"
 *   onConfirm={() => handleDelete()}
 * />
 *
 * 사용법 2: open 제어 방식 (상태 제어 필요 시)
 * <ConfirmDialog
 *   open={showDialog}
 *   onOpenChange={setShowDialog}
 *   title="삭제하시겠습니까?"
 *   description="이 작업은 되돌릴 수 없습니다."
 *   variant="error"
 *   loading={deleting}
 *   onConfirm={() => handleDelete()}
 * />
 */
function ConfirmDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  cancelText = '취소',
  confirmText = '확인',
  variant = 'default',
  loading = false,
  onConfirm,
  onCancel,
  children,
}) {
  const icon = icons[variant];
  const isControlled = open !== undefined;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="max-w-[400px] rounded-2xl p-7 bg-background">
        <AlertDialogHeader className="flex-row items-start gap-3 space-y-0">
          <div className={cn(iconWrapperVariants({ variant }))}>
            {icon}
          </div>
          <div className="pt-1">
            <AlertDialogTitle className="font-serif text-lg font-bold tracking-tight text-foreground">
              {title}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-sm font-medium leading-relaxed opacity-80 text-foreground mt-3">
          {description}
        </AlertDialogDescription>
        {children}
        <AlertDialogFooter className="gap-3 mt-4">
          <AlertDialogCancel
            onClick={onCancel}
            disabled={loading}
            className="bg-muted text-muted-foreground hover:bg-muted/80 px-5 py-2.5 rounded-lg text-[14px] font-semibold tracking-wide font-sans"
          >
            {cancelText}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={onConfirm}
            disabled={loading}
            className={cn(actionButtonVariants({ variant }))}
          >
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

/**
 * SimpleAlertDialog - 확인만 있는 알림 다이얼로그
 *
 * 사용법 1: trigger 방식
 * <SimpleAlertDialog
 *   trigger={<Button>알림</Button>}
 *   title="완료되었습니다"
 *   description="저장이 완료되었습니다."
 * />
 *
 * 사용법 2: open 제어 방식
 * <SimpleAlertDialog
 *   open={showAlert}
 *   onOpenChange={setShowAlert}
 *   title="완료되었습니다"
 *   description="저장이 완료되었습니다."
 * />
 */
function SimpleAlertDialog({
  trigger,
  open,
  onOpenChange,
  title,
  description,
  confirmText = '확인',
  variant = 'default',
  onConfirm,
  children,
}) {
  const icon = icons[variant];

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      {trigger && <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>}
      <AlertDialogContent className="max-w-[400px] rounded-2xl p-7 bg-background">
        <AlertDialogHeader className="flex-row items-start gap-3 space-y-0">
          <div className={cn(iconWrapperVariants({ variant }))}>
            {icon}
          </div>
          <div className="pt-1">
            <AlertDialogTitle className="font-serif text-lg font-bold tracking-tight text-foreground">
              {title}
            </AlertDialogTitle>
          </div>
        </AlertDialogHeader>
        <AlertDialogDescription className="text-sm font-medium leading-relaxed opacity-80 text-foreground mt-3">
          {description}
        </AlertDialogDescription>
        {children}
        <AlertDialogFooter className="mt-4">
          <AlertDialogAction
            onClick={onConfirm}
            className={cn(actionButtonVariants({ variant }))}
          >
            {confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export { ConfirmDialog, SimpleAlertDialog };
