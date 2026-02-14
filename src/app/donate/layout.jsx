const BASE_URL = 'https://koreamongol.com';

export function generateMetadata() {
  return {
    title: 'Дэмжлэг',
    description: 'KoreaMongol сайтыг дэмжих. Таны дэмжлэг энэ сайтыг хөгжүүлэхэд тусална.',
    keywords: ['KoreaMongol', 'дэмжлэг', 'donate', 'support'],
    openGraph: {
      title: 'Дэмжлэг | KoreaMongol',
      description: 'KoreaMongol сайтыг дэмжих.',
      url: `${BASE_URL}/donate`,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Дэмжлэг | KoreaMongol',
      description: 'KoreaMongol сайтыг дэмжих.',
    },
    alternates: {
      canonical: `${BASE_URL}/donate`,
    },
  };
}

export default function DonateLayout({ children }) {
  return children;
}
