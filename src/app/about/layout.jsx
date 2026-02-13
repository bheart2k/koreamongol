const BASE_URL = 'https://koreamongol.com';

export function generateMetadata() {
  return {
    title: 'Тухай',
    description: 'KoreaMongol нь Монголд амьдарч буй Солонгос иргэд болон Солонгост амьдарч буй Монгол иргэдэд зориулсан мэдээлэл, нийгэмлэгийн платформ юм.',
    keywords: ['KoreaMongol', 'Солонгос Монгол', 'Korea Mongolia', 'платформ тухай'],
    openGraph: {
      title: 'Тухай | KoreaMongol',
      description: 'KoreaMongol платформын тухай мэдээлэл.',
      url: `${BASE_URL}/about`,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Тухай | KoreaMongol',
      description: 'KoreaMongol платформын тухай мэдээлэл.',
    },
    alternates: {
      canonical: `${BASE_URL}/about`,
    },
  };
}

export default function AboutLayout({ children }) {
  return children;
}
