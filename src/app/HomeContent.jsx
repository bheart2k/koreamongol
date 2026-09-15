'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion, MotionConfig } from 'motion/react';
import styles from './HomeContent.module.css';
import { ArrowRight, FileText, MapPin, Heart, Banknote, BookOpen, Users, Coffee, Briefcase, Home, GraduationCap, Calculator, Train, Phone, Smartphone, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ExchangeMiniCard } from '@/components/home/ExchangeMiniCard';

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
  { emoji: '⚡', label: 'Түргэн хариулт', href: '/tips' },
];

const featuredTones = { visa: 'peach', arrival: 'sky', hospital: 'sage' };

export default function HomeContent({ recentUpdates = [] }) {
  return (
    <MotionConfig reducedMotion="user">
      <main className={`${styles.home} min-h-content`}>
        <section className={styles.hero} aria-labelledby="home-title">
          <div className={styles.heroGrid}>
            <div className={styles.intro}>
              <p className={styles.eyebrow}><span aria-hidden="true" /> KoreaMongol</p>
              <h1 id="home-title" className={styles.title}>Солонгост<br />тавтай морил!</h1>
              <p className={styles.lead}>
                Виз, банк, эмнэлэг, цалин, мөнгөн шилжүүлэг — Солонгост амьдрахад
                хэрэгтэй бүх мэдээлэл монгол хэлээр, үнэ төлбөргүй.
              </p>
              <Button asChild variant="terracotta" size="lg" className={styles.primaryButton}>
                <Link href="#guides">Бүх гарын авлага үзэх<ArrowRight aria-hidden="true" /></Link>
              </Button>
            </div>

            <motion.div className={styles.art} initial={false} animate={{ opacity: 1 }}>
              <Image
                src="/images/home/mazaalai-neighborhood.png"
                alt="Солонгосын гудамжинд гараа даллан мэндчилж буй Мазаалай"
                width={1448} height={1086} priority
                sizes="(min-width: 1280px) 650px, (min-width: 1024px) 55vw, (min-width: 640px) 520px, 92vw"
                className={styles.heroImage}
              />
            </motion.div>

            <div className={styles.situations}>
              <h2>Яг одоо танд юу хэрэгтэй вэ?</h2>
              <div className={styles.situationGrid}>
                {situations.map((s) => (
                  <Link key={s.href + s.label} href={s.href} className={styles.situation}>
                    <span className={styles.situationIcon} aria-hidden="true">{s.emoji}</span>
                    <span>{s.label}</span>
                    <ArrowRight className={styles.situationArrow} aria-hidden="true" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className={styles.emergency} aria-label="Яаралтай утасны дугаарууд">
          <div className={styles.emergencyInner}>
            <span><span aria-hidden="true">🚑</span> Яаралтай: <strong>119</strong></span>
            <span><span aria-hidden="true">🚔</span> Цагдаа: <strong>112</strong></span>
            <span><span aria-hidden="true">📞</span> Гадаадын иргэн: <strong>1345</strong></span>
          </div>
        </section>

        <section id="guides" className={styles.guides} aria-labelledby="guides-title">
          <div className={styles.sectionHeading}>
            <div>
              <p className={styles.sectionMark} aria-hidden="true"><BookOpen /></p>
              <h2 id="guides-title">Гарын авлага</h2>
            </div>
            <p>Солонгост амьдрахад хэрэгтэй бүх мэдээлэл</p>
          </div>
          <div className={styles.guideGrid}>
            {guides.map((guide) => {
              const Icon = guide.icon;
              const tone = featuredTones[guide.id];
              return (
                <Link href={guide.href} key={guide.id}
                  className={`${styles.guideCard} ${tone ? styles.featured : ''}`}
                  data-tone={tone}>
                  <div className={styles.guideTop}>
                    {tone ? (
                      <Image src={`/images/home/${guide.id}.png`} alt="" width={1254} height={1254}
                        sizes="(max-width: 639px) 62px, 110px" className={styles.guideArt} />
                    ) : (
                      <span className={styles.guideIcon}><Icon aria-hidden="true" strokeWidth={1.5} /></span>
                    )}
                    <ArrowRight className={styles.cardArrow} aria-hidden="true" />
                  </div>
                  <h3>{guide.title}</h3>
                  <p>{guide.desc}</p>
                </Link>
              );
            })}
          </div>
        </section>

        {recentUpdates.length > 0 && (
          <section className={styles.updates}>
            <div className={styles.updateCard}>
              <h2><RefreshCw aria-hidden="true" />Сүүлийн шинэчлэл</h2>
              <ul>
                {recentUpdates.map((item) => (
                  <li key={item.href}>
                    <Link href={item.href}>
                      <span>{item.title}</span>
                      <time dateTime={item.lastUpdated}>{item.lastUpdated}</time>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.exchange}><ExchangeMiniCard /></div>
          </section>
        )}

        <section className={styles.about}>
          <div className={styles.aboutInner}>
            <div className={styles.aboutTitle}>
              <span className={styles.aboutIcon} aria-hidden="true"><Heart strokeWidth={1.3} /></span>
              <h2>KoreaMongol</h2>
            </div>
            <div>
              <p>Солонгост амьдарч буй Монгол иргэдэд зориулсан платформ. Визний мэдээлэл, банк нээх, эмнэлэг хандах зэрэг бодит амьдралын гарын авлагыг нэг дороос олоорой.</p>
              <p>Нутаг — таны Солонгос амьдралын найдвартай хөтөч.</p>
              <Link href="/about" className={styles.textLink}>Дэлгэрэнгүй<ArrowRight aria-hidden="true" /></Link>
            </div>
          </div>
        </section>

        <section className={styles.donate}>
          <Coffee aria-hidden="true" />
          <p><strong>Нэг аяга кофегоор дэмжээрэй.</strong>{' '}Сайтын тогтвортой үйл ажиллагаанд тусална.</p>
          <Link href="/donate" className={styles.donateLink}><Heart aria-hidden="true" />Дэмжих</Link>
        </section>
      </main>
    </MotionConfig>
  );
}
