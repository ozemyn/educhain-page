'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { LoadingSpinner } from '../../ui/LoadingSpinner';

interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
  todayReviewed: number;
  weeklyReviewed: number;
  monthlyReviewed: number;
  averageReviewTime: number; // 平均审核时间（小时）
  topReviewers: Array<{
    reviewerId: string;
    reviewerName: string;
    reviewCount: number;
  }>;
  categoryStats: Array<{
    categoryName: string;
    total: number;
    approved: number;
    rejected: number;
    approvalRate: number;
  }>;
}

export const ReviewStats: React.FC = () => {
  const [stats, setStats] = useState<ReviewStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'quarter'>('month');

  useEffect(() => {
    fetchStats();
  }, [timeRange]);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.educhain.cc';
      const response = await fetch(`${backendUrl}/api/admin/content/review-stats?range=${timeRange}`, {
        headers: {
          'Content-Type': 'application/json',
          // TODO: 添加认证token
          // 'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('获取审核统计失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-6">
        <div className="flex justify-center py-8">
          <LoadingSpinner />
        </div>
      </GlassCard>
    );
  }

  if (!stats) {
    return (
      <GlassCard className="p-6">
        <div className="text-center text-gray-400 py-8">
          暂无统计数据
        </div>
      </GlassCard>
    );
  }

  const approvalRate = stats.total > 0 ? ((stats.approved / (stats.approved + stats.rejected)) * 100).toFixed(1) : '0';

  return (
    <div className="space-y-6">
      {/* 时间范围选择 */}
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">审核统计</h3>
          <div className="flex space-x-2">
            {[
              { key: 'week', label: '本周' },
              { key: 'month', label: '本月' },
              { key: 'quarter', label: '本季度' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setTimeRange(key as any)}
                className={`px-3 py-1 rounded text-sm transition-all ${
                  timeRange === key
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                    : 'bg-white/5 text-gray-300 hover:bg-white/10'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* 总体统计 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center p-4 bg-white/5 rounded-lg">
            <div className="text-2xl font-bold text-white">{stats.total}</div>
            <div className="text-sm text-gray-400">总内容数</div>
          </div>
          <div className="text-center p-4 bg-yellow-500/10 rounded-lg border border-yellow-400/20">
            <div className="text-2xl font-bold text-yellow-400">{stats.pending}</div>
            <div className="text-sm text-gray-400">待审核</div>
          </div>
          <div className="text-center p-4 bg-green-500/10 rounded-lg border border-green-400/20">
            <div className="text-2xl font-bold text-green-400">{stats.approved}</div>
            <div className="text-sm text-gray-400">已通过</div>
          </div>
          <div className="text-center p-4 bg-red-500/10 rounded-lg border border-red-400/20">
            <div className="text-2xl font-bold text-red-400">{stats.rejected}</div>
            <div className="text-sm text-gray-400">已拒绝</div>
          </div>
        </div>

        {/* 审核效率统计 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="text-center p-4 bg-blue-500/10 rounded-lg border border-blue-400/20">
            <div className="text-xl font-bold text-blue-400">{stats.todayReviewed}</div>
            <div className="text-sm text-gray-400">今日审核</div>
          </div>
          <div className="text-center p-4 bg-purple-500/10 rounded-lg border border-purple-400/20">
            <div className="text-xl font-bold text-purple-400">{approvalRate}%</div>
            <div className="text-sm text-gray-400">通过率</div>
          </div>
          <div className="text-center p-4 bg-indigo-500/10 rounded-lg border border-indigo-400/20">
            <div className="text-xl font-bold text-indigo-400">{stats.averageReviewTime.toFixed(1)}h</div>
            <div className="text-sm text-gray-400">平均审核时间</div>
          </div>
        </div>
      </GlassCard>

      {/* 审核员排行 */}
      <GlassCard className="p-6">
        <h4 className="text-lg font-medium text-white mb-4">审核员排行</h4>
        <div className="space-y-3">
          {stats.topReviewers.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              暂无审核员数据
            </div>
          ) : (
            stats.topReviewers.map((reviewer, index) => (
              <div
                key={reviewer.reviewerId}
                className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                    index === 1 ? 'bg-gray-500/20 text-gray-400' :
                    index === 2 ? 'bg-orange-500/20 text-orange-400' :
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div>
                    <div className="text-white font-medium">{reviewer.reviewerName}</div>
                    <div className="text-gray-400 text-sm">{reviewer.reviewerId}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white font-bold">{reviewer.reviewCount}</div>
                  <div className="text-gray-400 text-sm">次审核</div>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>

      {/* 分类统计 */}
      <GlassCard className="p-6">
        <h4 className="text-lg font-medium text-white mb-4">分类审核统计</h4>
        <div className="space-y-3">
          {stats.categoryStats.length === 0 ? (
            <div className="text-center text-gray-400 py-4">
              暂无分类数据
            </div>
          ) : (
            stats.categoryStats.map((category) => (
              <div
                key={category.categoryName}
                className="p-4 bg-white/5 rounded-lg"
              >
                <div className="flex justify-between items-center mb-2">
                  <h5 className="font-medium text-white">{category.categoryName}</h5>
                  <span className="text-sm text-gray-400">
                    通过率: {category.approvalRate.toFixed(1)}%
                  </span>
                </div>
                
                <div className="grid grid-cols-3 gap-4 text-sm">
                  <div className="text-center">
                    <div className="text-white font-medium">{category.total}</div>
                    <div className="text-gray-400">总数</div>
                  </div>
                  <div className="text-center">
                    <div className="text-green-400 font-medium">{category.approved}</div>
                    <div className="text-gray-400">通过</div>
                  </div>
                  <div className="text-center">
                    <div className="text-red-400 font-medium">{category.rejected}</div>
                    <div className="text-gray-400">拒绝</div>
                  </div>
                </div>
                
                {/* 进度条 */}
                <div className="mt-3 bg-black/20 rounded-full h-2 overflow-hidden">
                  <div className="flex h-full">
                    <div 
                      className="bg-green-400/60"
                      style={{ width: `${(category.approved / category.total) * 100}%` }}
                    />
                    <div 
                      className="bg-red-400/60"
                      style={{ width: `${(category.rejected / category.total) * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </GlassCard>
    </div>
  );
};