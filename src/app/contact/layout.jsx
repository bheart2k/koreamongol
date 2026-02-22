const BASE_URL = 'https://koreamongol.com';

export function generateMetadata() {
  return {
    title: 'Холбоо барих',
    description: 'KoreaMongol-д хандана уу. Асуулт, санал, сэтгэгдлээ илгээнэ үү.',
    openGraph: {
      title: 'Холбоо барих | KoreaMongol',
      description: 'KoreaMongol-д хандана уу.',
      url: `${BASE_URL}/contact`,
      images: ['/opengraph-image'],
    },
    twitter: {
      card: 'summary',
      title: 'Холбоо барих | KoreaMongol',
      description: 'KoreaMongol-д хандана уу.',
    },
    alternates: {
      canonical: `${BASE_URL}/contact`,
    },
  };
}

export default function ContactLayout({ children }) {
  return children;
}
