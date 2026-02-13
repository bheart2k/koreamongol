'use client';

import { useState, useEffect } from 'react';
import { Mail, Clock, CheckCircle, MessageCircle, Trash2, ChevronDown, ChevronUp, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { toast } from 'sonner';
import { useAdminNotifications } from '@/store/admin-notifications';

const STATUS_OPTIONS = [
  { value: 'pending', label: '대기', icon: Clock, color: 'text-yellow-600 bg-yellow-100' },
  { value: 'read', label: '확인', icon: Mail, color: 'text-blue-600 bg-blue-100' },
  { value: 'replied', label: '답변완료', icon: CheckCircle, color: 'text-green-600 bg-green-100' },
];

export default function AdminContactsPage() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  const [showTrash, setShowTrash] = useState(false);
  const [expandedId, setExpandedId] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [permanentDeleteTarget, setPermanentDeleteTarget] = useState(null);
  const { fetchNotifications } = useAdminNotifications();

  useEffect(() => {
    fetchMessages();
  }, [filter, showTrash]);

  const fetchMessages = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (showTrash) {
        params.append('status', 'deleted');
      } else if (filter) {
        params.append('status', filter);
      }
      params.append('page', page);

      const res = await fetch(`/api/admin/contacts?${params}`);
      const data = await res.json();

      if (res.ok) {
        setMessages(data.messages);
        setPagination(data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status: newStatus }),
      });

      if (res.ok) {
        setMessages((prev) =>
          prev.map((msg) => (msg.id === id ? { ...msg, status: newStatus } : msg))
        );
        fetchNotifications();
        toast.success('상태가 변경되었습니다.');
      }
    } catch (error) {
      console.error('Failed to update status:', error);
      toast.error('상태 변경에 실패했습니다.');
    }
  };

  // 휴지통으로 이동
  const moveToTrash = async () => {
    if (!deleteTarget) return;

    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: deleteTarget, status: 'deleted' }),
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== deleteTarget));
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
  const restoreMessage = async (id) => {
    try {
      const res = await fetch('/api/admin/contacts', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, restore: true }),
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== id));
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
      const res = await fetch(`/api/admin/contacts?id=${permanentDeleteTarget}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMessages((prev) => prev.filter((msg) => msg.id !== permanentDeleteTarget));
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">문의 관리</h1>
          <p className="text-muted-foreground">
            {showTrash ? '휴지통' : `총 ${pagination.total}건의 문의`}
          </p>
        </div>
      </div>

      {/* 필터 */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={!showTrash && filter === '' ? 'default' : 'outline'}
          size="sm"
          onClick={() => { setShowTrash(false); setFilter(''); }}
        >
          전체
        </Button>
        {STATUS_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={!showTrash && filter === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => { setShowTrash(false); setFilter(option.value); }}
          >
            {option.label}
          </Button>
        ))}
        <div className="w-px bg-border mx-2" />
        <Button
          variant={showTrash ? 'destructive' : 'outline'}
          size="sm"
          onClick={() => { setShowTrash(true); setFilter(''); }}
        >
          <Trash2 className="w-4 h-4 mr-1" />
          휴지통
        </Button>
      </div>

      {/* 메시지 목록 */}
      <div className="rounded-xl border bg-card">
        {loading ? (
          <div className="p-8 text-center text-muted-foreground">
            로딩 중...
          </div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground">
            <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-50" />
            {showTrash ? '휴지통이 비어있습니다.' : '문의가 없습니다.'}
          </div>
        ) : (
          <div className="divide-y">
            {messages.map((msg) => (
              <div key={msg.id} className="p-4">
                {/* 헤더 */}
                <div
                  className="flex items-start justify-between cursor-pointer"
                  onClick={() => toggleExpand(msg.id)}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {getStatusBadge(msg.status)}
                      <span className="text-xs text-muted-foreground">
                        {formatDate(msg.createdAt)}
                      </span>
                    </div>
                    <h3 className="font-medium truncate">{msg.subject}</h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {msg.name || '익명'} &lt;{msg.email}&gt;
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {expandedId === msg.id ? (
                      <ChevronUp className="w-5 h-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                </div>

                {/* 확장된 내용 */}
                {expandedId === msg.id && (
                  <div className="mt-4 pt-4 border-t space-y-4">
                    <div>
                      <p className="text-sm font-medium mb-1">내용</p>
                      <div className="p-3 bg-muted/50 rounded-lg text-sm whitespace-pre-wrap">
                        {msg.message}
                      </div>
                    </div>

                    {/* 액션 버튼 */}
                    <div className="flex items-center justify-between">
                      {showTrash ? (
                        // 휴지통 모드
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              restoreMessage(msg.id);
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
                              setPermanentDeleteTarget(msg.id);
                            }}
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            완전 삭제
                          </Button>
                        </div>
                      ) : (
                        // 일반 모드
                        <>
                          <div className="flex gap-2">
                            {STATUS_OPTIONS.map((option) => (
                              <Button
                                key={option.value}
                                variant={msg.status === option.value ? 'default' : 'outline'}
                                size="sm"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  updateStatus(msg.id, option.value);
                                }}
                              >
                                {option.label}
                              </Button>
                            ))}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                window.location.href = `mailto:${msg.email}?subject=Re: ${msg.subject}`;
                              }}
                            >
                              <Mail className="w-4 h-4 mr-1" />
                              답장
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                setDeleteTarget(msg.id);
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </>
                      )}
                    </div>
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
            onClick={() => fetchMessages(pagination.page - 1)}
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
            onClick={() => fetchMessages(pagination.page + 1)}
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
        description="이 문의를 휴지통으로 이동하시겠습니까?"
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
