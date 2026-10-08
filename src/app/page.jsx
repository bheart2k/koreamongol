import { WebSiteJsonLd } from '@/components/seo/JsonLd';
import { getRecentUpdates } from '@/lib/recent-updates';
import HomeView from '@/components/home/HomeView';

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
      <HomeView recentUpdates={getRecentUpdates(5)} />
    </>
  );
}
