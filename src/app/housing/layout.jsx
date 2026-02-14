const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Байр ба орон сууц',
  description: 'Солонгост байр хайх, гэрээ хийх, барьцаа/түрээс, амьдралын зөвлөгөө — Монгол иргэдэд зориулсан гарын авлага.',
  keywords: ['Солонгос байр', '원룸', '고시원', 'барьцаа', '전세', '월세', '전입신고', 'Монгол'],
  openGraph: {
    title: 'Байр ба орон сууц | KoreaMongol',
    description: 'Солонгост байр хайх, гэрээ хийх, барьцаа/түрээс.',
    url: `${BASE_URL}/housing`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Байр ба орон сууц | KoreaMongol',
    description: 'Солонгост байр хайх, гэрээ хийх, барьцаа/түрээс.',
  },
  alternates: {
    canonical: `${BASE_URL}/housing`,
  },
};

export default function HousingLayout({ children }) {
  return children;
}
