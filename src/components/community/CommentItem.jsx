'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';
import {
  User,
  MessageSquare,
  Trash2,
  ChevronDown,
  ChevronUp,
  Edit2,
} from 'lucide-react';
import { toast } from 'sonner';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import CommentForm from './CommentForm';

function formatDate(dateString, locale = 'ko') {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now - date;

  // 1분 이내
  if (diff < 60 * 1000) {
    return locale === 'ko' ? '방금 전' : 'Just now';
  }

  // 1시간 이내
  if (diff < 60 * 60 * 1000) {
    const mins = Math.floor(diff / (60 * 1000));
    return locale === 'ko' ? `${mins}분 전` : `${mins}m ago`;
  }

  // 24시간 이내
  if (diff < 24 * 60 * 60 * 1000) {
    const hours = Math.floor(diff / (60 * 60 * 1000));
    return locale === 'ko' ? `${hours}시간 전` : `${hours}h ago`;
  }

  // 7일 이내
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    const days = Math.floor(diff / (24 * 60 * 60 * 1000));
    return locale === 'ko' ? `${days}일 전` : `${days}d ago`;
  }

  // 그 외
  return date.toLocaleDateString(locale === 'ko' ? 'ko-KR' : 'en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

/**
 * 개별 댓글 컴포넌트
 * @param {Object} props
 * @param {Object} props.comment - 댓글 데이터
 * @param {string} props.postId - 게시글 ID
 * @param {Function} props.onReplySubmit - 대댓글 작성 완료 콜백
 * @param {Function} props.onDelete - 삭제 완료 콜백
 * @param {Function} props.onUpdate - 수정 완료 콜백
 * @param {string} [props.locale] - 로케일
 * @param {boolean} [props.isReply] - 대댓글 여부
 */
export default function CommentItem({
  comment,
  postId,
  onReplySubmit,
  onDelete,
  onUpdate,
  locale = 'ko',
  isReply = false,
}) {
  const { data: session } = useSession();
  const isKo = locale === 'ko';

  const [showReplyForm, setShowReplyForm] = useState(false);
  const [showReplies, setShowReplies] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const isAuthor = session?.user?.id === comment.author?.id;
  const isAdmin = session?.user?.role === 'admin' || session?.user?.role === 'dev';
  const hasReplies = comment.replies && comment.replies.length > 0;
  // 답글이 있으면 삭제 불가
  const canDelete = (isAuthor || isAdmin) && !hasReplies;
  const canEdit = isAuthor;

  const handleDelete = async () => {
    setDeleting(true);

    try {
      const res = await fetch(`/api/comments/${comment.id}`, {
        method: 'DELETE',
      });
      const data = await res.json();

      if (data.success) {
        toast.error(isKo ? '댓글이 삭제되었습니다.' : 'Comment deleted.');
        onDelete?.(comment.id, comment.parentComment);
      } else {
        toast.error(data.error || (isKo ? '삭제에 실패했습니다.' : 'Failed to delete comment.'));
      }
    } catch (err) {
      console.error(err);
      toast.error(isKo ? '삭제 중 오류가 발생했습니다.' : 'An error occurred.');
    } finally {
      setDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleReplySubmit = (newComment, pointResult) => {
    setShowReplyForm(false);
    onReplySubmit?.(newComment, comment.id, pointResult);
  };

  const handleUpdateSubmit = (updatedData) => {
    setIsEditing(false);
    onUpdate?.(updatedData, comment.parentComment);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className={isReply ? 'ml-12 mt-3' : ''}
    >
      <div className="flex gap-3">
        {/* 프로필 이미지 */}
        {comment.author?.image ? (
          <img
            src={comment.author.image}
            alt=""
            className={`rounded-full object-cover flex-shrink-0 ${isReply ? 'w-7 h-7' : 'w-9 h-9'}`}
          />
        ) : (
          <div
            className={`rounded-full bg-muted flex items-center justify-center flex-shrink-0 ${isReply ? 'w-7 h-7' : 'w-9 h-9'}`}
          >
            <User className={isReply ? 'w-3.5 h-3.5' : 'w-4 h-4'} />
          </div>
        )}

        <div className="flex-1 min-w-0">
          {/* 헤더 */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-sm">
              {comment.author?.nickname || (isKo ? '익명' : 'Anonymous')}
            </span>
            {comment.author?.level && (
              <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                Lv.{comment.author.level}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {formatDate(comment.createdAt, locale)}
            </span>
            {comment.createdAt !== comment.updatedAt && (
              <span className="text-xs text-muted-foreground">
                ({isKo ? '수정됨' : 'edited'})
              </span>
            )}
          </div>

          {/* 내용 */}
          <div className="mt-1">
            {isEditing ? (
              <CommentForm
                mode="edit"
                initialContent={comment.content}
                commentId={comment.id}
                onSubmit={handleUpdateSubmit}
                onCancel={() => setIsEditing(false)}
                locale={locale}
              />
            ) : (
              <p className="text-sm whitespace-pre-wrap break-words">
                {comment.replyToUser && (
                  <span className="text-primary font-medium mr-1">
                    @{comment.replyToUser.nickname || (isKo ? '알 수 없음' : 'Unknown')}
                  </span>
                )}
                {comment.content}
              </p>
            )}
          </div>

          {/* 액션 버튼 */}
          {!isEditing && (
            <div className="flex items-center gap-3 mt-2">
              {/* 답글 버튼 (부모 댓글만) */}
              {!isReply && session?.user && (
                <button
                  type="button"
                  onClick={() => setShowReplyForm(!showReplyForm)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  {isKo ? '답글' : 'Reply'}
                </button>
              )}

              {/* 수정 버튼 */}
              {canEdit && (
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                  {isKo ? '수정' : 'Edit'}
                </button>
              )}

              {/* 삭제 버튼 */}
              {canDelete && (
                <button
                  type="button"
                  onClick={() => setShowDeleteDialog(true)}
                  className="text-xs text-muted-foreground hover:text-destructive transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  {isKo ? '삭제' : 'Delete'}
                </button>
              )}
            </div>
          )}

          {/* 대댓글 토글 */}
          {!isReply && comment.replies && comment.replies.length > 0 && (
            <button
              type="button"
              onClick={() => setShowReplies(!showReplies)}
              className="mt-2 text-xs text-primary hover:underline flex items-center gap-1"
            >
              {showReplies ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              {isKo
                ? `답글 ${comment.replies.length}개 ${showReplies ? '숨기기' : '보기'}`
                : `${showReplies ? 'Hide' : 'Show'} ${comment.replies.length} ${comment.replies.length === 1 ? 'reply' : 'replies'}`}
            </button>
          )}
        </div>
      </div>

      {/* 답글 작성 폼 */}
      <AnimatePresence>
        {showReplyForm && (
          <CommentForm
            postId={postId}
            parentCommentId={comment.id}
            replyToUser={{ _id: comment.author?.id, nickname: comment.author?.nickname }}
            onSubmit={handleReplySubmit}
            onCancel={() => setShowReplyForm(false)}
            isReply
            locale={locale}
          />
        )}
      </AnimatePresence>

      {/* 대댓글 목록 */}
      <AnimatePresence>
        {!isReply && showReplies && comment.replies && comment.replies.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="space-y-3 mt-3"
          >
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                onDelete={onDelete}
                onUpdate={onUpdate}
                locale={locale}
                isReply
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 삭제 확인 다이얼로그 */}
      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        variant="error"
        title={isKo ? '댓글 삭제' : 'Delete Comment'}
        description={isKo ? '정말 이 댓글을 삭제하시겠습니까?' : 'Are you sure you want to delete this comment?'}
        cancelText={isKo ? '취소' : 'Cancel'}
        confirmText={isKo ? '삭제' : 'Delete'}
        loading={deleting}
        onConfirm={handleDelete}
      />
    </motion.div>
  );
}
