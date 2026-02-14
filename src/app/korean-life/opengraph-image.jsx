import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Бодит Солонгос хэл | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Бодит Солонгос хэл', 'Сурах бичигт байдаггүй чухал зүйлс');
}
