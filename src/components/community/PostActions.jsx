'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Edit, Trash2, Share2, Eye, Heart, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

/**
 * 조회수 중복 방지 (1시간)
 */
function shouldCountView(postId) {
  const VIEW_COOLDOWN = 60 * 60 * 1000; // 1시간
  const storageKey = 'viewed_posts';

  try {
    const viewed = JSON.parse(localStorage.getItem(storageKey) || '{}');
    const lastViewed = viewed[postId];
    const now = Date.now();

    if (lastViewed && now - lastViewed < VIEW_COOLDOWN) {
      return false;
    }

    viewed[postId] = now;

    // 오래된 기록 정리 (24시간 지난 것)
    Object.keys(viewed).forEach(key => {
      if (now - viewed[key] > 24 * 60 * 60 * 1000) {
        delete viewed[key];
      }
    });

    localStorage.setItem(storageKey, JSON.stringify(viewed));
    return true;
  } catch {
    return true;
  }
}

/**
 * 조회수 카운터 - 클라이언트에서 조회수 증가 요청
 */
export function ViewCounter({ postId, initialCount }) {
  const [viewCount, setViewCount] = useState(initialCount);

  useEffect(() => {
    if (shouldCountView(postId)) {
      // 조회수 증가 API 호출
      fetch(`/api/posts/${postId}/view`, { method: 'POST' })
        .then(res => res.json())
        .then(data => {
          if (data.success && data.viewCount) {
            setViewCount(data.viewCount);
          }
        })
        .catch(() => {});
    }
  }, [postId]);

  return (
    <div className="flex items-center gap-1">
      <Eye className="w-4 h-4" />
      <span>{viewCount}</span>
    </div>
  );
}

/**
 * 게시글 액션 버튼들 (수정, 삭제, 공유)
 */
export function PostActionButtons({
  postId,
  boardType,
  locale,
  authorId,
  title,
}) {
  const router = useRouter();
  const { data: session } = useSession();
  const isKo = locale === 'ko';

  const [deleting, setDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  // 권한 체크
  const isAuthor = session?.user?.id === authorId;
  const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'dev';
  const canEdit = isAuthor || isAdmin;
  const canDelete = isAuthor || isAdmin;

  // 삭제 핸들러
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const res = await fetch(`/api/posts/${postId}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.error(isKo ? '게시글이 삭제되었습니다.' : 'Post deleted.');
        router.push(`/${locale}/community/${boardType}`);
      } else {
        toast.error(data.error || (isKo ? '삭제에 실패했습니다.' : 'Failed to delete.'));
      }
    } catch (err) {
      toast.error(isKo ? '삭제 중 오류가 발생했습니다.' : 'An error occurred.');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  // 공유 핸들러
  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({ title, url });
      } catch {
        // 취소됨
      }
    } else {
      await navigator.clipboard.writeText(url);
      toast.success(isKo ? '링크가 복사되었습니다.' : 'Link copied!');
    }
  };

  return (
    <>
      <div className="flex items-center gap-2">
        {canDelete && (
          <Button
            variant="outline"
            size="sm"
            className="text-destructive border-destructive/50 hover:bg-destructive hover:text-destructive-foreground"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4 mr-1.5" />
            {isKo ? '삭제' : 'Delete'}
          </Button>
        )}
        <Button variant="outline" size="sm" onClick={handleShare}>
          <Share2 className="w-4 h-4 mr-1.5" />
          {isKo ? '공유' : 'Share'}
        </Button>
        {canEdit && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/${locale}/community/${boardType}/write?edit=${postId}`}>
              <Edit className="w-4 h-4 mr-1.5" />
              {isKo ? '수정' : 'Edit'}
            </Link>
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        variant="error"
        title={isKo ? '게시글 삭제' : 'Delete Post'}
        description={isKo ? '정말 이 게시글을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.' : 'Are you sure you want to delete this post? This action cannot be undone.'}
        cancelText={isKo ? '취소' : 'Cancel'}
        confirmText={isKo ? '삭제' : 'Delete'}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </>
  );
}

/**
 * 게시글 통계 (좋아요, 댓글 수)
 */
export function PostStats({ likeCount, commentCount }) {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-1">
        <Heart className="w-4 h-4" />
        <span>{likeCount}</span>
      </div>
      <div className="flex items-center gap-1">
        <MessageSquare className="w-4 h-4" />
        <span>{commentCount}</span>
      </div>
    </div>
  );
}
