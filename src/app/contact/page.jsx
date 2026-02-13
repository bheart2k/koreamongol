'use client';

import { useState } from 'react';

import { motion } from 'motion/react';
import { Mail, Send, CheckCircle, AlertCircle, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    question: 'KoreaMongol гэж юу вэ?',
    answer: 'KoreaMongol нь Солонгос, Монголын хоорондын соёл, амьдрал, мэдээллийг хуваалцах платформ юм. Солонгосд амьдарч буй Монголчууд болон Монголд сонирхолтой Солонгос иргэдэд зориулагдсан.',
  },
  {
    question: 'Хамтын ажиллагааны талаар хэрхэн холбогдох вэ?',
    answer: 'Хамтын ажиллагаа, контент ашиглалт зэрэг бизнесийн асуудлаар hello@koreamongol.com руу имэйл илгээнэ үү. Гарчигт [Хамтын ажиллагаа] гэж бичвэл хурдан хариу авна.',
  },
  {
    question: 'Алдаа олсон бол хаана мэдэгдэх вэ?',
    answer: 'Алдаа мэдэгдсэнд баярлалаа! Доорх формоор эсвэл hello@koreamongol.com руу мэдэгдэнэ үү. Аль хуудсанд, ямар нөхцөлд асуудал гарсныг дэлгэрэнгүй бичвэл хурдан засна.',
  },
  {
    question: 'KoreaMongol үнэгүй юу?',
    answer: 'Тийм, KoreaMongol-ын бүх функц үнэ төлбөргүй. Сайтын ажиллагааг дэмжих зорилгоор зар сурталчилгаа харагдаж болно.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
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
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send message');
      }

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setStatus('error');
      setErrorMessage(error.message);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-display mb-6">Холбоо барих</h1>
            <p className="text-body-lg text-muted-foreground max-w-xl mx-auto whitespace-pre-line">
              {'Асуулт, санал, сэтгэгдэл байвал хүссэн үедээ холбогдоно уу.\nАль болох хурдан хариу өгөхийг хичээнэ.'}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Info & Form Section */}
      <section className="py-8 md:py-16 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid md:grid-cols-5 gap-8 md:gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="md:col-span-2"
            >
              <h2 className="text-headline mb-6">Холбоо барих</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Имэйл</h3>
                    <a
                      href="mailto:hello@koreamongol.com"
                      className="text-sm text-muted-foreground hover:text-accent transition-colors"
                    >
                      hello@koreamongol.com
                    </a>
                  </div>
                </div>

                <div className="bg-muted/30 rounded-xl p-4">
                  <p className="text-sm text-muted-foreground">
                    Ажлын өдрөөр 1-2 хоногт хариу өгнө. Яаралтай асуудал бол имэйлээр шууд холбогдоно уу.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="md:col-span-3"
            >
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
                {status === 'success' ? (
                  <div className="text-center py-8">
                    <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
                    <h3 className="text-title mb-2">Мессеж илгээгдлээ!</h3>
                    <p className="text-muted-foreground mb-6">
                      Аль болох хурдан хариу өгөхийг хичээнэ.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => setStatus('idle')}
                    >
                      Шинэ мессеж бичих
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Нэр{' '}
                        <span className="text-muted-foreground font-normal">(Сонголттой)</span>
                      </label>
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Таны нэр"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Имэйл *
                      </label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
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
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Агуулга *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        required
                        rows={5}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Асуултаа дэлгэрэнгүй бичнэ үү"
                        className="flex w-full rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
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
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-12 md:py-16 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
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
          </motion.div>
        </div>
      </section>
    </main>
  );
}
