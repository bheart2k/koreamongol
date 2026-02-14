import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Ажил ба хөдөлмөр | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Ажил ба хөдөлмөр', 'Цалин, гэрээ, эрхийн хамгаалалт');
}
