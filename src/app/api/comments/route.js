import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db, comments, posts, users } from '@/lib/db';
import { eq, and, asc, count, sql, isNull } from 'drizzle-orm';
import { givePoints } from '@/lib/services/pointService';

/**
 * GET /api/comments - 댓글 목록 조회
 */
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const postId = searchParams.get('postId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');

    if (!postId) {
      return NextResponse.json({ success: false, error: 'postId가 필요합니다.' }, { status: 400 });
    }

    const postIdInt = parseInt(postId);
    const skip = (page - 1) * limit;

    // 1. 부모 댓글 조회 (depth=0, state='Y') + 작성자 정보 join
    const [parentComments, [{ total }]] = await Promise.all([
      db.select({
        id: comments.id,
        postId: comments.postId,
        authorId: comments.authorId,
        parentCommentId: comments.parentCommentId,
        depth: comments.depth,
        replyToUser: comments.replyToUser,
        content: comments.content,
        likeCount: comments.likeCount,
        replyCount: comments.replyCount,
        state: comments.state,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        authorNickname: users.nickname,
        authorImage: users.image,
        authorLevel: users.level,
      })
        .from(comments)
        .leftJoin(users, eq(comments.authorId, users.id))
        .where(and(
          eq(comments.postId, postIdInt),
          eq(comments.depth, 0),
          eq(comments.state, 'Y'),
        ))
        .orderBy(asc(comments.createdAt))
        .offset(skip)
        .limit(limit),
      db.select({ total: count() })
        .from(comments)
        .where(and(
          eq(comments.postId, postIdInt),
          eq(comments.depth, 0),
          eq(comments.state, 'Y'),
        )),
    ]);

    // 2. 부모 댓글 ID 목록
    const parentIds = parentComments.map((c) => c.id);

    // 3. 대댓글 조회 (부모 댓글의 replies)
    let repliesMap = {};
    if (parentIds.length > 0) {
      const replies = await db.select({
        id: comments.id,
        postId: comments.postId,
        authorId: comments.authorId,
        parentCommentId: comments.parentCommentId,
        depth: comments.depth,
        replyToUser: comments.replyToUser,
        content: comments.content,
        likeCount: comments.likeCount,
        replyCount: comments.replyCount,
        state: comments.state,
        createdAt: comments.createdAt,
        updatedAt: comments.updatedAt,
        authorNickname: users.nickname,
        authorImage: users.image,
        authorLevel: users.level,
      })
        .from(comments)
        .leftJoin(users, eq(comments.authorId, users.id))
        .where(and(
          sql`${comments.parentCommentId} IN (${sql.join(parentIds.map(id => sql`${id}`), sql`, `)})`,
          eq(comments.state, 'Y'),
        ))
        .orderBy(asc(comments.createdAt));

      // 대댓글을 부모별로 그룹핑
      for (const reply of replies) {
        const formatted = {
          id: reply.id,
          postId: reply.postId,
          authorId: reply.authorId,
          parentCommentId: reply.parentCommentId,
          depth: reply.depth,
          replyToUser: reply.replyToUser,
          content: reply.content,
          likeCount: reply.likeCount,
          replyCount: reply.replyCount,
          state: reply.state,
          createdAt: reply.createdAt,
          updatedAt: reply.updatedAt,
          author: {
            id: reply.authorId,
            nickname: reply.authorNickname,
            image: reply.authorImage,
            level: reply.authorLevel,
          },
        };
        if (!repliesMap[reply.parentCommentId]) {
          repliesMap[reply.parentCommentId] = [];
        }
        repliesMap[reply.parentCommentId].push(formatted);
      }
    }

    // 4. 부모 댓글 + 대댓글 조합
    const result = parentComments.map((c) => ({
      id: c.id,
      postId: c.postId,
      authorId: c.authorId,
      parentCommentId: c.parentCommentId,
      depth: c.depth,
      replyToUser: c.replyToUser,
      content: c.content,
      likeCount: c.likeCount,
      replyCount: c.replyCount,
      state: c.state,
      createdAt: c.createdAt,
      updatedAt: c.updatedAt,
      author: {
        id: c.authorId,
        nickname: c.authorNickname,
        image: c.authorImage,
        level: c.authorLevel,
      },
      replies: repliesMap[c.id] || [],
    }));

    return NextResponse.json({
      success: true,
      data: result,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('댓글 조회 오류:', error);
    return NextResponse.json({ success: false, error: '댓글 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

/**
 * POST /api/comments - 댓글 작성
 */
export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = await request.json();
    const { postId, content, parentCommentId, replyToUser } = body;

    // 유효성 검사
    if (!postId) {
      return NextResponse.json({ success: false, error: 'postId가 필요합니다.' }, { status: 400 });
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: '내용을 입력해주세요.' }, { status: 400 });
    }

    if (content.trim().length > 1000) {
      return NextResponse.json({ success: false, error: '댓글은 1000자까지 입력할 수 있습니다.' }, { status: 400 });
    }

    const postIdInt = parseInt(postId);

    // 게시글 확인
    const [post] = await db.select().from(posts).where(eq(posts.id, postIdInt)).limit(1);
    if (!post || post.state === 'D') {
      return NextResponse.json({ success: false, error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 대댓글인 경우 부모 댓글 확인
    let depth = 0;
    let parentCommentIdInt = null;
    if (parentCommentId) {
      parentCommentIdInt = parseInt(parentCommentId);
      const [parentComment] = await db.select().from(comments).where(eq(comments.id, parentCommentIdInt)).limit(1);
      if (!parentComment || parentComment.state === 'D') {
        return NextResponse.json({ success: false, error: '부모 댓글을 찾을 수 없습니다.' }, { status: 404 });
      }
      depth = 1; // 대댓글까지만 허용
    }

    // 댓글 생성
    const commentData = {
      postId: postIdInt,
      authorId: parseInt(session.user.id),
      content: content.trim(),
      parentCommentId: parentCommentIdInt,
      depth,
    };

    if (replyToUser && replyToUser.id) {
      commentData.replyToUser = {
        id: replyToUser.id,
        nickname: replyToUser.nickname,
      };
    }

    const [comment] = await db.insert(comments).values(commentData).returning();

    // 병렬 처리
    const userId = parseInt(session.user.id);
    const updates = [
      db.update(posts).set({
        commentCount: sql`${posts.commentCount} + 1`,
      }).where(eq(posts.id, postIdInt)),
      db.update(users).set({
        stats: sql`jsonb_set(${users.stats}, '{commentsCount}', (COALESCE((${users.stats}->>'commentsCount')::int, 0) + 1)::text::jsonb)`,
        updatedAt: new Date(),
      }).where(eq(users.id, userId)),
      givePoints(session.user.id, 'comment', { relatedType: 'Comment', relatedId: comment.id }),
    ];

    if (parentCommentIdInt) {
      updates.push(
        db.update(comments).set({
          replyCount: sql`${comments.replyCount} + 1`,
        }).where(eq(comments.id, parentCommentIdInt))
      );
    }

    const [, , pointResult] = await Promise.all(updates);

    // 작성자 정보 조회
    const [author] = await db.select({
      id: users.id,
      nickname: users.nickname,
      image: users.image,
      level: users.level,
    }).from(users).where(eq(users.id, userId)).limit(1);

    const populatedComment = {
      ...comment,
      author,
    };

    return NextResponse.json({
      success: true,
      data: populatedComment,
      pointResult,
    });
  } catch (error) {
    console.error('댓글 작성 오류:', error);
    return NextResponse.json({ success: false, error: '댓글 작성 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
