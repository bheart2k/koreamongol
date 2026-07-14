'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { ArrowRight, FileText, MapPin, Heart, Banknote, BookOpen, Users, Coffee, Briefcase, Home, GraduationCap, Calculator, Train, Phone, Smartphone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const guides = [
  {
    id: 'visa',
    href: '/visa',
    icon: FileText,
    title: 'Визний гарын авлага',
    desc: 'E-9, D-2, D-4 визний мэдээлэл',
    available: true,
  },
  {
    id: 'arrival',
    href: '/arrival',
    icon: MapPin,
    title: 'Ирсний дараа',
    desc: 'Бүртгэл, банк, утас нээлгэх',
    available: true,
  },
  {
    id: 'hospital',
    href: '/hospital',
    icon: Heart,
    title: 'Эмнэлэг / Яаралтай',
    desc: 'Эмнэлэгт хандах, яаралтай дуудлага',
    available: true,
  },
  {
    id: 'money',
    href: '/money',
    icon: Banknote,
    title: 'Мөнгө ба санхүү',
    desc: 'Шилжүүлэг, банк, карт, даатгал',
    available: true,
  },
  {
    id: 'korean',
    href: '/korean-life',
    icon: BookOpen,
    title: 'Бодит Солонгос хэл',
    desc: 'Сурах бичигт байдаггүй чухал зүйлс',
    available: true,
  },
  {
    id: 'jobs',
    href: '/jobs',
    icon: Briefcase,
    title: 'Ажил ба хөдөлмөр',
    desc: 'Цалин, гэрээ, эрхийн хамгаалалт',
    available: true,
  },
  {
    id: 'housing',
    href: '/housing',
    icon: Home,
    title: 'Байр ба орон сууц',
    desc: 'Барьцаа, түрээс, гэрээ, амьдрал',
    available: true,
  },
  {
    id: 'topik',
    href: '/topik',
    icon: GraduationCap,
    title: 'TOPIK / EPS-TOPIK',
    desc: 'Шалгалтын бүтэц, бүртгэл, бэлтгэл',
    available: true,
  },
  {
    id: 'transport',
    href: '/transport',
    icon: Train,
    title: 'Тээврийн гарын авлага',
    desc: 'Метро, автобус, такси, KTX',
    available: true,
  },
  {
    id: 'emergency',
    href: '/emergency',
    icon: Phone,
    title: 'Яаралтай утасны дугаарууд',
    desc: '119, 112, 1345 — бүх дугаар',
    available: true,
  },
  {
    id: 'exchange',
    href: '/exchange',
    icon: Calculator,
    title: 'Ханш тооцоолуур',
    desc: 'KRW ↔ MNT ханш хөрвүүлэг',
    available: true,
  },
  {
    id: 'severance',
    href: '/severance',
    icon: Calculator,
    title: 'Тэтгэмж тооцоолуур',
    desc: 'Ажлаас гарах тэтгэмж тооцоолох',
    available: true,
  },
  {
    id: 'apps',
    href: '/apps',
    icon: Smartphone,
    title: 'Хэрэгтэй апп',
    desc: 'KakaoTalk, Coupang, тооцоолуурууд',
    available: true,
  },
  {
    id: 'community',
    href: '/community/blog',
    icon: Users,
    title: 'Нутгийнхан',
    desc: 'Хамт олны мэдээ, асуулт хариулт',
    available: true,
  },
];

const situations = [
  { emoji: '🛬', label: 'Би дөнгөж ирлээ', href: '/arrival' },
  { emoji: '💸', label: 'Цалингаа аваагүй', href: '/jobs#jobs-rights' },
  { emoji: '🏦', label: 'Гэртээ мөнгө илгээх', href: '/money' },
  { emoji: '🏥', label: 'Эмч үзүүлэх хэрэгтэй', href: '/hospital' },
  { emoji: '💼', label: 'Ажил хайж байна', href: '/jobs' },
];

export default function HomeContent() {
  return (
    <main className="min-h-content bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-sky to-background">
        <div className="relative z-10 max-w-4xl mx-auto text-center px-6 py-20 md:py-28">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-4xl mb-4">🇰🇷 🇲🇳</p>
            <h1 className="text-display text-navy dark:text-sky mb-4">
              Солонгост тавтай морил!
            </h1>
            <p className="text-body-lg text-muted-foreground mb-8">
              Виз, банк, эмнэлэг, цалин, мөнгөн шилжүүлэг — Солонгост амьдрахад
              хэрэгтэй бүх мэдээлэл монгол хэлээр, үнэ төлбөргүй.
            </p>

            <p className="text-sm font-medium text-navy dark:text-sky mb-3">
              Яг одоо танд юу хэрэгтэй вэ?
            </p>
            <div className="flex flex-wrap justify-center gap-2 mb-8">
              {situations.map((s) => (
                <Link
                  key={s.href + s.label}
                  href={s.href}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card text-sm text-foreground hover:border-gold/50 hover:shadow-sm transition-all"
                >
                  <span>{s.emoji}</span>
                  {s.label}
                </Link>
              ))}
            </div>

            <Button asChild variant="terracotta" size="lg">
              <Link href="#guides">
                Бүх гарын авлага үзэх
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Emergency Banner */}
      <section className="bg-terracotta text-white py-4 px-6">
        <div className="max-w-4xl mx-auto flex justify-center gap-8 flex-wrap text-sm font-semibold font-heading">
          <span>🚑 Яаралтай: 119</span>
          <span>🚔 Цагдаа: 112</span>
          <span>📞 Гадаадын иргэн: 1345</span>
        </div>
      </section>

      {/* Guide Cards */}
      <section id="guides" className="py-16 md:py-24 px-6 scroll-mt-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-headline text-navy dark:text-sky mb-4">
              Гарын авлага
            </h2>
            <p className="text-body text-muted-foreground">
              Солонгост амьдрахад хэрэгтэй бүх мэдээлэл
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {guides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <motion.div
                  key={guide.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.08 }}
                >
                  {guide.available ? (
                    <Link
                      href={guide.href}
                      className="group block h-full bg-card border border-border rounded-2xl p-6 hover:shadow-lg hover:border-gold/40 transition-all duration-300"
                    >
                      <div className="w-11 h-11 rounded-lg bg-sky dark:bg-navy-light flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                        <Icon className="w-5 h-5 text-navy dark:text-gold" />
                      </div>
                      <h3 className="text-title text-navy dark:text-sky mb-1 text-base font-semibold">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{guide.desc}</p>
                    </Link>
                  ) : (
                    <div className="h-full bg-card border border-border rounded-2xl p-6 opacity-60">
                      <div className="w-11 h-11 rounded-lg bg-sky dark:bg-navy-light flex items-center justify-center mb-4">
                        <Icon className="w-5 h-5 text-navy dark:text-gold" />
                      </div>
                      <h3 className="text-base font-semibold text-navy dark:text-sky mb-1">
                        {guide.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">{guide.desc}</p>
                      <span className="inline-block mt-3 text-xs text-muted-foreground">
                        Удахгүй нээгдэнэ
                      </span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 md:py-24 px-6 bg-warm dark:bg-navy/30">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-headline text-navy dark:text-sky mb-6">
              KoreaMongol
            </h2>
            <p className="text-body text-muted-foreground mb-4">
              Солонгост амьдарч буй Монгол иргэдэд зориулсан платформ. Визний мэдээлэл, банк нээх, эмнэлэг хандах зэрэг бодит амьдралын гарын авлагыг нэг дороос олоорой.
            </p>
            <p className="text-body text-muted-foreground">
              Нутаг — таны Солонгос амьдралын найдвартай хөтөч.
            </p>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-terracotta font-medium mt-6 hover:gap-3 transition-all"
            >
              Дэлгэрэнгүй
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Donate Section */}
      <section className="py-10 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="rounded-xl border border-gold/40 bg-gold/5 px-6 py-4 flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              <Coffee className="w-6 h-6 text-gold shrink-0" />
              <p className="text-sm text-muted-foreground text-center sm:text-left flex-1">
                <span className="font-medium text-foreground">Нэг аяга кофегоор дэмжээрэй.</span>{' '}
                Сайтын тогтвортой үйл ажиллагаанд тусална.
              </p>
              <Link
                href="/donate"
                className="shrink-0 inline-flex items-center gap-1.5 px-5 py-2 rounded-full bg-gold text-navy font-semibold hover:bg-gold/90 transition-colors text-sm"
              >
                <Heart className="w-3.5 h-3.5" />
                Дэмжих
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
