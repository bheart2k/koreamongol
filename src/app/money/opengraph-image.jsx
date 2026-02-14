import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Мөнгө ба санхүү | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Мөнгө ба санхүү', 'Шилжүүлэг, банк, карт, даатгал');
}
