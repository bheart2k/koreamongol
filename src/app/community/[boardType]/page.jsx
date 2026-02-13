'use client';

import { useState, use, useRef } from 'react';
import Link from 'next/link';

import { useSession } from 'next-auth/react';
import { motion } from 'motion/react';
import { useInView } from 'motion/react';
import Image from 'next/image';
import {
  BookOpen,
  MessageCircle,
  Megaphone,
  Plus,
  Eye,
  Heart,
  MessageSquare,
  ChevronLeft,
  ChevronRight,
  Clock,
  Pin,
  Search,
  Loader2,
  User,
  ImageIcon,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { usePosts } from '@/lib/swr/hooks';
import AdBanner from '@/components/ui/ad-banner';

const boardConfig = {
  blog: {
    icon: BookOpen,
    title: 'Блог',
    desc: 'Солонгос-Монголын соёл, аялал, амьдралын тухай нийтлэл',
    color: 'text-blue-500',
    bgColor: 'bg-blue-500/10',
  },
  free: {
    icon: MessageCircle,
    title: 'Чөлөөт самбар',
    desc: 'Чөлөөтэй ярилцах, асуулт хариулт солилцох',
    color: 'text-green-500',
    bgColor: 'bg-green-500/10',
  },
  notice: {
    icon: Megaphone,
    title: 'Мэдэгдэл & FAQ',
    desc: 'KoreaMongol-ын мэдэгдэл болон түгээмэл асуултууд',
    color: 'text-amber-500',
    bgColor: 'bg-amber-500/10',
  },
};

function formatDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  if (hours < 24) return `${hours}시간 전`;
  if (days < 7) return `${days}일 전`;

  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function BoardListPage({ params }) {
  const { boardType } = use(params);
  const { data: session } = useSession();

  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const board = boardConfig[boardType];

  // SWR로 게시글 목록 조회
  const { posts, pagination, isLoading, isValidating, error, mutate } = usePosts({
    boardType,
    page,
    search: searchQuery,
  });

  // 유효하지 않은 게시판 타입 처리
  if (!board) {
    return (
      <main className="min-h-content bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-headline mb-4">404</h1>
          <p className="text-muted-foreground mb-6">
            Самбар олдсонгүй.
          </p>
          <Button asChild>
            <Link href="/community">
              Нийгэмлэг рүү буцах
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const handleSearch = (e) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setPage(1);
  };

  const Icon = board.icon;

  // 글쓰기 권한 체크 (notice는 관리자만 - grade 20 이하)
  const isAdminUser = session?.user?.grade && session.user.grade <= 20;
  const canWrite = session?.user && (boardType !== 'notice' || isAdminUser);

  return (
    <main className="min-h-content bg-background">
      {/* Header */}
      <section className="py-8 md:py-12 px-6 border-b border-border">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <Link
              href="/community"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className={`w-10 h-10 rounded-lg ${board.bgColor} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${board.color}`} />
            </div>
            <div className="flex-1">
              <h1 className="text-title font-semibold">
                {board.title}
              </h1>
              <p className="text-sm text-muted-foreground">
                {board.desc}
              </p>
            </div>
            {/* 백그라운드 갱신 인디케이터 */}
            {isValidating && !isLoading && (
              <RefreshCw className="w-4 h-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {/* Search & Write */}
          <div className="flex flex-col sm:flex-row gap-3">
            <form onSubmit={handleSearch} className="flex-1 flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Хайх..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button type="submit" variant="secondary">
                Хайх
              </Button>
            </form>
            {canWrite && (
              <Button asChild>
                <Link href={`/community/${boardType}/write`}>
                  <Plus className="w-4 h-4 mr-2" />
                  Бичих
                </Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      {/* Post List */}
      <section className="py-6 px-6">
        <div className="max-w-6xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button variant="outline" onClick={() => mutate()}>
                Дахин оролдох
              </Button>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                <Icon className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">
                {searchQuery
                  ? 'Хайлтын үр дүн олдсонгүй.'
                  : 'Нийтлэл байхгүй байна.'}
              </p>
              {canWrite && !searchQuery && (
                <Button asChild>
                  <Link href={`/community/${boardType}/write`}>
                    <Plus className="w-4 h-4 mr-2" />
                    Эхний нийтлэл бичих
                  </Link>
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              {posts.map((post) => (
                <PostItem
                  key={post.id}
                  post={post}
                  boardType={boardType}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!isLoading && !error && (
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm text-muted-foreground px-4">
                {page} / {pagination.totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
                disabled={page === pagination.totalPages}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          )}

          {/* 광고 */}
          <div className="mt-12">
            <AdBanner type="display" />
          </div>
        </div>
      </section>
    </main>
  );
}

// 개별 게시글 아이템 컴포넌트 (뷰포트 기반 애니메이션)
function PostItem({ post, boardType }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 10 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
      transition={{ duration: 0.3 }}
    >
      <Link
        href={`/community/${boardType}/${post.id}`}
        className="group block"
      >
        <div
          className={cn(
            'rounded-xl border border-border bg-card transition-all duration-200',
            'hover:border-accent/50 hover:shadow-md',
            post.isPinned && 'bg-accent/5 border-accent/30'
          )}
        >
          <div className="flex">
            {/* Content */}
            <div className="flex-1 min-w-0 p-4 px-5">
              {/* Title */}
              <div className="flex items-center gap-2 mb-2">
                {post.isPinned && (
                  <Pin className="w-4 h-4 text-accent shrink-0" />
                )}
                <h3 className="font-medium group-hover:text-accent transition-colors line-clamp-1">
                  {post.title}
                </h3>
              </div>

              {/* Content Preview */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {post.summary || post.content}
              </p>

              {/* Meta */}
              <div className="flex items-center flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  {post.author?.image ? (
                    <img
                      src={post.author.image}
                      alt=""
                      className="w-4 h-4 rounded-full object-cover"
                    />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                  <span>{post.author?.nickname || '익명'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <Eye className="w-3 h-3" />
                    <span>{post.viewCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Heart className="w-3 h-3" />
                    <span>{post.likeCount}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageSquare className="w-3 h-3" />
                    <span>{post.commentCount}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Thumbnail */}
            <div className="shrink-0 p-2">
              <div className="w-30 h-30 rounded-lg overflow-hidden bg-muted">
                {post.thumbnail ? (
                  <Image
                    src={post.thumbnail}
                    alt={post.title}
                    width={112}
                    height={112}
                    sizes="112px"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ImageIcon className="w-8 h-8 text-muted-foreground/30" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
