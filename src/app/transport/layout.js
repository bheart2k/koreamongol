const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Тээврийн гарын авлага — Метро, автобус, такси, KTX | KoreaMongol',
  description: 'T-money карт, метро (₩1,550), автобус, такси, KTX — Солонгосын нийтийн тээврийн бүрэн гарын авлага. Аппууд, үнэ, зөвлөгөө.',
  keywords: ['тээвэр', 'метро', 'автобус', 'такси', 'KTX', 'T-money', '지하철', '교통'],
  openGraph: {
    title: 'Тээврийн гарын авлага | KoreaMongol',
    description: 'Метро, автобус, такси, KTX — бүрэн гарын авлага',
    url: `${BASE_URL}/transport`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Тээврийн гарын авлага | KoreaMongol',
    description: 'Солонгосын нийтийн тээврийн бүрэн гарын авлага',
  },
  alternates: {
    canonical: `${BASE_URL}/transport`,
  },
};

export default function TransportLayout({ children }) {
  return children;
}
