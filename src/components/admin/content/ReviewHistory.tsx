'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { LoadingSpinner } from '../../ui/LoadingSpinner';

interface ReviewRecord {
  id: string;
  contentId: string;
  contentTitle: string;
  reviewerId: string;
  reviewerName: string;
  status: 'approved' | 'rejected';
  reason?: string;
  reviewedAt: Date;
}

interface ReviewHistoryProps {
  contentId?: string;
}

export const ReviewHistory: React.FC<ReviewHistoryProps> = ({ contentId }) => {
  const [records, setRecords] = useState<ReviewRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    fetchReviewHistory();
  }, [contentId, page]);

  const fetchReviewHistory = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.educhain.cc';
      const url = contentId 
        ? `${backendUrl}/api/admin/content/${contentId}/review-history?page=${page}`
        : `${backendUrl}/api/admin/content/review-history?page=${page}`;
        
      const response = await fetch(url, {
        headers: {
          'Content-Type': 'application/json',
          // TODO: 添加认证token
          // 'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        if (page === 1) {
          setRecords(data.data.records);
        } else {
          setRecords(prev => [...prev, ...data.data.records]);
        }
        setHasMore(data.data.hasMore);
      }
    } catch (error) {
      console.error('获取审核历史失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prev => prev + 1);
    }
  };

  const getStatusColor = (status: string) => {
    return status === 'approved' ? 'text-green-400' : 'text-red-400';
  };

  const getStatusText = (status: string) => {
    return status === 'approved' ? '通过' : '拒绝';
  };

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h3 className="text-lg font-medium text-white">
          {contentId ? '内容审核历史' : '全部审核历史'}
        </h3>
      </div>

      {loading && records.length === 0 ? (
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      ) : (
        <>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {records.length === 0 ? (
              <div className="text-center text-gray-400 py-8">
                暂无审核历史记录
              </div>
            ) : (
              records.map((record) => (
                <div
                  key={record.id}
                  className="p-4 bg-white/5 rounded-lg border border-white/10"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="flex-1">
                      <h4 className="font-medium text-white mb-1">
                        {record.contentTitle}
                      </h4>
                      <div className="text-sm text-gray-300">
                        审核人: {record.reviewerName} ({record.reviewerId})
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`font-medium ${getStatusColor(record.status)}`}>
                        {getStatusText(record.status)}
                      </span>
                      <div className="text-xs text-gray-400 mt-1">
                        {new Date(record.reviewedAt).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  {record.reason && (
                    <div className="mt-3 p-3 bg-black/20 rounded border-l-2 border-blue-400/50">
                      <div className="text-xs text-gray-400 mb-1">审核意见:</div>
                      <div className="text-sm text-gray-300">{record.reason}</div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* 加载更多 */}
          {hasMore && records.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={loadMore}
                disabled={loading}
                className="px-6 py-2 bg-blue-500/20 text-blue-300 border border-blue-400/50 rounded-lg hover:bg-blue-500/30 transition-all disabled:opacity-50"
              >
                {loading ? <LoadingSpinner size="sm" /> : '加载更多'}
              </button>
            </div>
          )}
        </>
      )}
    </GlassCard>
  );
};