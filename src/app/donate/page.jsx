import Image from 'next/image';
import Link from 'next/link';
import { Heart, Coffee, ExternalLink } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const BASE_URL = 'https://koreamongol.com';
const BMC_URL = 'https://buymeacoffee.com/koreamongol';

export default function DonatePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Дэмжлэг', url: `${BASE_URL}/donate` },
      ]} />
    <main className="min-h-content bg-background">
      {/* Hero */}
      <section className="py-16 md:py-24 px-6 text-center">
        <div className="max-w-2xl mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-gold" />
          </div>
          <h1 className="text-display mb-4">Дэмжлэг</h1>
          <p className="text-body-lg text-muted-foreground">
            Таны жижиг дэмжлэг сайтын тогтвортой үйл ажиллагаа болон хөгжүүлэлтэд тусална.
          </p>
        </div>
      </section>

      {/* What your support does */}
      <section className="py-12 px-6 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-headline mb-6 text-center">Таны дэмжлэг юунд зарцуулагдах вэ?</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🌐', title: 'Сервер, домэйн', desc: 'Сайтыг ажиллуулах зардал' },
              { icon: '📝', title: 'Мэдээлэл шинэчлэх', desc: 'Виз, хууль журмын өөрчлөлт' },
              { icon: '🚀', title: 'Шинэ боломж', desc: 'Шинэ гарын авлага, функц нэмэх' },
            ].map((item) => (
              <div key={item.title} className="p-5 rounded-xl border border-border bg-card text-center">
                <span className="text-2xl">{item.icon}</span>
                <h3 className="text-sm font-semibold font-heading mt-2 mb-1">{item.title}</h3>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Buy Me a Coffee */}
      <section className="py-16 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-card border-2 border-gold/30 rounded-2xl p-8 md:p-10 text-center">
            <Coffee className="w-10 h-10 text-gold mx-auto mb-4" />
            <h2 className="text-title mb-2">Buy Me a Coffee</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Нэг аяга кофены үнээр дэмжлэг үзүүлэх
            </p>

            <a
              href={BMC_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-[#FFDD00] text-[#000000] font-semibold hover:bg-[#FFDD00]/90 transition-colors text-sm"
            >
              <Coffee className="w-4 h-4" />
              Buy me a coffee
              <ExternalLink className="w-3.5 h-3.5" />
            </a>

            {/* QR Code */}
            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground mb-4">QR код уншуулж дэмжих</p>
              <div className="w-40 h-40 mx-auto rounded-xl overflow-hidden border border-border">
                <Image
                  src="/images/bmc-qr.png"
                  alt="Buy Me a Coffee QR code"
                  width={160}
                  height={160}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Thank you */}
      <section className="py-12 px-6">
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-body text-muted-foreground">
            Дэмжлэг өгөх боломжгүй ч гэсэн сайтыг ашиглаж, найзууддаа хуваалцах нь бидэнд маш их тусална.
          </p>
          <p className="text-sm text-muted-foreground mt-4">
            Баярлалаа! 🇲🇳🇰🇷
          </p>
        </div>
      </section>
    </main>
    </>
  );
}
