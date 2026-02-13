import { NextResponse } from 'next/server';
import { auth, isAdmin } from '@/lib/auth';
import { db, posts, users } from '@/lib/db';
import { eq, and, desc, asc, count, sql, or, ilike } from 'drizzle-orm';
import { givePoints } from '@/lib/services/pointService';
import { extractImageUrls, moveTempImages } from '@/lib/upload/imageUtils';
import { generateSummary } from '@/lib/utils/postUtils';

/**
 * GET /api/posts - 게시글 목록 조회
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const boardType = searchParams.get('boardType') || 'blog';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '15');
    const sort = searchParams.get('sort') || 'latest'; // latest, popular
    const tag = searchParams.get('tag');
    const search = searchParams.get('search');

    // 조건 구성
    const conditions = [
      eq(posts.boardType, boardType),
      eq(posts.state, 'Y'),
    ];

    if (tag) {
      // jsonb 배열에 tag가 포함되어 있는지 확인
      conditions.push(sql`${posts.tags} @> ${JSON.stringify([tag])}::jsonb`);
    }

    if (search) {
      conditions.push(
        or(
          ilike(posts.title, `%${search}%`),
          ilike(posts.summary, `%${search}%`)
        )
      );
    }

    const whereClause = and(...conditions);

    // 정렬
    let orderByClause;
    if (sort === 'popular') {
      orderByClause = [desc(posts.likeCount), desc(posts.createdAt)];
    } else {
      orderByClause = [desc(posts.isPinned), desc(posts.createdAt)];
    }

    const skip = (page - 1) * limit;

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
        .orderBy(...orderByClause)
        .offset(skip)
        .limit(limit),
      db.select({ total: count() }).from(posts).where(whereClause),
    ]);

    // 응답 형식에 맞게 변환
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
      createdAt: post.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: summaries,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    return NextResponse.json({ success: false, error: '게시글 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

/**
 * POST /api/posts - 게시글 작성
 */
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { boardType, title, content, tags, sessionId } = body;

    // 유효성 검사
    if (!boardType || !['blog', 'free', 'notice'].includes(boardType)) {
      return NextResponse.json({ success: false, error: '유효하지 않은 게시판 타입입니다.' }, { status: 400 });
    }

    // notice 게시판은 관리자만
    if (boardType === 'notice' && !isAdmin(session)) {
      return NextResponse.json({ success: false, error: '권한이 없습니다.' }, { status: 403 });
    }

    if (!title || title.trim().length === 0) {
      return NextResponse.json({ success: false, error: '제목을 입력해주세요.' }, { status: 400 });
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: '내용을 입력해주세요.' }, { status: 400 });
    }

    // summary 생성
    const summary = generateSummary(content);

    // 게시글 생성
    const [post] = await db.insert(posts).values({
      authorId: parseInt(session.user.id),
      boardType,
      title: title.trim(),
      content,
      summary,
      tags: tags || [],
    }).returning();

    // 이미지 이동 (temp -> 최종 폴더)
    const imageUrls = extractImageUrls(content);
    if (imageUrls.length > 0 && sessionId) {
      const movedUrls = await moveTempImages(imageUrls, sessionId, post.id.toString(), boardType);

      // content 내 URL 교체
      let updatedContent = content;
      for (let i = 0; i < imageUrls.length; i++) {
        if (imageUrls[i] !== movedUrls[i]) {
          updatedContent = updatedContent.replace(imageUrls[i], movedUrls[i]);
        }
      }

      // 이미지 정보 저장
      await db.update(posts).set({
        content: updatedContent,
        images: movedUrls.map((url) => ({ url, alt: '' })),
      }).where(eq(posts.id, post.id));
    }

    // 병렬 처리: 사용자 통계 + 포인트 지급
    const userId = parseInt(session.user.id);
    const updates = [
      db.update(users).set({
        stats: sql`jsonb_set(${users.stats}, '{postsCount}', (COALESCE((${users.stats}->>'postsCount')::int, 0) + 1)::text::jsonb)`,
        updatedAt: new Date(),
      }).where(eq(users.id, userId)),
    ];

    if (boardType !== 'notice') {
      updates.push(givePoints(session.user.id, 'post', { relatedType: 'Post', relatedId: post.id }));
    }

    const results = await Promise.all(updates);
    const pointResult = boardType !== 'notice' ? results[1] : null;

    return NextResponse.json({
      success: true,
      data: post,
      pointResult,
    });
  } catch (error) {
    console.error('게시글 작성 오류:', error);
    return NextResponse.json({ success: false, error: '게시글 작성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
