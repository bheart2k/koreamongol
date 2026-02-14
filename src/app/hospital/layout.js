const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Эмнэлэг / Яаралтай тусламж | KoreaMongol',
  description: 'Солонгост эмнэлэгт хандах, яаралтай дуудлага, даатгал, орчуулга үйлчилгээний бүрэн мэдээлэл.',
  keywords: ['Солонгос эмнэлэг', 'яаралтай тусламж', '119', 'даатгал', 'Монгол', 'гарын авлага'],
  openGraph: {
    title: 'Эмнэлэг / Яаралтай тусламж | KoreaMongol',
    description: 'Эмнэлэгт хандах, яаралтай дуудлага, даатгал',
    url: `${BASE_URL}/hospital`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Эмнэлэг / Яаралтай тусламж | KoreaMongol',
    description: 'Эмнэлэгт хандах, яаралтай дуудлага, даатгал',
  },
  alternates: {
    canonical: `${BASE_URL}/hospital`,
  },
};

export default function HospitalLayout({ children }) {
  return children;
}
