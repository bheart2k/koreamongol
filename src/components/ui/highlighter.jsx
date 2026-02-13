"use client";
import { useEffect, useRef, memo } from "react"
import { useInView } from "motion/react"
import { annotate } from "rough-notation"
import { cn } from "@/lib/utils"

/**
 * Highlighter Component
 * 
 * 부모의 리렌더링에 영향을 받지 않고 설정된 delay 이후 단 한 번만 애니메이션을 수행합니다.
 */
export const Highlighter = memo(function Highlighter({
  children,
  action = "highlight",
  color = "#ffd1dc",
  strokeWidth = 1.5,
  animationDuration = 600,
  iterations = 2,
  padding = 2,
  multiline = false,
  isView = false,
  className,
  delay = 0,
}) {
  const elementRef = useRef(null)
  const annotationRef = useRef(null)
  const isCommitted = useRef(false); // 효과 시작 여부 잠금

  const isInView = useInView(elementRef, {
    once: true,
    margin: "-10%",
  })

  const shouldShow = !isView || isInView

  useEffect(() => {
    // 이미 프로세스가 진행 중이거나 보여줄 조건이 아니면 차단
    if (!shouldShow || isCommitted.current) return;

    const element = elementRef.current;
    if (!element) return;

    isCommitted.current = true; // 단 한 번의 실행을 보장하기 위해 즉시 잠금

    let timeoutId = setTimeout(() => {
      // 렌더링 시점의 설정값 고정
      const annotation = annotate(element, {
        type: action,
        color,
        strokeWidth,
        animationDuration,
        iterations,
        padding,
        multiline,
      });

      annotationRef.current = annotation;
      annotation.show();
    }, delay);

    return () => {
      clearTimeout(timeoutId);
      if (annotationRef.current) {
        annotationRef.current.remove();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shouldShow]); // 오직 표시 조건에만 반응하며, delay 등 다른 값이 변해도 실행중인 타이머는 유지됨

  return (
    <span ref={elementRef} className={cn("relative inline-block bg-transparent", className)}>
      {children}
    </span>
  );
});
