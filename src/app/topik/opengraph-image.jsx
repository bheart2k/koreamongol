import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'TOPIK / EPS-TOPIK шалгалт | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('TOPIK / EPS-TOPIK', 'Шалгалтын бүтэц, бүртгэл, бэлтгэл');
}
