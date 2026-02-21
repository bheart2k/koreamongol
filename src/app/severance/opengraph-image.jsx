import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Тэтгэмж тооцоолуур | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Тэтгэмж тооцоолуур', 'Ажлаас гарах үеийн тэтгэмж тооцоолох');
}
