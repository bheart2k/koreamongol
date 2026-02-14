const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Визний гарын авлага — E-9, D-2, D-4 | KoreaMongol',
  description: 'Солонгост ажиллах, суралцах визний бүрэн мэдээлэл. E-9 ажлын виз, D-2 их сургуулийн виз, D-4 хэл сургалтын виз.',
  keywords: ['Солонгос виз', 'E-9 виз', 'D-2 виз', 'D-4 виз', 'Монгол', 'гарын авлага'],
  openGraph: {
    title: 'Визний гарын авлага | KoreaMongol',
    description: 'E-9, D-2, D-4 визний бүрэн мэдээлэл',
    url: `${BASE_URL}/visa`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Визний гарын авлага | KoreaMongol',
    description: 'E-9, D-2, D-4 визний бүрэн мэдээлэл',
  },
  alternates: {
    canonical: `${BASE_URL}/visa`,
  },
};

export default function VisaLayout({ children }) {
  return children;
}
