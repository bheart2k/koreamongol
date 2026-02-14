import { FileText, MapPin, Heart, Banknote, BookOpen } from 'lucide-react';

export const GUIDE_ORDER = [
  { id: 'visa', href: '/visa', title: 'Визний гарын авлага', icon: FileText },
  { id: 'arrival', href: '/arrival', title: 'Ирсний дараа', icon: MapPin },
  { id: 'hospital', href: '/hospital', title: 'Эмнэлэг / Яаралтай', icon: Heart },
  { id: 'money', href: '/money', title: 'Мөнгө ба санхүү', icon: Banknote },
  { id: 'korean-life', href: '/korean-life', title: 'Бодит Солонгос хэл', icon: BookOpen },
];

export const defaultEmergencyItems = [
  { label: 'Яаралтай тусламж', number: '119', emoji: '🚑' },
  { label: 'Цагдаа', number: '112', emoji: '🚔' },
  { label: 'Гадаадын иргэн', number: '1345', emoji: '📞' },
];
