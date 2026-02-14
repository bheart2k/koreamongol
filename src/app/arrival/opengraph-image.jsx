import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Ирсний дараа | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Ирсний дараа', 'Бүртгэл, банк, утас нээлгэх');
}
