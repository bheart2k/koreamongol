const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Бодит Солонгос хэл & Соёл | KoreaMongol',
  description: 'Сурах бичигт байдаггүй бодит Солонгос хэл, соёлын ялгаа, түгээмэл алдаа. Монгол хүмүүст зориулсан.',
  keywords: ['Солонгос хэл', 'соёл', 'бодит хэллэг', 'Монгол', 'гарын авлага'],
  openGraph: {
    title: 'Бодит Солонгос хэл & Соёл | KoreaMongol',
    description: 'Сурах бичигт байдаггүй чухал зүйлс',
    url: `${BASE_URL}/korean-life`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Бодит Солонгос хэл & Соёл | KoreaMongol',
    description: 'Сурах бичигт байдаггүй чухал зүйлс',
  },
  alternates: {
    canonical: `${BASE_URL}/korean-life`,
  },
};

export default function KoreanLifeLayout({ children }) {
  return children;
}
