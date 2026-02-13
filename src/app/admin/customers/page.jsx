'use client';

import { useEffect, useState } from 'react';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await fetch('/api/admin/customers');
      if (!res.ok) throw new Error('Failed to fetch');
      const data = await res.json();
      setCustomers(data.customers || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">고객 관리</h1>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-muted-foreground">로딩 중...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">고객 관리</h1>
        <div className="rounded-xl border bg-card p-6">
          <p className="text-red-500">오류: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">고객 관리</h1>
        <p className="text-muted-foreground">총 {customers.length}명</p>
      </div>

      <div className="rounded-xl border bg-card overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted/50">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-medium">이름</th>
              <th className="px-4 py-3 text-left text-sm font-medium">이메일</th>
              <th className="px-4 py-3 text-left text-sm font-medium">등급</th>
              <th className="px-4 py-3 text-left text-sm font-medium">가입일</th>
              <th className="px-4 py-3 text-left text-sm font-medium">최근 로그인</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {customers.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  등록된 회원이 없습니다.
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id} className="hover:bg-muted/50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      {customer.image ? (
                        <img
                          src={customer.image}
                          alt={customer.name}
                          className="size-8 rounded-full"
                        />
                      ) : (
                        <div className="size-8 rounded-full bg-muted flex items-center justify-center text-xs">
                          {customer.name?.charAt(0)}
                        </div>
                      )}
                      <span className="font-medium">{customer.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {customer.email}
                  </td>
                  <td className="px-4 py-3">
                    <GradeBadge grade={customer.grade} />
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(customer.createdAt)}
                  </td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {formatDate(customer.lastLoginAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function GradeBadge({ grade }) {
  let label = '일반';
  let className = 'bg-gray-100 text-gray-800';

  if (grade <= 10) {
    label = '개발자';
    className = 'bg-purple-100 text-purple-800';
  } else if (grade <= 20) {
    label = '관리자';
    className = 'bg-blue-100 text-blue-800';
  }

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${className}`}>
      {label}
    </span>
  );
}

function formatDate(dateString) {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}
