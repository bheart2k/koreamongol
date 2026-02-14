import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Эмнэлэг / Яаралтай | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Эмнэлэг / Яаралтай', 'Эмнэлэгт хандах, яаралтай дуудлага');
}
