const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'TOPIK / EPS-TOPIK шалгалт',
  description: 'TOPIK, EPS-TOPIK шалгалтын бүтэц, бүртгэл, тэнцэх оноо, бэлтгэл материал — Монгол иргэдэд зориулсан гарын авлага.',
  keywords: ['TOPIK', 'EPS-TOPIK', '한국어능력시험', '고용허가제', 'Солонгос хэл', 'шалгалт', 'Монгол'],
  openGraph: {
    title: 'TOPIK / EPS-TOPIK шалгалт | KoreaMongol',
    description: 'TOPIK, EPS-TOPIK шалгалтын бүтэц, бүртгэл, тэнцэх оноо, бэлтгэл.',
    url: `${BASE_URL}/topik`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TOPIK / EPS-TOPIK шалгалт | KoreaMongol',
    description: 'TOPIK, EPS-TOPIK шалгалтын бүтэц, бүртгэл, тэнцэх оноо, бэлтгэл.',
  },
  alternates: {
    canonical: `${BASE_URL}/topik`,
  },
};

export default function TopikLayout({ children }) {
  return children;
}
