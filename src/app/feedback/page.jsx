'use client';

import { useState } from 'react';

import { motion } from 'motion/react';
import { MessageSquarePlus, Send, CheckCircle, AlertCircle, Lightbulb, Bug, Sparkles, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const CATEGORIES = [
  {
    value: 'feature_request',
    label: 'Шинэ функц',
    desc: 'Шинэ функц, үйлчилгээ санал болгох',
    icon: Sparkles,
    color: 'text-purple-600 bg-purple-100',
  },
  {
    value: 'improvement',
    label: 'Сайжруулалт',
    desc: 'Одоо байгаа функцийг сайжруулах',
    icon: Lightbulb,
    color: 'text-yellow-600 bg-yellow-100',
  },
  {
    value: 'bug_report',
    label: 'Алдаа мэдэгдэх',
    desc: 'Алдаа, асуудал мэдэгдэх',
    icon: Bug,
    color: 'text-red-600 bg-red-100',
  },
  {
    value: 'other',
    label: 'Бусад',
    desc: 'Бусад санал, сэтгэгдэл',
    icon: HelpCircle,
    color: 'text-gray-600 bg-gray-100',
  },
];

export default function FeedbackPage() {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    guestEmail: '',
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      toast.warning('Ангилал сонгоно уу.');
      return;
    }

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category: selectedCategory,
          ...formData,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to submit feedback');
      }

      setStatus('success');
      toast.success('Санал хүсэлт илгээгдлээ!');
      setFormData({ title: '', content: '', guestEmail: '' });
      setSelectedCategory('');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
      toast.error('Илгээхэд алдаа гарлаа.');
    }
  };

  return (
    <main className="min-h-content bg-background">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-primary/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <MessageSquarePlus className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-display mb-4">Санал хүсэлт</h1>
            <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
              KoreaMongol-ыг илүү сайн болгоход туслаарай. Таны санал бидний хөгжилд чухал.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Feedback Form Section */}
      <section className="py-8 md:py-12 px-6">
        <div className="max-w-2xl mx-auto">
          {status === 'success' ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-border rounded-2xl p-8 text-center"
            >
              <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
              <h3 className="text-title mb-2">Санал хүсэлт хүлээн авлаа!</h3>
              <p className="text-muted-foreground mb-6">
                Үнэт саналд баярлалаа. Илүү сайн үйлчилгээ үзүүлэхийг хичээнэ.
              </p>
              <Button
                variant="outline"
                onClick={() => setStatus('idle')}
              >
                Нэмэлт санал бичих
              </Button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              {/* Category Selection */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">
                  Ямар төрлийн санал хүсэлт вэ?
                </h2>
                <div className="grid grid-cols-2 gap-3">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isSelected = selectedCategory === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setSelectedCategory(cat.value)}
                        className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all text-left ${
                          isSelected
                            ? 'border-primary bg-primary/5'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-lg ${cat.color} flex items-center justify-center flex-shrink-0`}>
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">{cat.label}</div>
                          <div className="text-xs text-muted-foreground mt-0.5">{cat.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium mb-2">
                    Гарчиг *
                  </label>
                  <Input
                    id="title"
                    name="title"
                    type="text"
                    required
                    maxLength={100}
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="Санал хүсэлтийн гарчиг"
                  />
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {formData.title.length}/100
                  </div>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2">
                    Агуулга *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    required
                    maxLength={2000}
                    rows={6}
                    value={formData.content}
                    onChange={handleChange}
                    placeholder="Санал хүсэлтээ дэлгэрэнгүй бичнэ үү. Нарийвчлалтай байх тусам хурдан шийдвэрлэнэ."
                    className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                  />
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {formData.content.length}/2000
                  </div>
                </div>

                {/* Email (선택) */}
                <div>
                  <label htmlFor="guestEmail" className="block text-sm font-medium mb-2">
                    Имэйл{' '}
                    <span className="text-muted-foreground font-normal">
                      (Сонголттой - хариу авахыг хүсвэл)
                    </span>
                  </label>
                  <Input
                    id="guestEmail"
                    name="guestEmail"
                    type="email"
                    value={formData.guestEmail}
                    onChange={handleChange}
                    placeholder="you@example.com"
                  />
                </div>

                {status === 'error' && (
                  <div className="flex items-center gap-2 text-sm text-error">
                    <AlertCircle className="w-4 h-4" />
                    {errorMessage || 'Илгээхэд алдаа гарлаа. Дахин оролдоно уу.'}
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={status === 'loading' || !selectedCategory}
                >
                  {status === 'loading' ? (
                    <>
                      <span className="animate-spin mr-2">⏳</span>
                      Илгээж байна...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Санал хүсэлт илгээх
                    </>
                  )}
                </Button>
              </form>

              {/* Info Box */}
              <div className="mt-6 p-4 bg-muted/30 rounded-xl">
                <p className="text-sm text-muted-foreground text-center">
                  Хүлээн авсан санал хүсэлтийг хянаж үйлчилгээнд тусгана. Бүх саналыг анхааралтай уншиж байна.
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </main>
  );
}
