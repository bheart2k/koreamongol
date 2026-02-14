import { Users, Info, Mail, FileText, Shield, PenLine, MapPin, Heart, Banknote, BookOpen, MessageCircleQuestion } from 'lucide-react';

/**
 * KoreaMongol 네비게이션 메뉴 아이템
 */
export const navItems = [
  {
    type: 'dropdown',
    label: 'Гарын авлага',
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
        href: '/korean-life',
        label: 'Бодит Солонгос хэл',
        desc: 'Сурах бичигт байдаггүй чухал зүйлс',
        icon: BookOpen,
      },
      {
        href: '/community/expression',
        label: 'Хэллэгийн асуулт',
        desc: 'Солонгос хэллэгийн талаар асуулт, хариулт',
        icon: MessageCircleQuestion,
      },
    ],
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
