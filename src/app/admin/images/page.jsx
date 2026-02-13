'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Cat, Image, ArrowRight, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

// 파일 크기 포맷
function formatSize(bytes) {
  if (!bytes) return '0 B';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function ImagesPage() {
  const [stats, setStats] = useState({
    characters: { count: 0, size: 0, loading: true },
    general: { count: 0, size: 0, loading: true },
  });

  useEffect(() => {
    // 캐릭터 이미지 통계
    fetch('/api/admin/images?prefix=characters/')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const images = data.data.images || [];
          setStats((prev) => ({
            ...prev,
            characters: {
              count: images.length,
              size: images.reduce((sum, img) => sum + (img.size || 0), 0),
              loading: false,
            },
          }));
        }
      })
      .catch(() => {
        setStats((prev) => ({
          ...prev,
          characters: { ...prev.characters, loading: false },
        }));
      });

    // 일반 이미지 통계
    fetch('/api/admin/images?prefix=general/')
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const images = data.data.images || [];
          setStats((prev) => ({
            ...prev,
            general: {
              count: images.length,
              size: images.reduce((sum, img) => sum + (img.size || 0), 0),
              loading: false,
            },
          }));
        }
      })
      .catch(() => {
        setStats((prev) => ({
          ...prev,
          general: { ...prev.general, loading: false },
        }));
      });
  }, []);

  const cards = [
    {
      title: '캐릭터 이미지',
      description: '호루(호랑이)와 누리(삽살개) 캐릭터 이미지를 관리합니다.',
      href: '/admin/images/characters',
      icon: Cat,
      stats: stats.characters,
      features: [
        '4단계 해상도 자동 생성',
        '2000 / 1000 / 500 / 200px',
        'WebP 자동 변환',
      ],
    },
    {
      title: '일반 이미지',
      description: '배너, 아이콘 등 범용 이미지를 관리합니다.',
      href: '/admin/images/general',
      icon: Image,
      stats: stats.general,
      features: [
        '300KB / 1920px 자동 압축',
        '크롭 기능 지원',
        '다중 파일 업로드',
      ],
    },
  ];

  return (
    <div className="space-y-8">
      {/* 헤더 */}
      <div>
        <h1 className="text-2xl font-bold">이미지 관리</h1>
        <p className="text-muted-foreground">
          KoreaMongol에서 사용되는 이미지를 관리합니다.
        </p>
      </div>

      {/* 카드 그리드 */}
      <div className="grid gap-6 md:grid-cols-2">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className={cn(
              'group relative rounded-xl border bg-card p-6 transition-all',
              'hover:border-primary hover:shadow-lg'
            )}
          >
            {/* 아이콘 */}
            <div className="mb-4 flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <card.icon className="size-6" />
            </div>

            {/* 제목 */}
            <h2 className="text-lg font-semibold">{card.title}</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {card.description}
            </p>

            {/* 통계 */}
            <div className="mt-4 flex items-center gap-4">
              {card.stats.loading ? (
                <Loader2 className="size-4 animate-spin text-muted-foreground" />
              ) : (
                <>
                  <div className="rounded bg-muted px-2 py-1 text-sm">
                    {card.stats.count}개 파일
                  </div>
                  <div className="rounded bg-muted px-2 py-1 text-sm">
                    {formatSize(card.stats.size)}
                  </div>
                </>
              )}
            </div>

            {/* 기능 목록 */}
            <ul className="mt-4 space-y-1">
              {card.features.map((feature) => (
                <li
                  key={feature}
                  className="flex items-center gap-2 text-sm text-muted-foreground"
                >
                  <span className="size-1 rounded-full bg-primary" />
                  {feature}
                </li>
              ))}
            </ul>

            {/* 화살표 */}
            <div className="absolute right-6 top-6 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-primary">
              <ArrowRight className="size-5" />
            </div>
          </Link>
        ))}
      </div>

      {/* 안내 */}
      <div className="rounded-xl border bg-muted/50 p-6">
        <h3 className="font-semibold">이미지 관리 안내</h3>
        <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
          <li>• 모든 이미지는 Cloudflare R2에 저장됩니다.</li>
          <li>• 캐릭터 이미지는 업로드 시 4단계 해상도로 자동 생성됩니다.</li>
          <li>• 일반 이미지는 300KB / 1920px 기준으로 자동 압축됩니다.</li>
          <li>• 드래그앤드롭 또는 Ctrl+V로 이미지를 업로드할 수 있습니다.</li>
        </ul>
      </div>
    </div>
  );
}
