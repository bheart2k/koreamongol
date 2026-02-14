const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Яаралтай утасны дугаарууд | KoreaMongol',
  description: 'Солонгост амьдрахад хэрэг болох бүх утасны дугаар: 119 яаралтай, 112 цагдаа, 1345 гадаадын иргэн, 1577-1366 дануры, 1588-5644 BBB орчуулга, элчин сайдын яам.',
  keywords: ['яаралтай утас', 'emergency Korea', '1345', '긴급 연락처', 'монгол элчин сайдын яам', 'BBB Korea'],
  openGraph: {
    title: 'Яаралтай утасны дугаарууд | KoreaMongol',
    description: 'Солонгост амьдрахад хэрэг болох бүх утасны дугаар — нэг хуудсанд',
    url: `${BASE_URL}/emergency`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Яаралтай утасны дугаарууд | KoreaMongol',
    description: 'Солонгост амьдрахад хэрэг болох бүх утасны дугаар — нэг хуудсанд',
  },
  alternates: {
    canonical: `${BASE_URL}/emergency`,
  },
};

export default function EmergencyLayout({ children }) {
  return children;
}
