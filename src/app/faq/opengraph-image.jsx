import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Түгээмэл асуултууд | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Түгээмэл асуултууд', 'Виз, ажил, амьдрал — түгээмэл асуулт, хариулт');
}
