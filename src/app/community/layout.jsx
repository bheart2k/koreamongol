import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const BASE_URL = 'https://koreamongol.com';

export async function generateMetadata() {
  return {
    title: 'Нийгэмлэг',
    description: 'Солонгос-Монголын нийгэмлэг. Мэдээлэл хуваалцах, хамтдаа суралцах, шинэ найзуудтай болох орон зай.',
    keywords: ['Солонгос Монгол', 'нийгэмлэг', 'Korea Mongolia community', 'Korean culture'],
    openGraph: {
      title: 'Нийгэмлэг | KoreaMongol',
      description: 'Солонгос-Монголын нийгэмлэг.',
      url: `${BASE_URL}/community`,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Нийгэмлэг | KoreaMongol',
      description: 'Солонгос-Монголын нийгэмлэг.',
    },
    alternates: {
      canonical: `${BASE_URL}/community`,
    },
  };
}

export default async function CommunityLayout({ children }) {
  const breadcrumbItems = [
    { name: 'KoreaMongol', url: BASE_URL },
    { name: 'Нийгэмлэг', url: `${BASE_URL}/community` },
  ];

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {children}
    </>
  );
}
