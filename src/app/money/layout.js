const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Мөнгө ба санхүү — Шилжүүлэг, банк, даатгал | KoreaMongol',
  description: 'Монгол руу мөнгө шилжүүлэх арга, банкны данс, карт, 4 даатгал, тэтгэвэр буцаан авах. GME, Hanpass, Toss, Western Union.',
  keywords: ['мөнгө шилжүүлэг', 'банк данс', '4대보험', '국민연금', 'GME', 'Hanpass', 'ханш'],
  openGraph: {
    title: 'Мөнгө ба санхүү | KoreaMongol',
    description: 'Шилжүүлэг, банк, карт, даатгал — бүрэн гарын авлага',
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
