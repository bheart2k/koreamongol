import { WebSiteJsonLd } from '@/components/seo/JsonLd';
import { getRecentUpdates } from '@/lib/recent-updates';
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
      <HomeContent recentUpdates={getRecentUpdates(5)} />
    </>
  );
}
