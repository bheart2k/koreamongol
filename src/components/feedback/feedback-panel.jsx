'use client';

// 통합 피드백 패널 — 평가(기본, 별점+이유 칩) / 기능 요청 / 개선 제안 / 버그 신고 / 기타를 한 화면에서 처리.
// FAB(feedback-fab)가 우하단 팝오버로, /feedback 페이지가 전체 화면으로 같은 패널을 렌더한다.
// 제목 필드 없음(서버 자동 생성), 별점은 명시적 제출.
// 계약서: bloomingheart_next/docs/feedback-hub-스펙.md §4 (2026-09-01 개편, 한글허브 원형).
// 코리아몽골 조정: 라벨 몽골어, 칩은 표시 mn·저장 ko(micro-feedback-chips.js 참조), 별·칩 색은 사이트 gold 토큰.
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Bug, HelpCircle, Lightbulb, Send, Sparkles, Star } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { chipsFor } from './micro-feedback-chips';

const CATEGORIES = [
  { value: 'rating', label: 'Үнэлгээ', icon: Star },
  { value: 'feature_request', label: 'Шинэ боломж', icon: Sparkles },
  { value: 'improvement', label: 'Сайжруулах санал', icon: Lightbulb },
  { value: 'bug_report', label: 'Алдаа мэдэгдэх', icon: Bug },
  { value: 'other', label: 'Бусад', icon: HelpCircle },
];

export function FeedbackPanel({ source = 'quick', onDone }) {
  const pathname = usePathname();
  const [category, setCategory] = useState('rating'); // 기본은 평가
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [selectedChips, setSelectedChips] = useState([]); // ko 라벨 배열 (저장 값)
  const [content, setContent] = useState('');
  const [email, setEmail] = useState('');
  const [sending, setSending] = useState(false);

  const isRating = category === 'rating';
  const canSubmit = isRating ? rating > 0 : content.trim().length > 0;

  const toggleChip = (chipKo) => {
    setSelectedChips((prev) =>
      prev.includes(chipKo) ? prev.filter((c) => c !== chipKo) : [...prev, chipKo]
    );
  };

  const switchCategory = (value) => {
    setCategory(value);
    setSelectedChips([]); // 칩은 평가 전용
  };

  async function submit(e) {
    e.preventDefault();
    if (!canSubmit || sending) return;

    // 평가는 칩(ko 저장) + 자유입력을 합쳐 content로: "칩1, 칩2 — 자유의견"
    const trimmed = content.trim();
    const chipText = selectedChips.join(', ');
    const body = isRating
      ? {
          category: 'rating',
          rating,
          content: chipText && trimmed ? `${chipText} — ${trimmed}` : chipText || trimmed,
        }
      : { category, content: trimmed };

    setSending(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...body,
          guestEmail: email.trim(),
          pageUrl: decodeURIComponent(pathname ?? '/'),
          source,
          locale: 'mn',
          viewport: `${window.innerWidth}x${window.innerHeight}`,
          referrer: document.referrer,
          website: e.target.website?.value ?? '', // honeypot
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        toast.error(data.error ?? 'Алдаа гарлаа. Дахин оролдоно уу.');
        return;
      }
      toast.success('Санал илгээгдлээ. Баярлалаа!');
      setCategory('rating');
      setRating(0);
      setSelectedChips([]);
      setContent('');
      setEmail('');
      onDone?.();
    } catch {
      toast.error('Алдаа гарлаа. Дахин оролдоно уу.');
    } finally {
      setSending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {/* 종류 선택 */}
      <div className="flex flex-wrap gap-1.5">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          const active = category === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => switchCategory(cat.value)}
              className={`inline-flex cursor-pointer items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs transition-all ${
                active
                  ? 'border-gold bg-gold/10 text-gold-dark font-medium'
                  : 'border-border bg-card text-muted-foreground hover:border-gold/40'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {isRating ? (
        <>
          {/* 별점 (명시적 제출 - 보내기 전까지 저장 안 됨) */}
          <div className="flex flex-col items-center gap-2 py-1">
            <p className="text-sm font-medium text-foreground">Та хэр сэтгэл ханамжтай байна вэ?</p>
            <div
              className="flex items-center gap-1"
              onMouseLeave={() => setHover(0)}
              role="radiogroup"
              aria-label="Үнэлгээ"
            >
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  type="button"
                  role="radio"
                  aria-checked={rating === n}
                  aria-label={`${n}/5`}
                  onClick={() => setRating(n)}
                  onMouseEnter={() => setHover(n)}
                  className="cursor-pointer p-1 transition-transform hover:scale-110"
                >
                  <Star
                    className={`w-7 h-7 transition-colors ${
                      (hover || rating) >= n ? 'fill-gold text-gold' : 'text-muted-foreground/40'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 별점 선택 후: 이유 칩 (표시 mn, 저장 ko) */}
          {rating > 0 && (
            <div className="flex flex-col items-center gap-2">
              <p className="text-xs text-muted-foreground">
                {rating <= 3
                  ? 'Юу таалагдаагүй вэ? (заавал биш)'
                  : 'Юу таалагдсан бэ? (заавал биш)'}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                {chipsFor(null, rating).map((chip) => {
                  const active = selectedChips.includes(chip.ko);
                  return (
                    <button
                      key={chip.ko}
                      type="button"
                      aria-pressed={active}
                      onClick={() => toggleChip(chip.ko)}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-xs transition-all ${
                        active
                          ? 'border-gold bg-gold/10 text-gold-dark font-medium'
                          : 'border-border bg-card text-muted-foreground hover:border-gold/40'
                      }`}
                    >
                      {chip.mn}
                    </button>
                  );
                })}
              </div>
              <Input
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Нэмж хэлэх зүйл байвал бичнэ үү (заавал биш)"
                maxLength={500}
                className="text-sm"
              />
            </div>
          )}
        </>
      ) : (
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Санал, алдааны мэдээлэл, сайжруулах зүйлээ бичнэ үү..."
          rows={4}
          required
          maxLength={2000}
          className="text-sm leading-6"
        />
      )}

      <Input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="И-мэйл (заавал биш — хариу авахад)"
        className="text-sm"
      />
      {/* honeypot — 사람에게는 보이지 않는 필드. 봇이 채우면 서버가 저장 없이 응답 */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        className="absolute -left-[9999px] h-0 w-0 opacity-0"
      />
      <Button type="submit" className="w-full" disabled={!canSubmit || sending}>
        <Send className="w-4 h-4" />
        {sending ? 'Илгээж байна...' : 'Илгээх'}
      </Button>
    </form>
  );
}
