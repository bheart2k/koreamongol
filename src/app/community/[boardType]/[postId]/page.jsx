import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ChevronLeft, Clock, User } from 'lucide-react';
import { db, posts, users } from '@/lib/db';
import { eq } from 'drizzle-orm';
import { lexicalToHtml } from '@/lib/lexical-to-html';
import { Button } from '@/components/ui/button';
import { ViewCounter, PostActionButtons, PostStats } from '@/components/community/PostActions';
import AdBanner from '@/components/ui/ad-banner';
import CommentSection from '@/components/community/CommentSection';

function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default async function PostDetailPage({ params }) {
  const { boardType, postId } = await params;
  const locale = 'ko';

  let post = null;
  try {
    // 게시글 + 작성자 조인 쿼리
    const [row] = await db.select({
      id: posts.id,
      boardType: posts.boardType,
      title: posts.title,
      content: posts.content,
      summary: posts.summary,
      images: posts.images,
      tags: posts.tags,
      viewCount: posts.viewCount,
      likeCount: posts.likeCount,
      commentCount: posts.commentCount,
      isPinned: posts.isPinned,
      isNotice: posts.isNotice,
      state: posts.state,
      createdAt: posts.createdAt,
      updatedAt: posts.updatedAt,
      authorId: users.id,
      authorName: users.name,
      authorNickname: users.nickname,
      authorImage: users.image,
      authorLevel: users.level,
    }).from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, parseInt(postId)))
      .limit(1);

    if (!row || row.state === 'D') {
      notFound();
    }

    post = {
      id: row.id,
      boardType: row.boardType,
      title: row.title,
      content: row.content,
      summary: row.summary,
      images: row.images,
      tags: row.tags,
      viewCount: row.viewCount,
      likeCount: row.likeCount,
      commentCount: row.commentCount,
      isPinned: row.isPinned,
      isNotice: row.isNotice,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      author: {
        id: row.authorId,
        nickname: row.authorNickname,
        image: row.authorImage,
        level: row.authorLevel,
      },
    };
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    notFound();
  }

  // Lexical JSON → HTML 변환 (서버에서 처리)
  const contentHtml = lexicalToHtml(post.content);

  return (
    <main className="min-h-content bg-background">
      {/* Header */}
      <section className="py-4 px-6 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <Link
            href={`/community/${boardType}`}
            className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            {isKo ? '목록으로' : 'Back to List'}
          </Link>
        </div>
      </section>

      {/* Post Content */}
      <article className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          {/* Title */}
          <h1 className="text-headline mb-4">{post.title}</h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6 pb-6 border-b border-border">
            <div className="flex items-center gap-2">
              {post.author?.image ? (
                <img
                  src={post.author.image}
                  alt=""
                  className="w-8 h-8 rounded-full object-cover"
                />
              ) : (
                <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
              )}
              <div>
                <div className="font-medium text-foreground">
                  {post.author?.nickname || '익명'}
                </div>
                {post.author?.level && (
                  <div className="text-xs">Lv.{post.author.level}</div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              <span>{formatDate(post.createdAt)}</span>
            </div>

            <div className="flex items-center gap-4">
              {/* 조회수 (클라이언트에서 증가) */}
              <ViewCounter postId={String(post.id)} initialCount={post.viewCount} />
              {/* 좋아요, 댓글 수 */}
              <PostStats likeCount={post.likeCount} commentCount={post.commentCount} />
            </div>

            {/* Actions (클라이언트 컴포넌트) */}
            <div className="ml-auto">
              <PostActionButtons
                postId={String(post.id)}
                boardType={boardType}
                locale={locale}
                authorId={String(post.author?.id)}
                title={post.title}
              />
            </div>
          </div>

          {/* Tags */}
          {post.tags && post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 rounded-full bg-muted text-xs font-medium"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Content - SSR로 렌더링된 HTML */}
          <div
            className="prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />

          {/* 광고 */}
          <div className="mt-12 pt-8 border-t border-border">
            <AdBanner type="display" />
          </div>

          {/* Comments Section */}
          <CommentSection
            postId={String(post.id)}
            initialCount={post.commentCount}
            locale={locale}
          />
        </div>
      </article>
    </main>
  );
}
