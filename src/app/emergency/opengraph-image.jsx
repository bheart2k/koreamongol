import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Яаралтай утасны дугаарууд | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Яаралтай утасны дугаарууд', '119, 112, 1345 — бүх дугаар нэг хуудсанд');
}
