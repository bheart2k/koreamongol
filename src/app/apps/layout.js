const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Хэрэгтэй апп & хэрэгсэл — KakaoTalk, Coupang, KakaoMap | KoreaMongol',
  description: 'Солонгост амьдрахад заавал хэрэгтэй апп: KakaoTalk, KakaoMap, Coupang, Baemin, Google Translate, тооцоолуурууд.',
  keywords: ['카카오톡', '쿠팡', '카카오맵', '배달의민족', '당근', 'Google Translate', '한국 앱', 'апп'],
  openGraph: {
    title: 'Хэрэгтэй апп & хэрэгсэл | KoreaMongol',
    description: 'Солонгосын амьдралд заавал хэрэгтэй апп, тооцоолуурууд',
    url: `${BASE_URL}/apps`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Хэрэгтэй апп & хэрэгсэл | KoreaMongol',
    description: 'KakaoTalk, Coupang, KakaoMap — Солонгосын чухал апп-ууд',
  },
  alternates: {
    canonical: `${BASE_URL}/apps`,
  },
};

export default function AppsLayout({ children }) {
  return children;
}
