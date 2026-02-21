import { Calculator } from 'lucide-react';
import { GuideHero, ReportBanner, DonateBanner, ShareButtons } from '@/components/guide';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import SeveranceCalculator from './SeveranceCalculator';

const BASE_URL = 'https://koreamongol.com';

export default function SeverancePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Тэтгэмж тооцоолуур', url: `${BASE_URL}/severance` },
      ]} />
    <main className="min-h-content bg-background">
      <GuideHero
        title="Тэтгэмж тооцоолуур"
        subtitle="Ажлаас гарах үеийн тэтгэмж тооцоолох"
        icon={Calculator}
        breadcrumbLabel="Тэтгэмж"
      />

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <SeveranceCalculator />

        {/* Info section */}
        <div className="max-w-lg mx-auto space-y-4">
          <div className="p-4 rounded-lg border border-gold/30 bg-gold/5 text-xs text-muted-foreground space-y-2">
            <p className="font-medium text-foreground text-sm">Тэтгэмжийн талаар мэдэх зүйлс</p>
            <ul className="space-y-1.5 list-disc list-inside">
              <li>1 жилээс дээш ажилласан бол тэтгэмж авах эрхтэй</li>
              <li>Долоо хоногт 15 цагаас дээш ажилласан байх шаардлагатай</li>
              <li>Ажлаас гарснаас хойш 14 хоногийн дотор олгох ёстой</li>
              <li>Тэтгэмж өгөхгүй бол 1345 руу залгаж зөвлөгөө аваарай</li>
            </ul>
          </div>

          <div className="p-4 rounded-lg border border-terracotta/30 bg-terracotta/5 text-xs text-muted-foreground">
            Энэ тооцоолуур нь зөвхөн лавлагааны зорилготой. Бодит дүн нь нийгмийн даатгал, татвар зэрэг нэмэлт хүчин зүйлээс шалтгаалан өөрчлөгдөж болно.
          </div>
        </div>

        <ReportBanner pageUrl="/severance" />
        <DonateBanner />
        <ShareButtons />
      </div>
    </main>
    </>
  );
}
