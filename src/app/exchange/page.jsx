import { SupportHeader } from '@/components/guide/SupportHeader';
import styles from '@/components/guide/SupportPages.module.css';
import pageStyles from '@/components/guide/IllustratedGuide.module.css';
import { Calculator } from 'lucide-react';
import { ReportBanner, DonateBanner, ShareButtons } from '@/components/guide';
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
    <main className={pageStyles.page}>
      <SupportHeader
        title="Ханш тооцоолуур"
        subtitle="KRW ↔ MNT хөрвүүлэг"
        icon={Calculator}
      image="/images/guides/exchange-mazaalai-l.png" />

      <div className={[styles.content, "space-y-10"].join(" ")}>
        <ExchangeCalculator />

        <div className={[styles.note, ""].join(" ")}>
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
