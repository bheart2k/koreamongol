"use client";

import {
  CircleCheck,
  Info,
  LoaderCircle,
  OctagonX,
  TriangleAlert,
} from "lucide-react"
import { useTheme } from "next-themes"
import { Toaster as Sonner } from "sonner"

/**
 * 커스텀 Toaster - 오방색 테마 적용
 *
 * 사용법:
 * import { toast } from 'sonner';
 *
 * toast.success('성공 메시지');
 * toast.error('에러 메시지');
 * toast.warning('경고 메시지');
 * toast.info('정보 메시지');
 */
const Toaster = ({ ...props }) => {
  const { theme = "system" } = useTheme()

  return (
    <Sonner
      theme={theme}
      className="toaster group"
      position="top-center"
      icons={{
        success: <CircleCheck className="h-5 w-5 text-status-success" />,
        info: <Info className="h-5 w-5 text-status-info" />,
        warning: <TriangleAlert className="h-5 w-5 text-status-warning" />,
        error: <OctagonX className="h-5 w-5 text-status-error" />,
        loading: <LoaderCircle className="h-5 w-5 animate-spin text-accent" />,
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border group-[.toaster]:border-border group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:px-4 group-[.toaster]:py-3",
          title: "group-[.toast]:font-semibold group-[.toast]:text-sm",
          description: "group-[.toast]:text-muted-foreground group-[.toast]:text-sm",
          actionButton:
            "group-[.toast]:bg-accent group-[.toast]:text-white group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium",
          cancelButton:
            "group-[.toast]:bg-hanji-200 group-[.toast]:text-ink-700 group-[.toast]:rounded-lg group-[.toast]:px-3 group-[.toast]:py-1.5 group-[.toast]:text-sm group-[.toast]:font-medium",
          success: "group-[.toaster]:border-status-success/30",
          error: "group-[.toaster]:border-status-error/30",
          warning: "group-[.toaster]:border-status-warning/30",
          info: "group-[.toaster]:border-status-info/30",
        },
      }}
      {...props}
    />
  );
}

export { Toaster }
