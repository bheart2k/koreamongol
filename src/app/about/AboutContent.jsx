'use client';

import Link from 'next/link';
import { motion } from 'motion/react';
import { Heart, Globe, Lightbulb, Users, Mail, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

const values = [
  {
    icon: Globe,
    title: 'Холбоо',
    desc: 'Солонгос-Монголын хоорондын соёлын гүүр',
  },
  {
    icon: Heart,
    title: 'Нийгэмлэг',
    desc: 'Хамтдаа суралцаж, мэдээлэл хуваалцах',
  },
  {
    icon: Lightbulb,
    title: 'Мэдээлэл',
    desc: 'Амьдрал, виз, ажил, соёлын бодит мэдээлэл',
  },
  {
    icon: Users,
    title: 'Хамтын ажиллагаа',
    desc: 'Хоёр улсын иргэдийг холбох',
  },
];

export default function AboutContent() {
  return (
    <main className="min-h-content bg-background">
      {/* Hero Section */}
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
              KoreaMongol нь Солонгос, Монголын хоорондын амьдрал, соёл, мэдээллийг хуваалцах платформ юм.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 md:py-20 px-6 bg-muted/30">
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
                  Монгол, Солонгосын хооронд олон жилийн түүхтэй соёлын холбоо бий. Өнөөдөр олон мянган Монгол иргэд Солонгосд амьдарч, суралцаж, ажиллаж байна.
                </p>
                <p>
                  KoreaMongol нь энэхүү холбоог бэхжүүлж, хоёр улсын иргэдэд хэрэгтэй мэдээлэл, нийгэмлэгийн орон зайг бий болгохоор бүтээгдсэн.
                </p>
                <p className="text-foreground font-medium">
                  Визний мэдээлэл, амьдралын зөвлөгөө, соёлын солилцоо — бүгдийг нэг дор.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Creator Section */}
      <section className="py-16 md:py-20 px-6">
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
                  Солонгос, Монголын хоорондын мэдээлэл хуваалцах сайн платформ байхгүй гэж бодож энэ төслийг эхлүүлсэн.
                </p>
                <p className="text-foreground">
                  Хоёр улсын хоорондын ойлголцлыг гүнзгийрүүлэхэд хувь нэмэр оруулмаар байна.
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

      {/* Values Section */}
      <section className="py-16 md:py-20 px-6 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-headline mb-4">Бидний үнэ цэнэ</h2>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div
                  key={value.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="bg-card border border-border rounded-2xl p-6 text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-6 h-6 text-accent" />
                  </div>
                  <h3 className="font-semibold mb-2">{value.title}</h3>
                  <p className="text-sm text-muted-foreground">{value.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Хамтдаа бүтээе Section */}
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

      {/* CTA Section */}
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
            <Button asChild variant="outline" size="lg">
              <Link href="/contact">Холбоо барих</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </main>
  );
}
