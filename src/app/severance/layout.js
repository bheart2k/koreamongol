const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Тэтгэмж тооцоолуур (퇴직금 계산기)',
  description: 'Ажлын хугацаа, цалингаа оруулж тэтгэмжээ тооцоолоорой. E-9 ажилчдад зориулсан.',
  keywords: ['퇴직금', '계산기', 'тэтгэмж', 'тооцоолуур', 'E-9', 'severance', 'KoreaMongol'],
  openGraph: {
    title: 'Тэтгэмж тооцоолуур | KoreaMongol',
    description: 'Ажлын хугацаа, цалингаа оруулж тэтгэмжээ тооцоолоорой.',
    url: `${BASE_URL}/severance`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Тэтгэмж тооцоолуур | KoreaMongol',
    description: 'Ажлын хугацаа, цалингаа оруулж тэтгэмжээ тооцоолоорой.',
  },
  alternates: {
    canonical: `${BASE_URL}/severance`,
  },
};

export default function SeveranceLayout({ children }) {
  return children;
}
