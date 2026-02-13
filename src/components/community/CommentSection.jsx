'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, Loader2 } from 'lucide-react';
import CommentForm from './CommentForm';
import CommentItem from './CommentItem';
import { useComments } from '@/lib/swr/hooks';

/**
 * 댓글 섹션 전체
 * @param {Object} props
 * @param {string} props.postId - 게시글 ID
 * @param {number} props.initialCount - 초기 댓글 수
 * @param {string} [props.locale] - 로케일
 * @param {Function} [props.onCountChange] - 댓글 수 변경 콜백
 */
export default function CommentSection({ postId, initialCount = 0, locale = 'ko', onCountChange }) {
  const isKo = locale === 'ko';

  const [commentCount, setCommentCount] = useState(initialCount);

  // SWR로 댓글 목록 조회
  const { comments, isLoading, error, mutate } = useComments(postId);

  // 댓글 수 변경 시 부모에게 알림
  const updateCount = (newCount) => {
    setCommentCount(newCount);
    onCountChange?.(newCount);
  };

  // 새 댓글 작성 완료
  const handleNewComment = (newComment, pointResult) => {
    // SWR 캐시 업데이트 (낙관적 업데이트)
    mutate(
      (prev) => {
        if (!prev?.data) return prev;
        return {
          ...prev,
          data: [...prev.data, { ...newComment, replies: [] }],
        };
      },
      false // revalidate 하지 않음
    );
    updateCount(commentCount + 1);
  };

  // 대댓글 작성 완료
  const handleReplySubmit = (newReply, parentId, pointResult) => {
    mutate(
      (prev) => {
        if (!prev?.data) return prev;
        return {
          ...prev,
          data: prev.data.map((comment) => {
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), newReply],
                replyCount: (comment.replyCount || 0) + 1,
              };
            }
            return comment;
          }),
        };
      },
      false
    );
    updateCount(commentCount + 1);
  };

  // 댓글 수정 완료
  const handleUpdate = (updatedComment, parentId) => {
    mutate(
      (prev) => {
        if (!prev?.data) return prev;
        return {
          ...prev,
          data: prev.data.map((comment) => {
            // 부모 댓글 수정
            if (comment.id === updatedComment.id) {
              return { ...comment, content: updatedComment.content };
            }
            // 대댓글 수정
            if (comment.id === parentId) {
              return {
                ...comment,
                replies: comment.replies.map((reply) =>
                  reply.id === updatedComment.id
                    ? { ...reply, content: updatedComment.content }
                    : reply
                ),
              };
            }
            return comment;
          }),
        };
      },
      false
    );
  };

  // 댓글 삭제
  const handleDelete = (commentId, parentId) => {
    if (parentId) {
      // 대댓글 삭제
      mutate(
        (prev) => {
          if (!prev?.data) return prev;
          return {
            ...prev,
            data: prev.data.map((comment) => {
              if (comment.id === parentId) {
                return {
                  ...comment,
                  replies: comment.replies?.filter((r) => r.id !== commentId) || [],
                  replyCount: Math.max(0, (comment.replyCount || 1) - 1),
                };
              }
              return comment;
            }),
          };
        },
        false
      );
      updateCount(Math.max(0, commentCount - 1));
    } else {
      // 부모 댓글 삭제 (대댓글도 함께 삭제됨)
      const deletedComment = comments.find((c) => c.id === commentId);
      const deletedRepliesCount = deletedComment?.replies?.length || 0;
      mutate(
        (prev) => {
          if (!prev?.data) return prev;
          return {
            ...prev,
            data: prev.data.filter((c) => c.id !== commentId),
          };
        },
        false
      );
      updateCount(Math.max(0, commentCount - 1 - deletedRepliesCount));
    }
  };

  return (
    <section className="mt-8 pt-8 border-t border-border">
      {/* 헤더 */}
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare className="w-5 h-5" />
        <h2 className="text-title font-semibold">
          {isKo ? '댓글' : 'Comments'}
        </h2>
        <span className="text-muted-foreground">({commentCount})</span>
      </div>

      {/* 댓글 작성 폼 */}
      <div className="mb-6">
        <CommentForm postId={postId} onSubmit={handleNewComment} locale={locale} />
      </div>

      {/* 로딩 */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* 에러 */}
      {error && !isLoading && (
        <div className="text-center py-8 text-muted-foreground">
          <p>{error}</p>
        </div>
      )}

      {/* 댓글 없음 */}
      {!isLoading && !error && comments.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <MessageSquare className="w-10 h-10 mx-auto mb-2 opacity-30" />
          <p>{isKo ? '첫 댓글을 남겨보세요!' : 'Be the first to comment!'}</p>
        </div>
      )}

      {/* 댓글 목록 */}
      {!isLoading && !error && comments.length > 0 && (
        <motion.div className="space-y-6">
          <AnimatePresence mode="popLayout">
            {comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                onReplySubmit={handleReplySubmit}
                onDelete={handleDelete}
                onUpdate={handleUpdate}
                locale={locale}
              />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </section>
  );
}
