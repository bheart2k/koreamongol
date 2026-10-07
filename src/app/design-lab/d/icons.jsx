// home-data guides[].iconName → lucide 컴포넌트 (클라이언트 컴포넌트용)
import {
  FileText, MapPin, Heart, Banknote, BookOpen, Users, Briefcase, Home, GraduationCap,
  Calculator, Train, Phone, Smartphone, Zap,
} from 'lucide-react';

const ICONS = {
  FileText, MapPin, Heart, Banknote, BookOpen, Users, Briefcase, Home, GraduationCap,
  Calculator, Train, Phone, Smartphone, Zap,
};

export function GuideIcon({ name, ...props }) {
  const Icon = ICONS[name] || MapPin;
  return <Icon aria-hidden="true" {...props} />;
}
