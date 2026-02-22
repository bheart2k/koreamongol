import AboutContent from './AboutContent';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const BASE_URL = 'https://koreamongol.com';

export default function AboutPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[
        { name: 'KoreaMongol', url: BASE_URL },
        { name: 'Тухай', url: `${BASE_URL}/about` },
      ]} />
      <AboutContent />
    </>
  );
}
