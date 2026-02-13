'use client';

import { useState, useEffect } from 'react';
import {
  MessageSquare,
  Trash2,
  ChevronDown,
  ChevronUp,
  Sparkles,
  Lightbulb,
  Bug,
  HelpCircle,
  Clock,
  Eye,
  Calendar,
  CheckCircle,
  ArrowUpCircle,
  ArrowRightCircle,
  ArrowDownCircle,
  User,
  RotateCcw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { useAdminNotifications } from '@/store/admin-notifications';

const CATEGORY_OPTIONS = [
  { value: 'feature_request', label: '기능 요청', icon: Sparkles, color: 'text-purple-600 bg-purple-100' },
  { value: 'improvement', label: '개선 제안', icon: Lightbulb, color: 'text-yellow-600 bg-yellow-100' },
  { value: 'bug_report', label: '버그 신고', icon: Bug, color: 'text-red-600 bg-red-100' },
  { value: 'other', label: '기타', icon: HelpCircle, color: 'text-gray-600 bg-gray-100' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: '대기', icon: Clock, color: 'text-gray-600 bg-gray-100' },
  { value: 'reviewing', label: '검토 중', icon: Eye, color: 'text-blue-600 bg-blue-100' },
  { value: 'planned', label: '예정', icon: Calendar, color: 'text-purple-600 bg-purple-100' },
  { value: 'completed', label: '완료', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: '낮음', icon: ArrowDownCircle, color: 'text-gray-600 bg-gray-100' },
  { value: 'medium', label: '보통', icon: ArrowRightCircle, color: 'text-yellow-600 bg-yellow-100' },
  { value: 'high', label: '높음', icon: ArrowUpCircle, color: 'text-red-600 bg-red-100' },
];

export default function AdminFeedbackPage() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ byCategory: {}, byStatus: {}, byPriority: {} });
  const [filters, setFilters] = useState({ category: '', status: '', priority: '' });
  const [showTrash, setShowTrash] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null);
  const { fetchNotifications } = useAdminNotifications();

  useEffect(() => {
    fetchFeedbacks();
  }, [filters, showTrash]);

  const fetchFeedbacks = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (showTrash) {
        params.append('status', 'deleted');
      } else {
        if (filters.category) params.append('category', filters.category);
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
      }
      params.append('page', page);

      const res = await fetch(`/api/admin/feedback?${params}`);
      const data = await res.json();

      if (res.ok) {
        setFeedbacks(data.feedbacks);
        setPagination(data.pagination);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Failed to fetch feedbacks:', error);
      toast.error('피드백 목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const updateFeedback = async (id, updates) => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (res.ok) {
        const data = await res.json();
        setFeedbacks((prev) =>
          prev.map((fb) => (fb.id === id ? data.feedback : fb))
        );
        toast.success('업데이트되었습니다.');
        fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to update feedback:', error);
      toast.error('업데이트에 실패했습니다.');
    }
  };

  // 휴지통으로 이동
  const moveToTrash = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget, status: 'deleted' }),
      });

      if (res.ok) {
        setFeedbacks((prev) => prev.filter((fb) => fb.id !== deleteTarget));
        fetchNotifications();
        toast.success('휴지통으로 이동했습니다.');
      }
    } catch (error) {
      console.error('Failed to move to trash:', error);
      toast.error('이동에 실패했습니다.');
    } finally {
      setDeleteTarget(null);
    }
  };

  // 복원
  const restoreFeedback = async (id) => {
    try {
      const res = await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, restore: true }),
      });

      if (res.ok) {
        setFeedbacks((prev) => prev.filter((fb) => fb.id !== id));
        fetchNotifications();
        toast.success('복원되었습니다.');
      }
    } catch (error) {
      console.error('Failed to restore:', error);
      toast.error('복원에 실패했습니다.');
    }
  };

  // 완전 삭제
  const permanentDelete = async () => {
    if (!permanentDeleteTarget) return;

    try {
      const res = await fetch(`/api/admin/feedback?id=${permanentDeleteTarget}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setFeedbacks((prev) => prev.filter((fb) => fb.id !== permanentDeleteTarget));
        toast.error('완전히 삭제되었습니다.');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('삭제에 실패했습니다.');
    } finally {
      setPermanentDeleteTarget(null);
    }
  };

  const toggleExpand = (id) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryBadge = (category) => {
    const option = CATEGORY_OPTIONS.find((o) => o.value === category);
    if (!option) return null;
    const Icon = option.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
        <Icon className="w-3 h-3" />
        {option.label}
      </span>
    );
  };

  const getStatusBadge = (status) => {
    if (status === 'deleted') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-100">
          <Trash2 className="w-3 h-3" />
          휴지통
        </span>
      );
    }
    const option = STATUS_OPTIONS.find((o) => o.value === status);
    if (!option) return null;
    const Icon = option.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
        <Icon className="w-3 h-3" />
        {option.label}
      </span>
    );
  };

  const getPriorityBadge = (priority) => {
    const option = PRIORITY_OPTIONS.find((o) => o.value === priority);
    if (!option) return null;
    const Icon = option.icon;
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${option.color}`}>
        <Icon className="w-3 h-3" />
        {option.label}
      </span>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalPending = (stats.byStatus?.pending || 0) + (stats.byStatus?.reviewing || 0);
  const trashCount = stats.byStatus?.deleted || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">피드백 관리</h1>
          <p className="text-muted-foreground">
            {showTrash ? '휴지통' : (
              <>
                총 {pagination.total}건의 피드백
                {totalPending > 0 && (
                  <span className="ml-2 text-primary">({totalPending}건 처리 대기)</span>
                )}
              </>
            )}
          </p>
        </div>
      </div>

      {/* 통계 카드 - 휴지통 모드에서는 숨김 */}
      {!showTrash && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {CATEGORY_OPTIONS.map((cat) => {
            const Icon = cat.icon;
            const count = stats.byCategory?.[cat.value] || 0;
            return (
              <div
                key={cat.value}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  filters.category === cat.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setFilters((prev) => ({
                  ...prev,
                  category: prev.category === cat.value ? '' : cat.value,
                }))}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${cat.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{cat.label}</span>
                </div>
                <div className="text-2xl font-bold">{count}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* 필터 */}
      <div className="flex flex-wrap gap-2 items-center">
        {!showTrash && (
          <>
            <div className="flex gap-1 items-center mr-4">
              <span className="text-sm text-muted-foreground mr-2">상태:</span>
              <Button
                variant={filters.status === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, status: '' }))}
              >
                전체
              </Button>
              {STATUS_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.status === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters((prev) => ({ ...prev, status: option.value }))}
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <div className="flex gap-1 items-center mr-4">
              <span className="text-sm text-muted-foreground mr-2">우선순위:</span>
              <Button
                variant={filters.priority === '' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilters((prev) => ({ ...prev, priority: '' }))}
              >
                전체
              </Button>
              {PRIORITY_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  variant={filters.priority === option.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters((prev) => ({ ...prev, priority: option.value }))}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </>
        )}
        <div className="w-px bg-border mx-2 h-6" />
        <Button
          variant={showTrash ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => {
            setShowTrash(!showTrash);
            setFilters({ category: '', status: '', priority: '' });
          }}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          휴지통 {trashCount > 0 && `(${trashCount})`}
        </Button>
      </div>

      {/* 피드백 목록 */}
      <div className="rounded-xl border bg-card">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            로딩 중...
          </div>
        ) : feedbacks.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MessageSquare className="w-12 h-12 mx-auto mb-2 opacity-50" />
            {showTrash ? '휴지통이 비어있습니다.' : '피드백이 없습니다.'}
          </div>
        ) : (
          <div className="divide-y">
            {feedbacks.map((fb) => (
              <div key={fb.id} className="p-4">
                {/* 헤더 */}
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleExpand(fb.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {getCategoryBadge(fb.category)}
                      {getStatusBadge(fb.status)}
                      {!showTrash && getPriorityBadge(fb.priority)}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(fb.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-medium truncate">{fb.title}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <User className="w-3 h-3" />
                      {fb.author?.nickname || fb.guestEmail || '게스트'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {expandedId === fb.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* 확장된 내용 */}
                {expandedId === fb.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">내용</p>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
                        {fb.content}
                      </div>
                    </div>

                    {showTrash ? (
                      // 휴지통 모드
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            restoreFeedback(fb.id);
                          }}
                        >
                          <RotateCcw className="w-4 h-4 mr-1" />
                          복원
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            setPermanentDeleteTarget(fb.id);
                          }}
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          완전 삭제
                        </Button>
                      </div>
                    ) : (
                      // 일반 모드
                      <>
                        {/* 상태 변경 */}
                        <div>
                          <p className="text-sm font-medium mb-2">상태 변경</p>
                          <div className="flex flex-wrap gap-2">
                            {STATUS_OPTIONS.map((option) => (
                              <Button
                                key={option.value}
                                variant={fb.status === option.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateFeedback(fb.id, { status: option.value });
                                }}
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* 우선순위 변경 */}
                        <div>
                          <p className="text-sm font-medium mb-2">우선순위 변경</p>
                          <div className="flex gap-2">
                            {PRIORITY_OPTIONS.map((option) => (
                              <Button
                                key={option.value}
                                variant={fb.priority === option.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateFeedback(fb.id, { priority: option.value });
                                }}
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* 휴지통 버튼 */}
                        <div className="flex justify-end">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              setDeleteTarget(fb.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            휴지통
                          </Button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => fetchFeedbacks(pagination.page - 1)}
          >
            이전
          </Button>
          <span className="flex items-center px-3 text-sm">
            {pagination.page} / {pagination.totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === pagination.totalPages}
            onClick={() => fetchFeedbacks(pagination.page + 1)}
          >
            다음
          </Button>
        </div>
      )}

      {/* 휴지통 이동 확인 */}
      <ConfirmDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
        title="휴지통으로 이동"
        description="이 피드백을 휴지통으로 이동하시겠습니까?"
        confirmText="이동"
        cancelText="취소"
        variant="warning"
        onConfirm={moveToTrash}
      />

      {/* 완전 삭제 확인 */}
      <ConfirmDialog
        open={!!permanentDeleteTarget}
        onOpenChange={(open) => !open && setPermanentDeleteTarget(null)}
        title="완전 삭제"
        description="정말 완전히 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다."
        confirmText="완전 삭제"
        cancelText="취소"
        variant="error"
        onConfirm={permanentDelete}
      />
    </div>
  );
}
