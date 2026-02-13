import { Users, Info, Mail, FileText, Shield, MessageSquarePlus, PenLine } from 'lucide-react';

/**
 * KoreaMongol 네비게이션 메뉴 아이템
 */
// TODO: 커뮤니티 기능 구현 후 활성화
// export const navItems = [
//   {
//     type: 'dropdown',
//     label: 'Нийгэмлэг',
//     align: 'left',
//     children: [
//       {
//         href: '/community/blog',
//         label: 'Блог',
//         desc: 'Хамт олны нийтлэл, мэдээлэл',
//         icon: PenLine,
//       },
//     ],
//   },
// ];
export const navItems = [];

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
    href: '/feedback',
    label: 'Санал хүсэлт',
    icon: MessageSquarePlus,
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
