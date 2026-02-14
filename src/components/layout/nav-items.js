import { Users, Info, Mail, FileText, Shield, PenLine, MapPin, Heart, Banknote, BookOpen, MessageCircleQuestion, Briefcase, Home, GraduationCap, Calculator, Train, Phone } from 'lucide-react';

/**
 * KoreaMongol 네비게이션 메뉴 아이템
 * - 드롭다운 2개 + 직접 링크 2개로 분산 배치
 */
export const navItems = [
  {
    type: 'dropdown',
    label: 'Виз & Бүртгэл',
    align: 'left',
    children: [
      {
        href: '/visa',
        label: 'Визний гарын авлага',
        desc: 'E-9, D-2, D-4 визний мэдээлэл',
        icon: FileText,
      },
      {
        href: '/arrival',
        label: 'Ирсний дараа',
        desc: 'Бүртгэл, банк, утас нээлгэх',
        icon: MapPin,
      },
      {
        href: '/topik',
        label: 'TOPIK / EPS-TOPIK',
        desc: 'Шалгалтын бүтэц, бүртгэл, бэлтгэл',
        icon: GraduationCap,
      },
    ],
  },
  {
    type: 'dropdown',
    label: 'Амьдрал',
    align: 'left',
    children: [
      {
        href: '/hospital',
        label: 'Эмнэлэг / Яаралтай',
        desc: 'Эмнэлэгт хандах, яаралтай дуудлага',
        icon: Heart,
      },
      {
        href: '/money',
        label: 'Мөнгө ба санхүү',
        desc: 'Шилжүүлэг, банк, карт, даатгал',
        icon: Banknote,
      },
      {
        href: '/exchange',
        label: 'Ханш тооцоолуур',
        desc: 'KRW ↔ MNT ханш хөрвүүлэг',
        icon: Calculator,
      },
      {
        href: '/jobs',
        label: 'Ажил ба хөдөлмөр',
        desc: 'Цалин, гэрээ, эрхийн хамгаалалт',
        icon: Briefcase,
      },
      {
        href: '/housing',
        label: 'Байр ба орон сууц',
        desc: 'Барьцаа, түрээс, гэрээ, амьдрал',
        icon: Home,
      },
      {
        href: '/transport',
        label: 'Тээвэр',
        desc: 'Метро, автобус, такси, KTX',
        icon: Train,
      },
    ],
  },
  {
    type: 'link',
    href: '/korean-life',
    label: 'Солонгос хэл',
    icon: BookOpen,
  },
  {
    type: 'link',
    href: '/community/expression',
    label: 'Хэллэг',
    icon: MessageCircleQuestion,
  },
  {
    type: 'link',
    href: '/emergency',
    label: 'Яаралтай утас',
    icon: Phone,
  },
];

/**
 * 햄버거 메뉴 부가 아이템
 */
export const secondaryNavItems = [
  {
    href: '/about',
    label: 'Танилцуулга',
    icon: Info,
  },
  {
    href: '/contact',
    label: 'Холбоо барих',
    icon: Mail,
  },
  {
    href: '/privacy',
    label: 'Нууцлалын бодлого',
    icon: Shield,
  },
  {
    href: '/terms',
    label: 'Үйлчилгээний нөхцөл',
    icon: FileText,
  },
];

// 헬퍼 함수 (단일 언어이므로 간단)
export const getLabel = (item) => item.label;
export const getDesc = (item) => item.desc || '';
