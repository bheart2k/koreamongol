const BASE_URL = 'https://koreamongol.com';

export const metadata = {
  title: 'Ажил ба хөдөлмөр',
  description: 'Солонгост ажиллах визний нөхцөл, хамгийн бага цалин, хөдөлмөрийн гэрээ, эрхийн хамгаалалт — E-9, D-2, D-4 визтэй Монгол иргэдэд зориулсан гарын авлага.',
  keywords: ['E-9 ажил', 'Солонгос ажил', 'хамгийн бага цалин 2026', 'хөдөлмөрийн гэрээ', '임금체불', '산업재해', 'Монгол ажилчид'],
  openGraph: {
    title: 'Ажил ба хөдөлмөр | KoreaMongol',
    description: 'Солонгост ажиллах визний нөхцөл, цалин, хөдөлмөрийн эрх.',
    url: `${BASE_URL}/jobs`,
    images: ['/opengraph-image'],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Ажил ба хөдөлмөр | KoreaMongol',
    description: 'Солонгост ажиллах визний нөхцөл, цалин, хөдөлмөрийн эрх.',
  },
  alternates: {
    canonical: `${BASE_URL}/jobs`,
  },
};

export default function JobsLayout({ children }) {
  return children;
}
