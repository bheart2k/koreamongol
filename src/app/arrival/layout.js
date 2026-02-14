const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Ирсний дараа — Бүртгэл, банк, утас | KoreaMongol',
  description: 'Солонгост ирсний дараа хийх бүх зүйл. Гадаадын иргэний бүртгэл, банк данс нээх, утас гэрээ, амьдрал эхлүүлэх.',
  keywords: ['Солонгос ирсний дараа', '외국인등록', 'банк данс', 'Монгол', 'гарын авлага'],
  openGraph: {
    title: 'Ирсний дараа | KoreaMongol',
    description: 'Солонгост ирсний дараа хийх бүх зүйл',
    url: `${BASE_URL}/arrival`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ирсний дараа | KoreaMongol',
    description: 'Солонгост ирсний дараа хийх бүх зүйл',
  },
  alternates: {
    canonical: `${BASE_URL}/arrival`,
  },
};

export default function ArrivalLayout({ children }) {
  return children;
}
