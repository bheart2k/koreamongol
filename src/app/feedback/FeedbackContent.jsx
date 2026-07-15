'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Star, MessageSquareHeart, Loader2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

const RATING_QUESTIONS = [
  { key: 'ratingUseful', question: 'Мэдээлэл танд хэр тусалсан бэ?' },
  { key: 'ratingTrust', question: 'Мэдээлэл хэр найдвартай санагдсан бэ?' },
  { key: 'ratingEasy', question: 'Сайт ашиглахад хялбар байсан уу?' },
  { key: 'ratingRecommend', question: 'Бусдад санал болгох уу?' },
];

const CATEGORIES = [
  { value: 'opinion', label: 'Сэтгэгдэл' },
  { value: 'bug', label: 'Алдаа мэдэгдэх' },
  { value: 'improvement', label: 'Сайжруулах санал' },
];

function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-1" role="radiogroup">
      {[1, 2, 3, 4, 5].map((n) => (
        <button
          key={n}
          type="button"
          role="radio"
          aria-checked={value === n}
          aria-label={`${n}/5`}
          onClick={() => onChange(value === n ? null : n)}
          className="p-1 transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              value != null && n <= value
                ? 'fill-gold text-gold'
                : 'text-muted-foreground/40'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function FeedbackContent() {
  const { data: session } = useSession();
  const [ratings, setRatings] = useState({
    ratingUseful: null,
    ratingTrust: null,
    ratingEasy: null,
    ratingRecommend: null,
  });
  const [category, setCategory] = useState('opinion');
  const [comment, setComment] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const hasRating = Object.values(ratings).some((v) => v != null);
    if (!hasRating && !comment.trim()) {
      toast.error('Үнэлгээ өгөх эсвэл санал бичнэ үү.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category,
          ...ratings,
          comment: comment.trim(),
          email: !session?.user ? email.trim() : undefined,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Санал илгээгдлээ. Баярлалаа!');
        setSubmitted(true);
      } else {
        toast.error(data.error || 'Алдаа гарлаа.');
      }
    } catch {
      toast.error('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setLoading(false);
    }
  };

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
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-8">
          {/* 평점 */}
          <div className="p-6 rounded-xl border border-border bg-card space-y-5">
            <h2 className="text-base font-semibold font-heading text-navy dark:text-sky">
              Үнэлгээ (1~5 од)
            </h2>
            {RATING_QUESTIONS.map(({ key, question }) => (
              <div
                key={key}
                className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <p className="text-sm text-foreground">{question}</p>
                <StarRating
                  value={ratings[key]}
                  onChange={(v) => setRatings((r) => ({ ...r, [key]: v }))}
                />
              </div>
            ))}
          </div>

          {/* 유형 + 의견 */}
          <div className="p-6 rounded-xl border border-border bg-card space-y-5">
            <div className="space-y-2">
              <Label>Төрөл</Label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    className={`px-4 py-2 rounded-full border text-sm transition-all ${
                      category === c.value
                        ? 'border-gold bg-gold/10 text-gold-dark font-medium'
                        : 'border-border bg-card text-muted-foreground hover:border-gold/40'
                    }`}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="feedback-comment">Санал, сэтгэгдэл</Label>
              <Textarea
                id="feedback-comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Санал, алдааны мэдээлэл, сайжруулах зүйлээ бичнэ үү..."
                rows={5}
                maxLength={3000}
              />
              <p className="text-xs text-muted-foreground text-right">
                {comment.length}/3000
              </p>
            </div>

            {/* 비로그인 이메일 (선택) */}
            {!session?.user && (
              <div className="space-y-2">
                <Label htmlFor="feedback-email">И-мэйл (заавал биш)</Label>
                <Input
                  id="feedback-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                />
                <p className="text-xs text-muted-foreground">
                  Алдаа, саналд хариу авахыг хүсвэл и-мэйлээ үлдээгээрэй.
                </p>
              </div>
            )}
          </div>

          <Button type="submit" disabled={loading} className="w-full" size="lg">
            {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
            Илгээх
          </Button>
        </form>
      </section>
    </main>
  );
}
