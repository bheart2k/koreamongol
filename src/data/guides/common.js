import { FileText, MapPin, Heart, Banknote, BookOpen, Briefcase, Home, GraduationCap, Train, Phone, Smartphone } from 'lucide-react';

export const GUIDE_ORDER = [
  { id: 'visa', href: '/visa', title: 'Визний гарын авлага', icon: FileText },
  { id: 'arrival', href: '/arrival', title: 'Ирсний дараа', icon: MapPin },
  { id: 'hospital', href: '/hospital', title: 'Эмнэлэг / Яаралтай', icon: Heart },
  { id: 'money', href: '/money', title: 'Мөнгө ба санхүү', icon: Banknote },
  { id: 'korean-life', href: '/korean-life', title: 'Бодит Солонгос хэл', icon: BookOpen },
  { id: 'jobs', href: '/jobs', title: 'Ажил ба хөдөлмөр', icon: Briefcase },
  { id: 'housing', href: '/housing', title: 'Байр ба орон сууц', icon: Home },
  { id: 'topik', href: '/topik', title: 'TOPIK / EPS-TOPIK', icon: GraduationCap },
  { id: 'transport', href: '/transport', title: 'Тээврийн гарын авлага', icon: Train },
  { id: 'emergency', href: '/emergency', title: 'Яаралтай утасны дугаарууд', icon: Phone },
  { id: 'apps', href: '/apps', title: 'Хэрэгтэй апп & хэрэгсэл', icon: Smartphone },
];

export const defaultEmergencyItems = [
  { label: 'Яаралтай тусламж', number: '119', emoji: '🚑' },
  { label: 'Цагдаа', number: '112', emoji: '🚔' },
  { label: 'Гадаадын иргэн', number: '1345', emoji: '📞' },
];
