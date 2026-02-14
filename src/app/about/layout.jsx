const BASE_URL = 'https://koreamongol.com';

export function generateMetadata() {
  return {
    title: 'Тухай',
    description: 'Солонгост амьдарч буй монгол иргэдэд зориулсан монгол хэлээрх амьдралын гарын авлага. Виз, ажил, орон сууц, эмнэлэг, мөнгө шилжүүлэг, TOPIK зэрэг бүх мэдээлэл.',
    keywords: ['KoreaMongol', 'Солонгос Монгол', 'Korea Mongolia', 'монгол иргэд', 'амьдралын гарын авлага'],
    openGraph: {
      title: 'Тухай | KoreaMongol',
      description: 'Солонгост амьдарч буй монгол иргэдэд зориулсан монгол хэлээрх амьдралын гарын авлага.',
      url: `${BASE_URL}/about`,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Тухай | KoreaMongol',
      description: 'Солонгост амьдарч буй монгол иргэдэд зориулсан монгол хэлээрх амьдралын гарын авлага.',
    },
    alternates: {
      canonical: `${BASE_URL}/about`,
    },
  };
}

export default function AboutLayout({ children }) {
  return children;
}
