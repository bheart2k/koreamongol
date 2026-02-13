import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';

const BASE_URL = 'https://koreamongol.com';

const boardConfig = {
  blog: {
    title: 'Блог',
    desc: 'Солонгос-Монголын соёл, аялал, амьдралын тухай нийтлэл хуваалцах орон зай.',
  },
  free: {
    title: 'Чөлөөт самбар',
    desc: 'Чөлөөтэй ярилцах, асуулт хариулт солилцох орон зай.',
  },
  notice: {
    title: 'Мэдэгдэл & FAQ',
    desc: 'KoreaMongol-ын мэдэгдэл болон түгээмэл асуултууд.',
  },
};

export async function generateMetadata({ params }) {
  const { boardType } = await params;
  const board = boardConfig[boardType];

  if (!board) {
    return { title: 'Самбар олдсонгүй' };
  }

  return {
    title: board.title,
    description: board.desc,
    openGraph: {
      title: `${board.title} | KoreaMongol`,
      description: board.desc,
      url: `${BASE_URL}/community/${boardType}`,
    },
    twitter: {
      card: 'summary',
      title: `${board.title} | KoreaMongol`,
      description: board.desc,
    },
    alternates: {
      canonical: `${BASE_URL}/community/${boardType}`,
    },
  };
}

export default async function BoardLayout({ children, params }) {
  const { boardType } = await params;
  const board = boardConfig[boardType];

  const breadcrumbItems = [
    { name: 'KoreaMongol', url: BASE_URL },
    { name: 'Нийгэмлэг', url: `${BASE_URL}/community` },
    board && { name: board.title, url: `${BASE_URL}/community/${boardType}` },
  ].filter(Boolean);

  return (
    <>
      <BreadcrumbJsonLd items={breadcrumbItems} />
      {children}
    </>
  );
}
