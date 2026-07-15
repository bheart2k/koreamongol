import FeedbackContent from './FeedbackContent';

const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Санал хүсэлт',
  description:
    'KoreaMongol сайтын талаарх үнэлгээ, санал, алдааны мэдэгдэл — таны санал сайтыг сайжруулахад тусална.',
  openGraph: {
    title: 'Санал хүсэлт | KoreaMongol',
    description: 'Сайтын талаарх үнэлгээ, санал, алдааны мэдэгдэл',
    url: `${BASE_URL}/feedback`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary',
    title: 'Санал хүсэлт | KoreaMongol',
    description: 'Сайтын талаарх үнэлгээ, санал, алдааны мэдэгдэл',
  },
  alternates: {
    canonical: `${BASE_URL}/feedback`,
  },
};

export default function FeedbackPage() {
  return <FeedbackContent />;
}
