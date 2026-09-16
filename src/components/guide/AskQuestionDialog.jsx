'use client';

import { useRef, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2, MessageCircleQuestion } from 'lucide-react';
import { toast } from 'sonner';
import styles from './GuideDialog.module.css';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { getClientMeta } from './ReportDialog';

// 질문 접수 다이얼로그 — inbox type=question. 답변은 조사·검증 후 tips 페이지로 영구화
export default function AskQuestionDialog({ open, onOpenChange, pageUrl }) {
  const titleRef = useRef(null);
  const { data: session } = useSession();
  const [question, setQuestion] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!question.trim()) {
      toast.error('Асуултаа бичнэ үү.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'question',
          subject: question.trim().slice(0, 100),
          content: question.trim(),
          email: !session?.user ? email.trim() : undefined,
          pageUrl,
          ...getClientMeta(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Асуулт илгээгдлээ. Бид олж мэдээд хариулна!');
        setQuestion('');
        setEmail('');
        onOpenChange(false);
      } else {
        toast.error(data.error || 'Алдаа гарлаа.');
      }
    } catch {
      toast.error('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={styles.dialog} overlayClassName={styles.overlay} closeLabel="Хаах"
        onOpenAutoFocus={(event) => { event.preventDefault(); titleRef.current?.focus({ preventScroll: true }); }}>
        <DialogHeader className={styles.header}>
          <DialogTitle ref={titleRef} tabIndex={-1} className={styles.title}><MessageCircleQuestion aria-hidden="true" />Асуулт асуух</DialogTitle>
          <DialogDescription className={styles.description}>
            Хайсан зүйлээ олсонгүй юу? Асуултаа үлдээгээрэй — бид олж мэдээд хариулт нэмнэ.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* 질문 */}
          <div className="space-y-2">
            <Label htmlFor="ask-question">Асуулт *</Label>
            <Textarea
              id="ask-question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Юу мэдэхийг хүсэж байна вэ?"
              rows={4}
              maxLength={2000}
              required
            />
            <p className="text-xs text-muted-foreground text-right">
              {question.length}/2000
            </p>
          </div>

          {/* 비로그인 이메일 (선택) */}
          {!session?.user && (
            <div className="space-y-2">
              <Label htmlFor="ask-email">И-мэйл (заавал биш)</Label>
              <Input
                id="ask-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
              />
              <p className="text-xs text-muted-foreground">
                И-мэйл үлдээвэл хариулт бэлэн болмогц линк илгээнэ.
              </p>
            </div>
          )}

          <div className={styles.actions}>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Болих
            </Button>
            <Button type="submit" disabled={loading} className={styles.submit}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Илгээх
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
