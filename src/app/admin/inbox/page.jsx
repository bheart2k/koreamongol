'use client';

import { useState, useEffect } from 'react';
import {
  Inbox,
  Trash2,
  ChevronDown,
  ChevronUp,
  Clock,
  Eye,
  CheckCircle,
  ArrowUpCircle,
  ArrowRightCircle,
  ArrowDownCircle,
  User,
  ExternalLink,
  Mail,
  Flag,
  MessageCircle,
  RotateCcw,
  Monitor,
  Globe,
  Link2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { useAdminNotifications } from '@/store/admin-notifications';

const TYPE_TABS = [
  { value: '', label: '전체' },
  { value: 'inquiry', label: '문의' },
  { value: 'report', label: '제보' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: '대기', icon: Clock, color: 'text-gray-600 bg-gray-100' },
  { value: 'reviewing', label: '검토 중', icon: Eye, color: 'text-blue-600 bg-blue-100' },
  { value: 'resolved', label: '해결', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: '낮음', icon: ArrowDownCircle, color: 'text-gray-600 bg-gray-100' },
  { value: 'medium', label: '보통', icon: ArrowRightCircle, color: 'text-yellow-600 bg-yellow-100' },
  { value: 'high', label: '높음', icon: ArrowUpCircle, color: 'text-red-600 bg-red-100' },
];

const CATEGORY_LABELS = {
  general: '일반 문의',
  improvement: '개선 제안',
  bug: '버그 신고',
  other: '기타',
};

export default function AdminInboxPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ byType: {}, byStatus: {} });
  const [filters, setFilters] = useState({ type: '', status: '', priority: '' });
  const [showTrash, setShowTrash] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null);
  const [noteValues, setNoteValues] = useState({});
  const { fetchNotifications } = useAdminNotifications();

  useEffect(() => {
    fetchItems();
  }, [filters, showTrash]);

  const fetchItems = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (showTrash) {
        params.append('status', 'deleted');
      } else {
        if (filters.type) params.append('type', filters.type);
        if (filters.status) params.append('status', filters.status);
        if (filters.priority) params.append('priority', filters.priority);
      }
      params.append('page', page);

      const res = await fetch(`/api/admin/inbox?${params}`);
      const data = await res.json();

      if (res.ok) {
        setItems(data.items);
        setPagination(data.pagination);
        setStats(data.stats);
        // 메모 값 초기화
        const notes = {};
        data.items.forEach((item) => { notes[item.id] = item.adminNote || ''; });
        setNoteValues(notes);
      }
    } catch (error) {
      console.error('Failed to fetch inbox:', error);
      toast.error('목록을 불러오는데 실패했습니다.');
    } finally {
      setLoading(false);
    }
  };

  const updateItem = async (id, updates) => {
    try {
      const res = await fetch('/api/admin/inbox', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...updates }),
      });

      if (res.ok) {
        const data = await res.json();
        setItems((prev) =>
          prev.map((item) => (item.id === id ? { ...item, ...data.item } : item))
        );
        toast.success('업데이트되었습니다.');
        fetchNotifications();
      }
    } catch (error) {
      console.error('Failed to update:', error);
      toast.error('업데이트에 실패했습니다.');
    }
  };

  const moveToTrash = async () => {
    if (!deleteTarget) return;
    try {
      const res = await fetch('/api/admin/inbox', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget, status: 'deleted' }),
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== deleteTarget));
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

  const restoreItem = async (id) => {
    try {
      const res = await fetch('/api/admin/inbox', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, restore: true }),
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== id));
        fetchNotifications();
        toast.success('복원되었습니다.');
      }
    } catch (error) {
      console.error('Failed to restore:', error);
      toast.error('복원에 실패했습니다.');
    }
  };

  const permanentDelete = async () => {
    if (!permanentDeleteTarget) return;
    try {
      const res = await fetch(`/api/admin/inbox?id=${permanentDeleteTarget}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setItems((prev) => prev.filter((item) => item.id !== permanentDeleteTarget));
        toast.error('완전히 삭제되었습니다.');
      }
    } catch (error) {
      console.error('Failed to delete:', error);
      toast.error('삭제에 실패했습니다.');
    } finally {
      setPermanentDeleteTarget(null);
    }
  };

  const saveNote = async (id) => {
    await updateItem(id, { adminNote: noteValues[id] || '' });
  };

  const getTypeBadge = (type) => {
    if (type === 'inquiry') {
      return (
        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-blue-600 bg-blue-100">
          <MessageCircle className="w-3 h-3" />
          문의
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium text-orange-600 bg-orange-100">
        <Flag className="w-3 h-3" />
        제보
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
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDisplayEmail = (item) => {
    return item.email || item.user?.email || '';
  };

  const getDisplayName = (item) => {
    return item.user?.nickname || item.email || '게스트';
  };

  const totalPending = (stats.byStatus?.pending || 0) + (stats.byStatus?.reviewing || 0);
  const trashCount = stats.byStatus?.deleted || 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">받은편지함</h1>
          <p className="text-muted-foreground">
            {showTrash ? '휴지통' : (
              <>
                총 {pagination.total}건
                {totalPending > 0 && (
                  <span className="ml-2 text-primary">({totalPending}건 처리 대기)</span>
                )}
              </>
            )}
          </p>
        </div>
      </div>

      {/* 통계 카드 */}
      {!showTrash && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {STATUS_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const cnt = stats.byStatus?.[opt.value] || 0;
            return (
              <div
                key={opt.value}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  filters.status === opt.value ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'
                }`}
                onClick={() => setFilters((prev) => ({
                  ...prev,
                  status: prev.status === opt.value ? '' : opt.value,
                }))}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-8 h-8 rounded-lg ${opt.color} flex items-center justify-center`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">{opt.label}</span>
                </div>
                <div className="text-2xl font-bold">{cnt}</div>
              </div>
            );
          })}
        </div>
      )}

      {/* 탭 + 필터 */}
      <div className="flex flex-wrap gap-2 items-center">
        {!showTrash && (
          <>
            <div className="flex gap-1 items-center mr-4">
              <span className="text-sm text-muted-foreground mr-2">유형:</span>
              {TYPE_TABS.map((tab) => (
                <Button
                  key={tab.value}
                  variant={filters.type === tab.value ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilters((prev) => ({ ...prev, type: tab.value }))}
                >
                  {tab.label}
                  {tab.value && stats.byType?.[tab.value] ? ` (${stats.byType[tab.value]})` : ''}
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
            setFilters({ type: '', status: '', priority: '' });
          }}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          휴지통 {trashCount > 0 && `(${trashCount})`}
        </Button>
      </div>

      {/* 목록 — 카드 스타일 */}
      {loading ? (
        <div className="p-8 text-center text-muted-foreground rounded-xl border bg-card">로딩 중...</div>
      ) : items.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground rounded-xl border bg-card">
          <Inbox className="w-12 h-12 mx-auto mb-2 opacity-50" />
          {showTrash ? '휴지통이 비어있습니다.' : '항목이 없습니다.'}
        </div>
      ) : (
        <div className="space-y-3">
          {items.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                className={`rounded-xl border bg-card transition-all ${
                  isExpanded ? 'border-primary/40 shadow-sm' : 'border-border hover:border-primary/20'
                }`}
              >
                {/* 헤더 (클릭 영역) */}
                <div
                  className="flex items-start justify-between p-4 cursor-pointer"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1.5">
                      {getTypeBadge(item.type)}
                      {getStatusBadge(item.status)}
                      {!showTrash && getPriorityBadge(item.priority)}
                      {item.type === 'inquiry' && item.category && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                          {CATEGORY_LABELS[item.category] || item.category}
                        </span>
                      )}
                    </div>
                    <h3 className="font-medium truncate">{item.subject}</h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        {getDisplayName(item)}
                      </span>
                      <span>{formatDate(item.createdAt)}</span>
                      {item.type === 'report' && item.pageUrl && (
                        <span className="truncate max-w-[200px]">{item.pageUrl}</span>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 mt-1">
                    {isExpanded ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* 확장 영역 */}
                {isExpanded && (
                  <div className="border-t border-border">

                    {/* 섹션 1: 내용 */}
                    <div className="p-4">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">내용</h4>
                      <div className="p-4 bg-blue-50/60 dark:bg-blue-950/15 rounded-lg border border-blue-200/50 dark:border-blue-800/30 text-sm whitespace-pre-wrap leading-relaxed">
                        {item.content}
                      </div>

                      {/* 제보: 페이지 URL */}
                      {item.type === 'report' && item.pageUrl && (
                        <div className="mt-3 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800/30">
                          <p className="text-xs font-semibold text-orange-700 dark:text-orange-400 mb-1">제보 페이지</p>
                          <a
                            href={item.pageUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-primary hover:underline flex items-center gap-1"
                          >
                            {item.pageUrl}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                          {item.sectionTitle && (
                            <p className="text-xs text-muted-foreground mt-1">
                              섹션: {item.sectionTitle} {item.sectionId && `(#${item.sectionId})`}
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    {/* 섹션 2: 발신자 정보 */}
                    <div className="px-4 pb-4">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">발신자 정보</h4>
                      <div className="p-3 bg-amber-50/50 dark:bg-amber-950/10 rounded-lg border border-amber-200/50 dark:border-amber-800/30">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-xs">
                          <div>
                            <span className="text-muted-foreground block">이메일</span>
                            <p className="font-medium">{getDisplayEmail(item) || '-'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">닉네임</span>
                            <p className="font-medium">{item.user?.nickname || '-'}</p>
                          </div>
                          <div>
                            <span className="text-muted-foreground block">유저 ID</span>
                            <p className="font-medium">{item.userId || '비로그인'}</p>
                          </div>
                          {item.screenSize && (
                            <div className="flex items-start gap-1">
                              <Monitor className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground block">화면</span>
                                <p className="font-medium">{item.screenSize}</p>
                              </div>
                            </div>
                          )}
                          {item.language && (
                            <div className="flex items-start gap-1">
                              <Globe className="w-3 h-3 text-muted-foreground mt-0.5 flex-shrink-0" />
                              <div>
                                <span className="text-muted-foreground block">언어</span>
                                <p className="font-medium">{item.language}</p>
                              </div>
                            </div>
                          )}
                          {item.timezone && (
                            <div>
                              <span className="text-muted-foreground block">시간대</span>
                              <p className="font-medium">{item.timezone}</p>
                            </div>
                          )}
                        </div>
                        {(item.currentUrl || item.userAgent) && (
                          <div className="mt-2 pt-2 border-t border-border/30 space-y-1 text-xs">
                            {item.currentUrl && (
                              <div className="flex items-center gap-1">
                                <Link2 className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground">접속:</span>
                                <span className="font-medium truncate">{item.currentUrl}</span>
                              </div>
                            )}
                            {item.userAgent && (
                              <div className="flex items-center gap-1">
                                <Monitor className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                                <span className="text-muted-foreground">UA:</span>
                                <span className="font-medium truncate">{item.userAgent}</span>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* 섹션 3: 관리 (상태/우선순위/메모/액션) */}
                    <div className="px-4 pb-4">
                      <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">관리</h4>
                      <div className="p-4 bg-slate-50/60 dark:bg-slate-900/20 rounded-lg border border-slate-200/50 dark:border-slate-800/30 space-y-4">
                        {showTrash ? (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); restoreItem(item.id); }}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              복원
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => { e.stopPropagation(); setPermanentDeleteTarget(item.id); }}
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              완전 삭제
                            </Button>
                          </div>
                        ) : (
                          <>
                            {/* 상태 + 우선순위 — 한 줄 */}
                            <div className="flex flex-wrap gap-4">
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1.5">상태</p>
                                <div className="flex flex-wrap gap-1.5">
                                  {STATUS_OPTIONS.map((option) => (
                                    <Button
                                      key={option.value}
                                      variant={item.status === option.value ? 'default' : 'outline'}
                                      size="sm"
                                      className="h-7 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateItem(item.id, { status: option.value });
                                      }}
                                    >
                                      {option.label}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                              <div className="w-px bg-border self-stretch" />
                              <div>
                                <p className="text-xs font-medium text-muted-foreground mb-1.5">우선순위</p>
                                <div className="flex gap-1.5">
                                  {PRIORITY_OPTIONS.map((option) => (
                                    <Button
                                      key={option.value}
                                      variant={item.priority === option.value ? 'default' : 'outline'}
                                      size="sm"
                                      className="h-7 text-xs"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        updateItem(item.id, { priority: option.value });
                                      }}
                                    >
                                      {option.label}
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            {/* 관리자 메모 — 항상 Textarea */}
                            <div>
                              <p className="text-xs font-medium text-muted-foreground mb-1.5">관리자 메모</p>
                              <Textarea
                                value={noteValues[item.id] ?? item.adminNote ?? ''}
                                onChange={(e) => setNoteValues((prev) => ({ ...prev, [item.id]: e.target.value }))}
                                rows={3}
                                placeholder="메모를 입력하세요..."
                                onClick={(e) => e.stopPropagation()}
                              />
                              {(noteValues[item.id] ?? '') !== (item.adminNote ?? '') && (
                                <div className="flex gap-2 mt-2">
                                  <Button size="sm" className="h-7 text-xs" onClick={() => saveNote(item.id)}>
                                    저장
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-7 text-xs"
                                    onClick={() => setNoteValues((prev) => ({ ...prev, [item.id]: item.adminNote || '' }))}
                                  >
                                    취소
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* 하단 액션 */}
                            <div className="flex items-center justify-between pt-2 border-t border-border/30">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 text-xs text-muted-foreground hover:text-destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setDeleteTarget(item.id);
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5 mr-1" />
                                휴지통
                              </Button>
                              <div className="flex gap-2">
                                {getDisplayEmail(item) && (
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-7 text-xs"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.location.href = `mailto:${getDisplayEmail(item)}?subject=Re: ${item.subject}`;
                                    }}
                                  >
                                    <Mail className="w-3.5 h-3.5 mr-1" />
                                    답장
                                  </Button>
                                )}
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* 페이지네이션 */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={pagination.page === 1}
            onClick={() => fetchItems(pagination.page - 1)}
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
            onClick={() => fetchItems(pagination.page + 1)}
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
        description="이 항목을 휴지통으로 이동하시겠습니까?"
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
