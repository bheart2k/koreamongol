'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
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

function getClientMeta() {
  if (typeof window === 'undefined') return {};
  return {
    currentUrl: window.location.href,
    referrer: document.referrer || '',
    screenSize: `${window.screen.width}x${window.screen.height}`,
    viewportSize: `${window.innerWidth}x${window.innerHeight}`,
    language: navigator.language || '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
  };
}

export default function ReportDialog({ open, onOpenChange, pageUrl }) {
  const { data: session } = useSession();
  const [description, setDescription] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState({ id: '', title: '' });

  // IntersectionObserver로 현재 섹션 감지
  const detectSection = useCallback(() => {
    const headings = document.querySelectorAll('h2[id]');
    let closest = { id: '', title: '' };
    const scrollY = window.scrollY + 200;

    headings.forEach((h) => {
      if (h.offsetTop <= scrollY) {
        closest = { id: h.id, title: h.textContent || '' };
      }
    });

    setCurrentSection(closest);
  }, []);

  useEffect(() => {
    if (open) {
      detectSection();
    }
  }, [open, detectSection]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!description.trim()) {
      toast.error('Тайлбар бичнэ үү.');
      return;
    }

    if (!session?.user && !email.trim()) {
      toast.error('И-мэйл хаяг оруулна уу.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'report',
          subject: currentSection.title
            ? `${currentSection.title} - Мэдээлэл засах`
            : 'Мэдээлэл засах',
          content: description.trim(),
          email: !session?.user ? email.trim() : undefined,
          pageUrl,
          sectionId: currentSection.id,
          sectionTitle: currentSection.title,
          ...getClientMeta(),
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success('Мэдэгдэл амжилттай илгээгдлээ. Баярлалаа!');
        setDescription('');
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Мэдээлэл засах</DialogTitle>
          <DialogDescription>
            Буруу мэдээлэл олсон бол бидэнд мэдэгдэнэ үү.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 감지된 섹션 표시 */}
          {currentSection.title && (
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Хэсэг</Label>
              <p className="text-sm font-medium px-3 py-2 rounded-md bg-muted">
                {currentSection.title}
              </p>
            </div>
          )}

          {/* 비로그인 이메일 */}
          {!session?.user && (
            <div className="space-y-2">
              <Label htmlFor="report-email">И-мэйл *</Label>
              <Input
                id="report-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
              />
            </div>
          )}

          {/* 설명 */}
          <div className="space-y-2">
            <Label htmlFor="report-desc">Тайлбар *</Label>
            <Textarea
              id="report-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ямар мэдээлэл буруу байгааг тайлбарлана уу..."
              rows={4}
              maxLength={2000}
              required
            />
            <p className="text-xs text-muted-foreground text-right">
              {description.length}/2000
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Болих
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
              Илгээх
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
