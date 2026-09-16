'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import styles from '@/components/guide/ServicePages.module.css';
import contact from './contact.module.css';
import pageStyles from '@/components/guide/IllustratedGuide.module.css';
import { Mail, Send, CheckCircle, AlertCircle, HelpCircle, Lightbulb, Bug, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { toast } from 'sonner';

const faqs = [
  {
    question: 'KoreaMongol гэж юу вэ?',
    answer: 'KoreaMongol нь Солонгос, Монголын хоорондын соёл, амьдрал, мэдээллийг хуваалцах платформ юм. Солонгосд амьдарч буй Монголчууд болон Монголд сонирхолтой Солонгос иргэдэд зориулагдсан.',
  },
  {
    question: 'Хамтын ажиллагааны талаар хэрхэн холбогдох вэ?',
    answer: 'Хамтын ажиллагаа, контент ашиглалт зэрэг бизнесийн асуудлаар koreamongol@googlegroups.com руу имэйл илгээнэ үү. Гарчигт [Хамтын ажиллагаа] гэж бичвэл хурдан хариу авна.',
  },
  {
    question: 'Алдаа олсон бол хаана мэдэгдэх вэ?',
    answer: 'Гарын авлага хуудас бүрийн доод хэсэгт "Мэдээлэл засах" товч байна. Мөн доорх формоор эсвэл koreamongol@googlegroups.com руу мэдэгдэж болно. Аль хуудсанд, ямар нөхцөлд асуудал гарсныг дэлгэрэнгүй бичвэл хурдан засна.',
  },
  {
    question: 'KoreaMongol үнэгүй юу?',
    answer: 'Тийм, KoreaMongol-ын бүх функц үнэ төлбөргүй. Сайтын ажиллагааг дэмжих зорилгоор зар сурталчилгаа харагдаж болно.',
  },
];

const CATEGORIES = [
  { value: 'general', label: 'Ерөнхий асуулт', icon: MessageCircle, tone: 'blue' },
  { value: 'improvement', label: 'Сайжруулалт', icon: Lightbulb, tone: 'amber' },
  { value: 'bug', label: 'Алдаа мэдэгдэх', icon: Bug, tone: 'coral' },
  { value: 'other', label: 'Бусад', icon: HelpCircle, tone: 'purple' },
];

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

export default function ContactContent() {
  return (
    <Suspense>
      <ContactPageContent />
    </Suspense>
  );
}

function ContactPageContent() {
  const searchParams = useSearchParams();
  const defaultCategory = searchParams.get('category') || 'general';

  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [formData, setFormData] = useState({
    subject: '',
    content: '',
    email: '',
  });
  const [status, setStatus] = useState('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/inbox', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'inquiry',
          category: selectedCategory,
          subject: formData.subject,
          content: formData.content,
          email: formData.email,
          ...getClientMeta(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Илгээхэд алдаа гарлаа.');
      }

      setStatus('success');
      toast.success('Мессеж амжилттай илгээгдлээ!');
      setFormData({ subject: '', content: '', email: '' });
      setSelectedCategory('general');
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <main className={`${pageStyles.page} ${styles.page} ${contact.page} min-h-content`}>
      {/* Hero Section */}
      <section>
        <div className="max-w-4xl mx-auto">
          <div className={contact.eyebrow}><MessageCircle size={18} aria-hidden="true" /> KOREAMONGOL · ХОЛБОО БАРИХ</div>
          <h1 className="font-bold mb-4">Холбоо барих</h1>
          <p className="text-base text-muted-foreground max-w-xl">
            Асуулт, санал, сэтгэгдэл байвал хүссэн үедээ холбогдоно уу. Аль болох хурдан хариу өгөхийг хичээнэ.
          </p>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-8 md:py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className={contact.layout}>
            <aside className={contact.aside}>
              <div className={contact.note}>
                <span className={contact.noteIcon}><Mail size={23} aria-hidden="true" /></span>
                <h2>Шууд холбогдох</h2>
                <p>Имэйлээр холбогдохыг хүсвэл:</p>
                <a href="mailto:koreamongol@googlegroups.com">koreamongol@googlegroups.com</a>
                <div className={contact.response}>
                  <h3>Хариу өгөх хугацаа</h3>
                  <p>Ажлын өдрөөр 1-2 хоногт хариу өгнө. Яаралтай асуудал бол имэйлээр шууд холбогдоно уу.</p>
                </div>
              </div>
              <div className={contact.hint}>
                <Lightbulb size={19} aria-hidden="true" />
                <p>Алдаа мэдэгдэх бол тухайн хуудасны холбоос, юу болсныг хамт бичээрэй.</p>
              </div>
            </aside>

            {/* Contact Form */}
            <div
              className={contact.formColumn}
            >
              <div className={`${styles.form} ${contact.form}`}>
                {status === 'success' ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-title mb-2">Мессеж илгээгдлээ!</h3>
                    <p className="text-muted-foreground mb-6">
                      Аль болох хурдан хариу өгөхийг хичээнэ.
                    </p>
                    <Button
                      variant="outline" className="hover:bg-secondary hover:text-secondary-foreground"
                      onClick={() => setStatus('idle')}
                    >
                      Шинэ мессеж бичих
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className={contact.formHeading}>
                      <h2>Мессеж илгээх</h2>
                      <p>Асуулт, санал эсвэл тулгарсан асуудлаа бидэнд бичээрэй.</p>
                    </div>
                    {/* 카테고리 선택 */}
                    <fieldset>
                      <legend className="block text-sm font-medium mb-3">Төрөл</legend>
                      <div className={`${styles.categories} grid grid-cols-2 gap-2`}>
                        {CATEGORIES.map((cat) => {
                          const Icon = cat.icon;
                          const isSelected = selectedCategory === cat.value;
                          return (
                            <button
                              key={cat.value}
                              type="button"
                              onClick={() => setSelectedCategory(cat.value)}
                              className={contact.category}
                              aria-pressed={isSelected}
                            >
                              <span className={contact.categoryIcon} data-tone={cat.tone}><Icon size={19} aria-hidden="true" /></span>
                              <span className="min-w-0">{cat.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </fieldset>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Имэйл{' '}
                        <span className="text-muted-foreground font-normal">
                          (Хариу авахыг хүсвэл)
                        </span>
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="you@example.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Гарчиг *
                      </label>
                      <Input
                        id="subject"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="Асуултын гарчиг"
                      />
                    </div>

                    <div>
                      <label htmlFor="content" className="block text-sm font-medium mb-2">
                        Агуулга *
                      </label>
                      <textarea
                        id="content"
                        name="content"
                        required
                        rows={5}
                        maxLength={5000}
                        value={formData.content}
                        onChange={handleChange}
                        placeholder="Асуултаа дэлгэрэнгүй бичнэ үү"
                        className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                      />
                      <div className="text-xs text-muted-foreground mt-1 text-right">
                        {formData.content.length}/5000
                      </div>
                    </div>

                    {status === 'error' && (
                      <div className="flex items-center gap-2 text-sm text-error">
                        <AlertCircle className="w-4 h-4" />
                        {errorMessage || 'Илгээхэд алдаа гарлаа. Дахин оролдоно уу.'}
                      </div>
                    )}

                    <Button
                      type="submit"
                      className="w-full min-h-11 bg-terracotta text-white hover:bg-terracotta-dark"
                      disabled={status === 'loading'}
                    >
                      {status === 'loading' ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Илгээж байна...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" />
                          Мессеж илгээх
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <div
          >
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                <HelpCircle className="w-5 h-5 text-accent" />
              </div>
              <h2 className="text-headline">Түгээмэл асуултууд</h2>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`faq-${index}`}
                  className="bg-card border border-border rounded-xl px-6 data-[state=open]:border-accent/30"
                >
                  <AccordionTrigger className="text-left hover:no-underline py-4">
                    <span className="text-sm font-medium pr-4">{faq.question}</span>
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <p className="text-sm text-muted-foreground mt-8 text-center">
              Хүссэн хариултаа олсонгүй юу? Дээрх формоор холбогдоно уу.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}
