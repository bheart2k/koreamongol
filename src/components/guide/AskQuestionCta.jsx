'use client';

import { useState } from 'react';
import { MessageCircleQuestion } from 'lucide-react';
import { Button } from '@/components/ui/button';
import AskQuestionDialog from './AskQuestionDialog';

// tips 허브 등 목록형 페이지용 질문하기 CTA
export function AskQuestionCta({ pageUrl }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="p-5 rounded-xl border-2 border-gold/40 bg-gold/5 flex flex-col sm:flex-row items-center gap-4">
        <MessageCircleQuestion className="w-6 h-6 text-gold-dark shrink-0" />
        <div className="flex-1 text-center sm:text-left">
          <p className="text-sm font-medium text-foreground mb-1">
            Хайсан зүйлээ олсонгүй юу?
          </p>
          <p className="text-xs text-muted-foreground">
            Асуултаа үлдээгээрэй — бид олж мэдээд хариултыг энд нэмнэ.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setOpen(true)}
          className="shrink-0 border-gold/40 text-gold-dark hover:bg-gold/10"
        >
          Асуулт асуух
        </Button>
      </div>

      <AskQuestionDialog open={open} onOpenChange={setOpen} pageUrl={pageUrl} />
    </>
  );
}
