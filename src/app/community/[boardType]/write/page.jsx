'use client';

import { useState, useEffect, use } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';

import { useSession } from 'next-auth/react';
import { motion } from 'motion/react';
import {
  ChevronLeft,
  Save,
  X,
  Loader2,
  AlertTriangle,
  LogIn
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import LexicalEditor from '@/components/editor/LexicalEditor';
import { v4 as uuidv4 } from 'uuid';

const boardTitles = {
  blog: { ko: '한글 블로그', en: 'Hangul Blog' },
  free: { ko: '자유게시판', en: 'Free Board' },
  notice: { ko: '공지 & FAQ', en: 'Notice & FAQ' },
};

export default function WritePostPage({ params }) {
  const { boardType } = use(params);
  const locale = 'ko';
  const isKo = locale === 'ko';
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get('edit');
  const { data: session, status } = useSession();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingPost, setLoadingPost] = useState(!!editId);
  const [error, setError] = useState('');
  const [sessionId] = useState(() => uuidv4());

  const isEdit = !!editId;
  const boardTitle = boardTitles[boardType];

  // 수정 모드: 기존 게시글 로드
  useEffect(() => {
    if (!editId) return;

    const fetchPost = async () => {
      setLoadingPost(true);
      try {
        const res = await fetch(`/api/posts/${editId}`);
        const data = await res.json();

        if (data.success) {
          setTitle(data.data.title);
          setContent(data.data.content);
          setTags(data.data.tags?.join(', ') || '');
        } else {
          setError(data.error);
        }
      } catch (err) {
        setError('게시글을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setLoadingPost(false);
      }
    };

    fetchPost();
  }, [editId]);

  // 로그인 체크
  if (status === 'loading') {
    return (
      <main className="min-h-content bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-content bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
            <LogIn className="w-8 h-8 text-muted-foreground" />
          </div>
          <h1 className="text-headline mb-2">
            {isKo ? '로그인이 필요합니다' : 'Login Required'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isKo
              ? '글을 작성하려면 먼저 로그인해주세요.'
              : 'Please log in to write a post.'}
          </p>
          <Button asChild>
            <Link href={`/${locale}/community/${boardType}`}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              {isKo ? '돌아가기' : 'Go Back'}
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  // notice 게시판 권한 체크 (grade 20 이하만 관리자)
  const isAdminUser = session.user.grade && session.user.grade <= 20;
  if (boardType === 'notice' && !isAdminUser) {
    return (
      <main className="min-h-content bg-background flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-destructive" />
          </div>
          <h1 className="text-headline mb-2">
            {isKo ? '권한이 없습니다' : 'Access Denied'}
          </h1>
          <p className="text-muted-foreground mb-6">
            {isKo
              ? '공지사항은 관리자만 작성할 수 있습니다.'
              : 'Only administrators can write announcements.'}
          </p>
          <Button asChild>
            <Link href={`/${locale}/community/${boardType}`}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              {isKo ? '돌아가기' : 'Go Back'}
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  // 유효하지 않은 게시판 타입
  if (!boardTitle) {
    return (
      <main className="min-h-content bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-headline mb-4">404</h1>
          <p className="text-muted-foreground mb-6">
            {isKo ? '존재하지 않는 게시판입니다.' : 'Board not found.'}
          </p>
          <Button asChild>
            <Link href={`/${locale}/community`}>
              {isKo ? '커뮤니티로 돌아가기' : 'Back to Community'}
            </Link>
          </Button>
        </div>
      </main>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim()) {
      setError(isKo ? '제목을 입력해주세요.' : 'Please enter a title.');
      return;
    }

    if (!content || content === '{}' || content === '{"root":{"children":[],"direction":null,"format":"","indent":0,"type":"root","version":1}}') {
      setError(isKo ? '내용을 입력해주세요.' : 'Please enter content.');
      return;
    }

    setLoading(true);

    try {
      const tagList = tags
        .split(',')
        .map((t) => t.trim())
        .filter((t) => t.length > 0);

      const body = {
        boardType,
        title: title.trim(),
        content,
        tags: tagList,
        sessionId,
      };

      const res = await fetch(
        isEdit ? `/api/posts/${editId}` : '/api/posts',
        {
          method: isEdit ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      );

      const data = await res.json();

      if (data.success) {
        const postId = isEdit ? editId : data.data.id;
        router.push(`/${locale}/community/${boardType}/${postId}`);
      } else {
        setError(data.error || (isKo ? '저장에 실패했습니다.' : 'Failed to save.'));
      }
    } catch (err) {
      setError(isKo ? '저장 중 오류가 발생했습니다.' : 'An error occurred while saving.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditorError = (message) => {
    setError(message);
  };

  if (loadingPost) {
    return (
      <main className="min-h-content bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </main>
    );
  }

  return (
    <main className="min-h-content bg-background">
      {/* Header */}
      <section className="py-4 px-6 border-b border-border">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link
                href={`/${locale}/community/${boardType}`}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="w-5 h-5" />
              </Link>
              <h1 className="text-title font-semibold">
                {isEdit
                  ? isKo
                    ? '글 수정'
                    : 'Edit Post'
                  : isKo
                  ? '글 작성'
                  : 'Write Post'}
              </h1>
              <span className="text-sm text-muted-foreground">
                · {isKo ? boardTitle.ko : boardTitle.en}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Form */}
      <section className="pt-6">
        <div className="max-w-4xl mx-auto">
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Error */}
            {error && (
              <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {error}
              </div>
            )}

            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title">
                {isKo ? '제목' : 'Title'} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={isKo ? '제목을 입력하세요' : 'Enter title'}
                maxLength={100}
                className="text-lg"
              />
            </div>

            {/* Content */}
            <div className="space-y-2">
              <Label>
                {isKo ? '내용' : 'Content'} <span className="text-destructive">*</span>
              </Label>
              <LexicalEditor
                value={content}
                onChange={setContent}
                placeholder={isKo ? '내용을 입력하세요' : 'Enter content'}
                minHeight={500}
                maxHeight={670}
                onError={handleEditorError}
                maxImages={10}
                boardType={boardType}
                sessionId={sessionId}
              />
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">
                {isKo ? '태그' : 'Tags'}
                <span className="text-muted-foreground font-normal ml-2">
                  ({isKo ? '쉼표로 구분' : 'comma separated'})
                </span>
              </Label>
              <Input
                id="tags"
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder={isKo ? '한글, 학습, 팁' : 'hangul, learning, tips'}
              />
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.back()}
                disabled={loading}
              >
                <X className="w-4 h-4 mr-2" />
                {isKo ? '취소' : 'Cancel'}
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Save className="w-4 h-4 mr-2" />
                )}
                {isEdit
                  ? isKo
                    ? '수정하기'
                    : 'Update'
                  : isKo
                  ? '작성하기'
                  : 'Publish'}
              </Button>
            </div>
          </motion.form>
        </div>
      </section>
    </main>
  );
}
