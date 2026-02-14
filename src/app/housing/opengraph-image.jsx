import { generateOGImage, ogSize, ogContentType } from '@/lib/og-image';

export const alt = 'Байр ба орон сууц | KoreaMongol';
export const size = ogSize;
export const contentType = ogContentType;

export default async function Image() {
  return generateOGImage('Байр ба орон сууц', 'Барьцаа, түрээс, гэрээ, амьдрал');
}
