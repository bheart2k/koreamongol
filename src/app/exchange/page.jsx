import { Calculator } from 'lucide-react';
import { GuideHero, ReportBanner, DonateBanner, ShareButtons } from '@/components/guide';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import ExchangeCalculator from './ExchangeCalculator';

const BASE_URL = 'https://koreamongol.com';

export default function ExchangePage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Ханш тооцоолуур', url: `${BASE_URL}/exchange` },
      ]} />
    <main className="min-h-content bg-background">
      <GuideHero
        title="Ханш тооцоолуур"
        subtitle="KRW ↔ MNT хөрвүүлэг"
        icon={Calculator}
        breadcrumbLabel="Ханш"
      />

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-10">
        <ExchangeCalculator />

        <div className="max-w-md mx-auto">
          <div className="p-4 rounded-lg border border-gold/30 bg-gold/5">
            <p className="text-xs text-muted-foreground text-center">
              Энэ ханш нь зөвхөн лавлагааны зорилготой. Бодит гүйлгээний ханш банк, мөнгө шилжүүлгийн үйлчилгээгээр өөрчлөгдөж болно.
            </p>
          </div>
        </div>

        <ReportBanner pageUrl="/exchange" />
        <DonateBanner />
        <ShareButtons />
      </div>
    </main>
    </>
  );
}
