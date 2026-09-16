'use client';

import Link from 'next/link';
import styles from './about.module.css';
import pageStyles from '@/components/guide/IllustratedGuide.module.css';
import {
  Heart, Mail, Sparkles, ArrowRight, ChevronRight,
  AlertTriangle, Target, Shield,
  FileText, Plane, Hospital, Banknote, MessageCircle,
  Briefcase, Home, GraduationCap, Calculator, Train, Phone,
  Wrench, BookOpen, Compass, Smartphone,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const whyReasons = [
  {
    icon: AlertTriangle,
    title: 'Асуудал',
    desc: 'Солонгост амьдрах мэдээлэл олон газар тархсан, ихэнх нь солонгос эсвэл англи хэлээр. Монгол хэлээр найдвартай мэдээллийн нэгдсэн эх сурвалж байхгүй.',
  },
  {
    icon: Target,
    title: 'Шийдэл',
    desc: 'KoreaMongol нь виз, эмнэлэг, мөнгө шилжүүлэг, ажил, орон сууц зэрэг бүхий л мэдээллийг монгол хэлээр нэг дор цуглуулсан.',
  },
  {
    icon: Shield,
    title: 'Найдвартай',
    desc: 'Мэдээлэл бүрийг нягтлан шалгаж, албан ёсны эх сурвалжаас авсан. Буруу мэдээлэл олвол хэрэглэгчид шууд мэдэгдэх боломжтой.',
  },
];

const guides = [
  { icon: FileText, title: 'Визний гарын авлага', desc: 'E-9, D-2, D-4, F-4 визний төрөл, шаардлага', href: '/visa' },
  { icon: Plane, title: 'Ирсний дараах гарын авлага', desc: 'Гадаадын иргэний бүртгэл, банк, утас, даатгал', href: '/arrival' },
  { icon: Hospital, title: 'Эмнэлэг / Яаралтай', desc: 'Эмнэлэгт хандах, яаралтай дугаарууд', href: '/hospital' },
  { icon: Banknote, title: 'Мөнгө шилжүүлэг', desc: 'Монгол руу мөнгө илгээх арга, хураамж', href: '/money' },
  { icon: MessageCircle, title: 'Бодит Солонгос хэл', desc: 'Өдөр тутмын хэрэгтэй үг, хэллэг, соёл', href: '/korean-life' },
  { icon: Briefcase, title: 'Ажил / Хөдөлмөр', desc: 'Хөдөлмөрийн эрх, цалин, гомдол гаргах', href: '/jobs' },
  { icon: Home, title: 'Орон сууц', desc: 'Байр хайх, гэрээ, анхаарах зүйлс', href: '/housing' },
  { icon: GraduationCap, title: 'TOPIK / EPS-TOPIK', desc: 'Шалгалтын бэлтгэл, бүртгэл, зөвлөгөө', href: '/topik' },
  { icon: Train, title: 'Тээвэр', desc: 'Метро, автобус, такси, KTX мэдээлэл', href: '/transport' },
  { icon: Phone, title: 'Яаралтай утас', desc: 'Бүх чухал утасны дугаар нэг хуудсанд', href: '/emergency' },
  { icon: Smartphone, title: 'Хэрэгтэй апп', desc: 'KakaoTalk, Coupang, тооцоолуурууд', href: '/apps' },
];

const tools = [
  { icon: Calculator, title: 'Ханш тооцоолуур', desc: 'KRW-MNT ханш шууд тооцоолох', href: '/exchange' },
  { icon: Calculator, title: 'Тэтгэмж тооцоолуур', desc: 'Ажлаас гарах тэтгэмж тооцоолох', href: '/severance' },
];

const targetUsers = [
  {
    icon: Wrench,
    title: 'E-9 ажилчид',
    desc: 'Үйлдвэрт ажилладаг, чөлөөт цаг хязгаартай, солонгос хэл төдийлөн мэддэггүй ажилчдад хэрэгтэй бүх мэдээлэл.',
  },
  {
    icon: BookOpen,
    title: 'D-2/D-4 оюутнууд',
    desc: 'Их сургууль, хэлний сургуульд суралцаж буй оюутнуудад зориулсан виз, даатгал, амьдралын зөвлөгөө.',
  },
  {
    icon: Compass,
    title: 'Ирэх гэж буй хүмүүс',
    desc: 'Монголоос Солонгос руу ирэхээр бэлдэж буй хүмүүст визний мэдээлэл, бэлтгэлийн зөвлөгөө.',
  },
];

export default function AboutContent() {
  return (
    <main className={`${pageStyles.page} ${styles.page} min-h-content`}>
      {/* Hero */}
      <section className={styles.hero}>
        <nav className={styles.breadcrumb} aria-label="Хуудасны зам">
          <Link href="/" aria-label="Нүүр"><Home aria-hidden="true" /></Link>
          <ChevronRight aria-hidden="true" /><span aria-current="page">Танилцуулга</span>
        </nav>
        <div className={styles.heroText}>
          <div
          >
            <h1 className={styles.title}>
              Солонгос ба Монголын
              <br />
              <span>хоорондын гүүр</span>
            </h1>
            <p className={styles.intro}>
              Солонгост амьдарч, ажиллаж, суралцаж буй монгол иргэдэд зориулсан монгол хэлээрх амьдралын гарын авлага.
            </p>
          </div>
        </div>
      </section>

      {/* Why KoreaMongol */}
      <section className={styles.section}>
        <div className="max-w-6xl mx-auto">
          <div
            className={styles.sectionHeading}
          >
            <h2 className={styles.sectionTitle}>Яагаад KoreaMongol?</h2>
          </div>

          <div className={styles.threeColumns}>
            {whyReasons.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={styles.infoCard}
                >
                  <div className={styles.infoIcon}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Guides */}
      <section className={styles.section}>
        <div className="max-w-6xl mx-auto">
          <div
            className={styles.sectionHeading}
          >
            <h2 className={styles.sectionTitle}>Бидний гарын авлага</h2>
            <p className="text-body text-muted-foreground">
              Солонгос амьдралын бүх чиглэлд туслах мэдээлэл
            </p>
          </div>

          <div className={styles.guideGrid}>
            {guides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <div
                  key={guide.href}
                >
                  <Link
                    href={guide.href}
                    className={styles.guideLink}
                  >
                    <Icon className={styles.linkIcon} aria-hidden="true" /><ArrowRight className={styles.linkArrow} aria-hidden="true" />
                    <p className="text-sm font-semibold mb-1">{guide.title}</p>
                    <p className="text-xs text-muted-foreground">{guide.desc}</p>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className={styles.tools}>
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className={styles.toolLink}
                >
                  <Icon className="w-5 h-5 text-accent shrink-0" />
                  <div>
                    <p className="text-sm font-semibold">{tool.title}</p>
                    <p className="text-xs text-muted-foreground">{tool.desc}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Target Users */}
      <section className={styles.section}>
        <div className="max-w-6xl mx-auto">
          <div
            className={styles.sectionHeading}
          >
            <h2 className={styles.sectionTitle}>Хэнд зориулсан?</h2>
          </div>

          <div className={styles.threeColumns}>
            {targetUsers.map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={styles.infoCard}
                >
                  <div className={styles.infoIcon}>
                    <Icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className={styles.section}>
        <div className="max-w-4xl mx-auto">
          <div
          >
            <h2 className={styles.sectionTitle}>Бидний зорилго</h2>
            <div className={styles.prose}>
              <div className="space-y-6 text-body text-muted-foreground">
                <p>
                  Солонгост олон мянган монгол иргэн амьдарч байна. Гэвч монгол хэлээрх найдвартай мэдээллийн эх сурвалж дутмаг.
                </p>
                <p>
                  KoreaMongol нь виз, эмнэлэг, мөнгө шилжүүлэг, ажил, орон сууц зэрэг амьдралын бүх чиглэлээр баталгаатай мэдээллийг монгол хэлээр нэг дор цуглуулсан.
                </p>
                <p className="text-foreground font-medium">
                  Бид мэдээлэл тус бүрийг албан ёсны эх сурвалжаас авч, нягтлан шалгасан.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Creator */}
      <section className={styles.section}>
        <div className="max-w-4xl mx-auto">
          <div
          >
            <h2 className={styles.sectionTitle}>Хөгжүүлэгч</h2>
            <div className={styles.prose}>
              <div className="flex items-start gap-6 mb-6">
                <div className={styles.creatorIcon}>
                  <Sparkles className="w-6 h-6" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-title font-semibold mb-1">KoreaMongol</h3>
                  <p className="text-sm text-muted-foreground">1 хүний төсөл</p>
                </div>
              </div>
              <div className="space-y-4 text-body text-muted-foreground">
                <p>
                  Сайн байна уу. KoreaMongol-ыг хөгжүүлж буй хүн байна. Үндсэн ажлын дараа чөлөөт цагаараа энэ сайтыг бүтээж байна.
                </p>
                <p>
                  Монгол хэлээр мэдээлэл дутмаг байгааг мэдэрч энэ төслийг эхлүүлсэн. Солонгосд амьдарч буй монгол иргэдэд бодитой тусламж өгөхийг хүсч байна.
                </p>
              </div>
              <div className="mt-8 pt-6 border-t border-border">
                <div className="flex items-start gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4 shrink-0 mt-1" aria-hidden="true" />
                  <a href="mailto:koreamongol@googlegroups.com" className={styles.email}>
                    koreamongol@googlegroups.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Together */}
      <section className={styles.section}>
        <div className="max-w-4xl mx-auto">
          <div
          >
            <h2 className={styles.sectionTitle}>Хамтдаа бүтээе</h2>
            <div className={`${styles.prose} ${styles.notice}`}>
              <div className="space-y-4 text-body text-muted-foreground">
                <p>
                  Бид мэдээлэл бүрийг нягтлан шалгаж бичсэн. Гэхдээ хууль, журам, үнэ ханш байнга өөрчлөгддөг тул алдаа байж болно.
                </p>
                <p>
                  Хэрвээ буруу мэдээлэл олвол гарын авлага хуудасны доод хэсэгт байрлах <strong className="text-foreground">&quot;Мэдээлэл засах&quot;</strong> товч дээр дарж бидэнд мэдэгдэнэ үү.
                </p>
                <p className="text-foreground font-medium">
                  Та бүхний тусламжтайгаар илүү найдвартай мэдээллийн платформ болно.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={styles.section}>
        <div className="max-w-2xl mx-auto text-center">
          <div
          >
            <h2 className={styles.sectionTitle}>Хамтдаа</h2>
            <p className="text-body text-muted-foreground mb-8">
              Асуулт, санал байвал хүссэн үедээ холбогдоно уу.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline" size="lg" className="hover:bg-secondary hover:text-secondary-foreground">
                <Link href="/contact">Холбоо барих</Link>
              </Button>
              <Button asChild size="lg" className="bg-terracotta hover:bg-terracotta-dark text-white">
                <Link href="/donate">
                  <Heart className="w-4 h-4 mr-2" />
                  Дэмжлэг үзүүлэх
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
