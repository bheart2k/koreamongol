import {
  LayoutDashboard,
  Users,
  Image,
  Settings,
  Inbox,
  BarChart3,
} from 'lucide-react';

export const ADMIN_MENU = {
  main: [
    {
      title: '대시보드',
      url: '/admin',
      icon: LayoutDashboard,
    },
    {
      title: '애널리틱스',
      url: '/admin/analytics',
      icon: BarChart3,
    },
    {
      title: '고객 관리',
      url: '/admin/customers',
      icon: Users,
    },
    {
      title: '받은편지함',
      url: '/admin/inbox',
      icon: Inbox,
    },
    {
      title: '이미지 관리',
      icon: Image,
      items: [
        { title: '캐릭터', url: '/admin/images/characters' },
        { title: '일반', url: '/admin/images/general' },
      ],
    },
  ],
  settings: [
    {
      title: '설정',
      url: '/admin/settings',
      icon: Settings,
      // grade 1만 접근 가능
      requiredGrade: 1,
    },
  ],
};

// 권한에 따른 메뉴 필터링
export function filterMenuByGrade(menu, userGrade) {
  return menu.filter((item) => {
    if (!item.requiredGrade) return true;
    return userGrade <= item.requiredGrade;
  });
}
