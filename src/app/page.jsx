import { WebSiteJsonLd } from '@/components/seo/JsonLd';
import HomeContent from './HomeContent';

export const metadata = {
  alternates: {
    canonical: 'https://koreamongol.com',
  },
  openGraph: {
    images: ['/opengraph-image'],
  },
};

export default function HomePage() {
  return (
    <>
      <WebSiteJsonLd />
      <HomeContent />
    </>
  );
}
