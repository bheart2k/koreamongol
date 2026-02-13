'use client';

import { easeOut, motion } from 'motion/react';
import * as React from 'react';
import { cn } from '@/lib/utils';

/**
 * FlipCard - 재사용 가능한 플립 카드 베이스 컴포넌트
 *
 * @description 호버/클릭 시 앞뒤가 뒤집히는 카드 컴포넌트
 * @param {ReactNode} front - 앞면 콘텐츠
 * @param {ReactNode} back - 뒷면 콘텐츠
 * @param {string} size - 카드 크기 ('sm' | 'md' | 'lg')
 * @param {function} onClick - 클릭 핸들러 (선택)
 * @param {function} onFlip - 뒤집힘 핸들러 (선택) - 뒤집힐 때 호출
 * @param {string} className - 추가 스타일
 */
export function FlipCard({
  front,
  back,
  size = 'md',
  onClick,
  onFlip,
  className,
}) {
  const [isFlipped, setIsFlipped] = React.useState(false);
  const hasFlipped = React.useRef(false);

  const isTouchDevice =
    typeof window !== 'undefined' && 'ontouchstart' in window;

  const handleClick = () => {
    if (isTouchDevice) {
      const newFlipped = !isFlipped;
      setIsFlipped(newFlipped);
      // 첫 번째 뒤집힘에서만 onFlip 호출
      if (newFlipped && !hasFlipped.current) {
        hasFlipped.current = true;
        onFlip?.();
      }
    }
    onClick?.();
  };

  const handleMouseEnter = () => {
    if (!isTouchDevice) {
      setIsFlipped(true);
      // 첫 번째 뒤집힘에서만 onFlip 호출
      if (!hasFlipped.current) {
        hasFlipped.current = true;
        onFlip?.();
      }
    }
  };

  const handleMouseLeave = () => {
    if (!isTouchDevice) setIsFlipped(false);
  };

  const cardVariants = {
    front: { rotateY: 0, transition: { duration: 0.5, ease: easeOut } },
    back: { rotateY: 180, transition: { duration: 0.5, ease: easeOut } },
  };

  // 크기별 스타일 (모바일 크게, 데스크톱은 그리드에 맞게)
  const sizeClasses = {
    sm: 'w-72 h-96 lg:w-56 lg:h-80',
    md: 'w-80 h-[26rem] lg:w-72 lg:h-[24rem]',
    lg: 'w-80 h-[28rem] lg:w-80 lg:h-[26rem]',
  };

  return (
    <div
      className={cn(
        'relative perspective-1000 cursor-pointer',
        sizeClasses[size],
        className
      )}
      onClick={handleClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* FRONT */}
      <motion.div
        className="absolute inset-0 backface-hidden rounded-2xl border border-border/50 flex flex-col bg-gradient-to-br from-card via-background to-card shadow-lg overflow-hidden"
        animate={isFlipped ? 'back' : 'front'}
        variants={cardVariants}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {front}
      </motion.div>

      {/* BACK */}
      <motion.div
        className="absolute inset-0 backface-hidden rounded-2xl border border-border/50 flex flex-col bg-gradient-to-tr from-card via-background to-card shadow-lg overflow-hidden"
        initial={{ rotateY: 180 }}
        animate={isFlipped ? 'front' : 'back'}
        variants={cardVariants}
        style={{ transformStyle: 'preserve-3d', rotateY: 180 }}
      >
        {back}
      </motion.div>
    </div>
  );
}

export default FlipCard;
