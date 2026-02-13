'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  ChevronRight,
  ChevronsUpDown,
  LogOut,
  Home,
} from 'lucide-react';

import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarRail,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
} from '@/components/animate-ui/components/radix/sidebar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/animate-ui/primitives/radix/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/animate-ui/components/radix/dropdown-menu';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { ADMIN_MENU, filterMenuByGrade } from '@/lib/admin-menu';
import { signOut } from 'next-auth/react';
import { useAdminNotifications } from '@/store/admin-notifications';

// 등급 → 라벨 변환
function getGradeLabel(grade) {
  if (grade <= 10) return '개발자';
  if (grade <= 20) return '관리자';
  return '일반';
}

// 경로 → 브레드크럼 변환
function getBreadcrumbs(pathname) {
  const segments = pathname.split('/').filter(Boolean);
  const breadcrumbs = [];

  const labels = {
    admin: '관리자',
    analytics: '애널리틱스',
    customers: '고객 관리',
    images: '이미지 관리',
    characters: '캐릭터',
    general: '일반',
    settings: '설정',
    contacts: '문의 관리',
    feedback: '피드백 관리',
  };

  let path = '';
  segments.forEach((segment, index) => {
    path += `/${segment}`;
    breadcrumbs.push({
      label: labels[segment] || segment,
      href: path,
      isLast: index === segments.length - 1,
    });
  });

  return breadcrumbs;
}

// 알림 배지 컴포넌트
function NotificationBadge({ count }) {
  if (!count || count <= 0) return null;
  return (
    <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-primary text-[10px] font-medium text-primary-foreground px-1.5">
      {count > 99 ? '99+' : count}
    </span>
  );
}

export function AdminShell({ session, children }) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const breadcrumbs = getBreadcrumbs(pathname);
  const userGrade = session?.user?.grade || 99;

  // 메뉴 필터링
  const mainMenu = ADMIN_MENU.main;
  const settingsMenu = filterMenuByGrade(ADMIN_MENU.settings, userGrade);

  // 열린 메뉴 상태 관리 (localStorage 저장)
  const [openMenus, setOpenMenus] = React.useState({});

  // 알림 카운트 (전역 store)
  const { contacts, feedback, fetchNotifications } = useAdminNotifications();

  // 초기 로드 및 페이지 이동 시 갱신
  React.useEffect(() => {
    fetchNotifications();
  }, [pathname]);

  // URL → 알림 카운트 매핑
  const getNotificationCount = (url) => {
    if (url === '/admin/contacts') return contacts;
    if (url === '/admin/feedback') return feedback;
    return 0;
  };

  // 초기화: localStorage에서 불러오기
  React.useEffect(() => {
    const saved = localStorage.getItem('admin-open-menus');
    if (saved) {
      setOpenMenus(JSON.parse(saved));
    } else {
      // 저장된 값 없으면 현재 경로 기준으로 열기
      const initial = {};
      mainMenu.forEach((item) => {
        if (item.items) {
          const hasActiveChild = item.items.some((sub) => pathname.startsWith(sub.url));
          if (hasActiveChild) {
            initial[item.title] = true;
          }
        }
      });
      setOpenMenus(initial);
    }
  }, []);

  // 현재 경로가 메뉴 아이템과 일치하는지 확인
  const isActive = (url) => {
    if (url === '/admin') return pathname === '/admin';
    return pathname.startsWith(url);
  };

  // 메뉴 토글
  const toggleMenu = (title) => {
    setOpenMenus((prev) => {
      const next = { ...prev, [title]: !prev[title] };
      localStorage.setItem('admin-open-menus', JSON.stringify(next));
      return next;
    });
  };

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link href="/">
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                    <span className="font-bold text-sm">KM</span>
                  </div>
                  <span className="truncate font-bold text-base">KoreaMongol</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        <SidebarContent>
          {/* 메인 메뉴 */}
          <SidebarGroup>
            <SidebarGroupLabel>메뉴</SidebarGroupLabel>
            <SidebarMenu>
              {mainMenu.map((item) =>
                item.items ? (
                  <Collapsible
                    key={item.title}
                    asChild
                    open={openMenus[item.title] || false}
                    onOpenChange={() => toggleMenu(item.title)}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title}>
                          {item.icon && <item.icon />}
                          <span>{item.title}</span>
                          <ChevronRight className="ml-auto transition-transform duration-300 group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton
                                asChild
                                isActive={isActive(subItem.url)}
                              >
                                <Link href={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                ) : (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                      tooltip={item.title}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                        <NotificationBadge count={getNotificationCount(item.url)} />
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              )}
            </SidebarMenu>
          </SidebarGroup>

          {/* 설정 메뉴 (권한 있는 경우만) */}
          {settingsMenu.length > 0 && (
            <SidebarGroup className="group-data-[collapsible=icon]:hidden">
              <SidebarGroupLabel>관리</SidebarGroupLabel>
              <SidebarMenu>
                {settingsMenu.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive(item.url)}
                    >
                      <Link href={item.url}>
                        {item.icon && <item.icon />}
                        <span>{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroup>
          )}
        </SidebarContent>

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg">
                      <AvatarImage
                        src={session?.user?.image}
                        alt={session?.user?.name}
                      />
                      <AvatarFallback className="rounded-lg">
                        {session?.user?.name?.charAt(0) || 'U'}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid flex-1 text-left text-sm leading-tight">
                      <span className="truncate font-semibold">
                        {session?.user?.name}
                      </span>
                      <span className="truncate text-xs">
                        {getGradeLabel(session?.user?.grade)}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                  side={isMobile ? 'bottom' : 'right'}
                  align="end"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="h-8 w-8 rounded-lg">
                        <AvatarImage
                          src={session?.user?.image}
                          alt={session?.user?.name}
                        />
                        <AvatarFallback className="rounded-lg">
                          {session?.user?.name?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {session?.user?.name}
                        </span>
                        <span className="truncate text-xs text-muted-foreground">
                          {session?.user?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/">
                      <Home className="mr-2 size-4" />
                      홈으로
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => signOut({ callbackUrl: '/' })}>
                    <LogOut className="mr-2 size-4" />
                    로그아웃
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
        <SidebarRail />
      </Sidebar>

      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={crumb.href}>
                    {index > 0 && <BreadcrumbSeparator className="hidden md:block" />}
                    <BreadcrumbItem className={index === 0 ? 'hidden md:block' : ''}>
                      {crumb.isLast ? (
                        <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink href={crumb.href}>
                          {crumb.label}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
