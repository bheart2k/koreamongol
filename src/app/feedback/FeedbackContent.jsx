'use client';

// /feedback — 표준 통합 패널(FeedbackPanel)의 전체 화면 렌더 (source: form).
// 2026-09-02 표준 UI 교체: 구 4문항(유용성·신뢰도·편의성·추천) 폼 폐지 — 기존 행은 어댑터가 계속 노출.
// FAB 팝오버와 같은 패널을 재사용한다(중복 폼 금지 — 허브 스펙 §4).
import { useState } from 'react';
import Link from 'next/link';
import { MessageSquareHeart, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FeedbackPanel } from '@/components/feedback/feedback-panel';

export default function FeedbackContent() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <main className="min-h-content bg-background flex items-center justify-center px-6">
        <div className="max-w-md text-center py-20">
          <CheckCircle2 className="w-12 h-12 text-gold mx-auto mb-4" />
          <h1 className="text-headline text-navy dark:text-sky mb-3">Баярлалаа!</h1>
          <p className="text-body text-muted-foreground mb-8">
            Таны санал бидэнд хүрлээ. Сайтыг сайжруулахад ашиглана.
          </p>
          <Button asChild variant="terracotta">
            <Link href="/">Нүүр хуудас руу буцах</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-content bg-background">
      {/* Hero */}
      <section className="py-12 md:py-16 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-6">
            <MessageSquareHeart className="w-8 h-8 text-accent" />
          </div>
          <h1 className="text-display mb-4">Санал хүсэлт</h1>
          <p className="text-body text-muted-foreground">
            Сайтын талаарх таны үнэлгээ, санал бидэнд маш чухал. Алдаа олсон бол мэдэгдээрэй.
          </p>
        </div>
      </section>

      <section className="px-6 pb-20">
        <div className="max-w-2xl mx-auto p-6 rounded-xl border border-border bg-card">
          <FeedbackPanel source="form" onDone={() => setSubmitted(true)} />
        </div>
      </section>
    </main>
  );
}
