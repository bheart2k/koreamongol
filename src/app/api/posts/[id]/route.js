import { NextResponse } from 'next/server';
import { auth, isAdmin } from '@/lib/auth';
import { db, posts, users } from '@/lib/db';
import { eq, sql } from 'drizzle-orm';
import { extractImageUrls, moveTempImages, findRemovedImages, deleteImagesFromR2 } from '@/lib/upload/imageUtils';
import { generateSummary } from '@/lib/utils/postUtils';

/**
 * GET /api/posts/[id] - 게시글 상세 조회
 */
export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const noCount = searchParams.get('noCount') === '1';

    const [post] = await db.select({
      id: posts.id,
      authorId: posts.authorId,
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
      authorNickname: users.nickname,
      authorImage: users.image,
      authorLevel: users.level,
    })
      .from(posts)
      .leftJoin(users, eq(posts.authorId, users.id))
      .where(eq(posts.id, parseInt(id)))
      .limit(1);

    if (!post || post.state === 'D') {
      return NextResponse.json({ success: false, error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 조회수 증가 (noCount가 아닐 때만)
    if (!noCount) {
      await db.update(posts).set({
        viewCount: sql`${posts.viewCount} + 1`,
      }).where(eq(posts.id, parseInt(id)));
    }

    // 응답 형식 구성
    const responseData = {
      id: post.id,
      authorId: post.authorId,
      boardType: post.boardType,
      title: post.title,
      content: post.content,
      summary: post.summary,
      images: post.images,
      tags: post.tags,
      viewCount: noCount ? post.viewCount : post.viewCount + 1,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      isPinned: post.isPinned,
      isNotice: post.isNotice,
      state: post.state,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      author: {
        id: post.authorId,
        nickname: post.authorNickname,
        image: post.authorImage,
        level: post.authorLevel,
      },
    };

    return NextResponse.json({
      success: true,
      data: responseData,
    });
  } catch (error) {
    console.error('게시글 조회 오류:', error);
    return NextResponse.json({ success: false, error: '게시글 조회 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

/**
 * PUT /api/posts/[id] - 게시글 수정
 */
export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, content, tags, sessionId } = body;

    const postId = parseInt(id);
    const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

    if (!post || post.state === 'D') {
      return NextResponse.json({ success: false, error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 권한 체크 (작성자 또는 관리자)
    const isAuthor = post.authorId === parseInt(session.user.id);
    if (!isAuthor && !isAdmin(session)) {
      return NextResponse.json({ success: false, error: '권한이 없습니다.' }, { status: 403 });
    }

    // 유효성 검사
    if (!title || title.trim().length === 0) {
      return NextResponse.json({ success: false, error: '제목을 입력해주세요.' }, { status: 400 });
    }

    if (!content || content.trim().length === 0) {
      return NextResponse.json({ success: false, error: '내용을 입력해주세요.' }, { status: 400 });
    }

    // 삭제된 이미지 R2에서 제거
    const removedImages = findRemovedImages(post.content, content);
    if (removedImages.length > 0) {
      await deleteImagesFromR2(removedImages);
    }

    // 새로 추가된 임시 이미지 이동
    let updatedContent = content;
    const newImageUrls = extractImageUrls(content);
    const tempImages = newImageUrls.filter((url) => url.includes('/posts/temp/'));

    if (tempImages.length > 0 && sessionId) {
      const movedUrls = await moveTempImages(tempImages, sessionId, id, post.boardType);

      for (let i = 0; i < tempImages.length; i++) {
        if (tempImages[i] !== movedUrls[i]) {
          updatedContent = updatedContent.replace(tempImages[i], movedUrls[i]);
        }
      }
    }

    // 게시글 업데이트 (summary 재생성)
    const finalImageUrls = extractImageUrls(updatedContent);
    const summary = generateSummary(updatedContent);

    const [updatedPost] = await db.update(posts).set({
      title: title.trim(),
      content: updatedContent,
      summary,
      tags: tags || [],
      images: finalImageUrls.map((url) => ({ url, alt: '' })),
      updatedAt: new Date(),
    }).where(eq(posts.id, postId)).returning();

    // 작성자 정보 조회
    const [author] = await db.select({
      id: users.id,
      nickname: users.nickname,
      image: users.image,
      level: users.level,
    }).from(users).where(eq(users.id, updatedPost.authorId)).limit(1);

    return NextResponse.json({
      success: true,
      data: {
        ...updatedPost,
        author,
      },
    });
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    return NextResponse.json({ success: false, error: '게시글 수정 중 오류가 발생했습니다.' }, { status: 500 });
  }
}

/**
 * DELETE /api/posts/[id] - 게시글 삭제
 */
export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ success: false, error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const { id } = await params;
    const postId = parseInt(id);

    const [post] = await db.select().from(posts).where(eq(posts.id, postId)).limit(1);

    if (!post || post.state === 'D') {
      return NextResponse.json({ success: false, error: '게시글을 찾을 수 없습니다.' }, { status: 404 });
    }

    // 권한 체크 (작성자 또는 관리자)
    const isAuthor = post.authorId === parseInt(session.user.id);
    if (!isAuthor && !isAdmin(session)) {
      return NextResponse.json({ success: false, error: '권한이 없습니다.' }, { status: 403 });
    }

    // 병렬 처리
    const updates = [
      db.update(posts).set({ state: 'D', updatedAt: new Date() }).where(eq(posts.id, postId)),
      db.update(users).set({
        stats: sql`jsonb_set(${users.stats}, '{postsCount}', (GREATEST(COALESCE((${users.stats}->>'postsCount')::int, 0) - 1, 0))::text::jsonb)`,
        updatedAt: new Date(),
      }).where(eq(users.id, post.authorId)),
    ];

    // 이미지 삭제
    const imageUrls = extractImageUrls(post.content);
    if (imageUrls.length > 0) {
      updates.push(deleteImagesFromR2(imageUrls));
    }

    await Promise.all(updates);

    return NextResponse.json({
      success: true,
      message: '게시글이 삭제되었습니다.',
    });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    return NextResponse.json({ success: false, error: '게시글 삭제 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
