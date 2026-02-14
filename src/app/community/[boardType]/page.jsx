import { db, posts, users } from '@/lib/db';
import { eq, and, desc, count } from 'drizzle-orm';
import BoardListClient from './BoardListClient';

const VALID_BOARDS = ['blog', 'free', 'notice', 'expression'];

async function getInitialPosts(boardType) {
  try {
    const limit = 15;
    const whereClause = and(
      eq(posts.boardType, boardType),
      eq(posts.state, 'Y'),
    );

    const [postsData, [{ total }]] = await Promise.all([
      db.select({
        id: posts.id,
        boardType: posts.boardType,
        title: posts.title,
        summary: posts.summary,
        images: posts.images,
        tags: posts.tags,
        viewCount: posts.viewCount,
        likeCount: posts.likeCount,
        commentCount: posts.commentCount,
        isPinned: posts.isPinned,
        isNotice: posts.isNotice,
        createdAt: posts.createdAt,
        authorId: users.id,
        authorNickname: users.nickname,
        authorImage: users.image,
        authorLevel: users.level,
      })
        .from(posts)
        .leftJoin(users, eq(posts.authorId, users.id))
        .where(whereClause)
        .orderBy(desc(posts.isPinned), desc(posts.createdAt))
        .limit(limit),
      db.select({ total: count() }).from(posts).where(whereClause),
    ]);

    const summaries = postsData.map((post) => ({
      id: post.id,
      boardType: post.boardType,
      title: post.title,
      content: post.summary || '',
      thumbnail: post.images?.[0]?.url || null,
      author: {
        id: post.authorId,
        nickname: post.authorNickname,
        image: post.authorImage,
        level: post.authorLevel,
      },
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      tags: post.tags,
      isPinned: post.isPinned,
      isNotice: post.isNotice,
      createdAt: post.createdAt?.toISOString?.() || post.createdAt,
    }));

    return {
      posts: summaries,
      pagination: {
        page: 1,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  } catch (error) {
    console.error('초기 게시글 로드 오류:', error);
    return {
      posts: [],
      pagination: { page: 1, limit: 15, total: 0, totalPages: 1 },
    };
  }
}

export default async function BoardListPage({ params }) {
  const { boardType } = await params;

  // 유효한 게시판인지 확인
  if (!VALID_BOARDS.includes(boardType)) {
    return <BoardListClient boardType={boardType} initialData={null} />;
  }

  const initialData = await getInitialPosts(boardType);

  return <BoardListClient boardType={boardType} initialData={initialData} />;
}
