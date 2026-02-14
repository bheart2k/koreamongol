const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Ханш тооцоолуур (KRW ↔ MNT)',
  description: 'Солонгос вон ба Монгол төгрөгийн ханш хөрвүүлэх тооцоолуур. Өдөр бүр шинэчлэгдэнэ.',
  keywords: ['환율', 'KRW', 'MNT', '원화', '투그릭', 'ханш', 'тооцоолуур', 'Монгол'],
  openGraph: {
    title: 'Ханш тооцоолуур (KRW ↔ MNT) | KoreaMongol',
    description: 'Солонгос вон ба Монгол төгрөгийн ханш хөрвүүлэх тооцоолуур.',
    url: `${BASE_URL}/exchange`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ханш тооцоолуур (KRW ↔ MNT) | KoreaMongol',
    description: 'Солонгос вон ба Монгол төгрөгийн ханш хөрвүүлэх тооцоолуур.',
  },
  alternates: {
    canonical: `${BASE_URL}/exchange`,
  },
};

export default function ExchangeLayout({ children }) {
  return children;
}
