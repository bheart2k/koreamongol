import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';
import { tips } from '@/data/tips';

export const alt = 'Түргэн хариулт | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return tips.map((tip) => ({ slug: tip.slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  const tip = tips.find((t) => t.slug === slug);
  return generateOGImage(tip?.question ?? 'Түргэн хариулт', tip?.categoryLabel);
}
