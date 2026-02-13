'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, Loader2, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

/**
 * 댓글 작성 폼
 * @param {Object} props
 * @param {string} props.postId - 게시글 ID
 * @param {string} [props.parentCommentId] - 대댓글인 경우 부모 댓글 ID
 * @param {Object} [props.replyToUser] - 답글 대상 사용자
 * @param {Function} props.onSubmit - 작성 완료 콜백
 * @param {Function} [props.onCancel] - 취소 콜백 (대댓글용)
 * @param {boolean} [props.isReply] - 대댓글 여부
 * @param {string} [props.locale] - 로케일
 * @param {'create' | 'edit'} [props.mode] - 모드
 * @param {string} [props.initialContent] - 초기 내용 (수정 시)
 * @param {string} [props.commentId] - 댓글 ID (수정 시)
 */
export default function CommentForm({
  postId,
  parentCommentId,
  replyToUser,
  onSubmit,
  onCancel,
  isReply = false,
  locale = 'ko',
  mode = 'create',
  initialContent = '',
  commentId,
}) {
  const { data: session } = useSession();
  const isKo = locale === 'ko';

  const [content, setContent] = useState(initialContent);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!session?.user) {
      setError(isKo ? '로그인이 필요합니다.' : 'Please sign in to comment.');
      return;
    }

    const trimmed = content.trim();
    if (!trimmed) {
      setError(isKo ? '내용을 입력해주세요.' : 'Please enter your comment.');
      return;
    }

    if (trimmed.length > 1000) {
      setError(isKo ? '1000자까지 입력할 수 있습니다.' : 'Maximum 1000 characters.');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const url = mode === 'edit' ? `/api/comments/${commentId}` : '/api/comments';
      const method = mode === 'edit' ? 'PATCH' : 'POST';
      const body = mode === 'edit' 
        ? { content: trimmed }
        : { postId, content: trimmed, parentCommentId, replyToUser };

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success) {
        if (mode === 'create') setContent('');
        toast.success(
          mode === 'edit'
            ? (isKo ? '댓글이 수정되었습니다.' : 'Comment updated.')
            : (isKo ? '댓글이 작성되었습니다.' : 'Comment posted.')
        );
        onSubmit?.(data.data, data.pointResult);
      } else {
        toast.error(data.error || (isKo ? '작업에 실패했습니다.' : 'Operation failed.'));
      }
    } catch (err) {
      toast.error(isKo ? '오류가 발생했습니다.' : 'An error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  // 비로그인 상태
  if (!session?.user) {
    return (
      <div className={`p-4 rounded-lg bg-muted/50 text-center ${isReply ? 'ml-12' : ''}`}>
        <p className="text-sm text-muted-foreground">
          {isKo ? '댓글을 작성하려면 로그인이 필요합니다.' : 'Please sign in to comment.'}
        </p>
      </div>
    );
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={isReply ? { opacity: 0, height: 0 } : false}
      animate={isReply ? { opacity: 1, height: 'auto' } : false}
      exit={isReply ? { opacity: 0, height: 0 } : undefined}
      className={isReply ? 'ml-12 mt-3' : ''}
    >
      <div className="space-y-3">
        {/* 답글 대상 표시 */}
        {replyToUser && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>@{replyToUser.nickname}</span>
            {isKo ? '님에게 답글' : 'Replying to'}
          </div>
        )}

        {/* 입력창 */}
        <div className="relative">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder={
              mode === 'edit'
                ? isKo
                  ? '댓글을 수정하세요...'
                  : 'Edit your comment...'
                : isReply
                  ? isKo
                    ? '답글을 입력하세요...'
                    : 'Write a reply...'
                  : isKo
                    ? '댓글을 입력하세요...'
                    : 'Write a comment...'
            }
            className="min-h-[80px] resize-none pr-20"
            maxLength={1000}
            disabled={submitting}
          />

          {/* 글자 수 */}
          <span className="absolute bottom-2 right-14 text-xs text-muted-foreground">
            {content.length}/1000
          </span>
        </div>

        {/* 에러 메시지 */}
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="text-sm text-destructive"
            >
              {error}
            </motion.p>
          )}
        </AnimatePresence>

        {/* 버튼 */}
        <div className="flex items-center justify-end gap-2">
          {((isReply && onCancel) || (mode === 'edit' && onCancel)) && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onCancel}
              disabled={submitting}
            >
              <X className="w-4 h-4 mr-1" />
              {isKo ? '취소' : 'Cancel'}
            </Button>
          )}
          <Button type="submit" size="sm" disabled={submitting || !content.trim()}>
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin mr-1" />
            ) : (
              <Send className="w-4 h-4 mr-1" />
            )}
            {mode === 'edit' ? (isKo ? '수정' : 'Update') : (isKo ? '작성' : 'Post')}
          </Button>
        </div>
      </div>
    </motion.form>
  );
}
