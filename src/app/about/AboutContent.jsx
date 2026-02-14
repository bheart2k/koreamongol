'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import {
  Heart, Globe, Mail, Sparkles,
  AlertTriangle, Target, Shield,
  FileText, Plane, Hospital, Banknote, MessageCircle,
  Briefcase, Home, GraduationCap, Calculator, Train, Phone,
  Wrench, BookOpen, Compass,
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
];

const tools = [
  { icon: Calculator, title: 'Ханш тооцоолуур', desc: 'KRW-MNT ханш шууд тооцоолох', href: '/exchange' },
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
    <main className="min-h-content bg-background">
      {/* Hero */}
      <section className="relative py-16 md:py-24 px-6">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-accent/5 rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-display mb-6">
              Солонгос ба Монголын
              <br />
              <span className="text-accent">хоорондын гүүр</span>
            </h1>
            <p className="text-body-lg text-muted-foreground max-w-xl mx-auto">
              Солонгост амьдарч, ажиллаж, суралцаж буй монгол иргэдэд зориулсан монгол хэлээрх амьдралын гарын авлага.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why KoreaMongol */}
      <section className="py-16 md:py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-headline mb-4">Яагаад KoreaMongol?</h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {whyReasons.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Guides */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-headline mb-4">Бидний гарын авлага</h2>
            <p className="text-body text-muted-foreground">
              Солонгос амьдралын бүх чиглэлд туслах мэдээлэл
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {guides.map((guide, index) => {
              const Icon = guide.icon;
              return (
                <motion.div
                  key={guide.href}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                >
                  <Link
                    href={guide.href}
                    className="block h-full p-4 rounded-xl border border-border bg-card hover:border-accent/40 hover:shadow-sm transition-all"
                  >
                    <Icon className="w-5 h-5 text-accent mb-2" />
                    <p className="text-sm font-semibold mb-1">{guide.title}</p>
                    <p className="text-xs text-muted-foreground">{guide.desc}</p>
                  </Link>
                </motion.div>
              );
            })}
          </div>

          <div className="mt-4 max-w-xs mx-auto">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Link
                  key={tool.href}
                  href={tool.href}
                  className="flex items-center gap-3 p-4 rounded-xl border border-border bg-card hover:border-accent/40 hover:shadow-sm transition-all"
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
      <section className="py-16 md:py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-headline mb-4">Хэнд зориулсан?</h2>
          </motion.div>

          <div className="grid sm:grid-cols-3 gap-6">
            {targetUsers.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-headline mb-8 text-center">Бидний зорилго</h2>
            <div className="bg-card border border-border rounded-2xl p-8 md:p-10">
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
          </motion.div>
        </div>
      </section>

      {/* Creator */}
      <section className="py-16 md:py-20 px-6 bg-muted/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-headline mb-8 text-center">Хөгжүүлэгч</h2>
            <div className="bg-card border border-border rounded-2xl p-8 md:p-10">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center shrink-0">
                  <Sparkles className="w-8 h-8 text-accent" />
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
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  <a href="mailto:koreamongol@googlegroups.com" className="hover:text-accent transition-colors">
                    koreamongol@googlegroups.com
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Together */}
      <section className="py-16 md:py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-headline mb-8 text-center">Хамтдаа бүтээе</h2>
            <div className="bg-card border-2 border-gold/30 rounded-2xl p-8 md:p-10">
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
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-headline mb-4">Хамтдаа</h2>
            <p className="text-body text-muted-foreground mb-8">
              Асуулт, санал байвал хүссэн үедээ холбогдоно уу.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button asChild variant="outline" size="lg">
                <Link href="/contact">Холбоо барих</Link>
              </Button>
              <Button asChild size="lg" className="bg-gold hover:bg-gold/90 text-navy">
                <Link href="/donate">
                  <Heart className="w-4 h-4 mr-2" />
                  Дэмжлэг үзүүлэх
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
