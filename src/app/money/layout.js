const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Мөнгө шилжүүлэг — Ханш, арга | KoreaMongol',
  description: 'Монгол руу мөнгө шилжүүлэх арга, хураамж харьцуулалт, ханшийн зөвлөгөө. GME, Western Union, банк шилжүүлэг.',
  keywords: ['мөнгө шилжүүлэг', 'Монгол руу송금', 'GME', 'Western Union', 'ханш'],
  openGraph: {
    title: 'Мөнгө шилжүүлэг | KoreaMongol',
    description: 'Монгол руу мөнгө шилжүүлэх бүрэн гарын авлага',
    url: `${BASE_URL}/money`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Мөнгө шилжүүлэг | KoreaMongol',
    description: 'Монгол руу мөнгө шилжүүлэх бүрэн гарын авлага',
  },
  alternates: {
    canonical: `${BASE_URL}/money`,
  },
};

export default function MoneyLayout({ children }) {
  return children;
}
