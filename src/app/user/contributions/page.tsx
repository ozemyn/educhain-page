'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { AuthGuard } from '@/components/auth/AuthGuard';
import {
  ChartBarIcon,
  DocumentTextIcon,
  EyeIcon,
  CheckCircleIcon,
  ClockIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

export default function UserContributionsPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [contributions, setContributions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    all: 0,
    content_create: 0,
    content_review: 0,
    community_help: 0
  });

  const filters = [
    { id: 'all', name: '全部', count: stats.all },
    { id: 'content_create', name: '内容创建', count: stats.content_create },
    { id: 'content_review', name: '内容审核', count: stats.content_review },
    { id: 'community_help', name: '社区互助', count: stats.community_help },
  ];

  // 获取贡献记录
  useEffect(() => {
    const fetchContributions = async () => {
      try {
        setLoading(true);
        const userData = localStorage.getItem('user');
        if (!userData) return;
        
        const user = JSON.parse(userData);
        const token = localStorage.getItem('token');

        const params = new URLSearchParams({
          userId: user.id,
          page: '1',
          limit: '50'
        });

        if (activeFilter !== 'all') {
          params.append('contributionType', activeFilter);
        }

        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contributions?${params}`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            setContributions(result.data.contributions);
            
            // 获取统计信息
            const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contributions/stats?userId=${user.id}`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            });
            
            if (statsResponse.ok) {
              const statsResult = await statsResponse.json();
              if (statsResult.success && statsResult.data) {
                setStats({
                  all: statsResult.data.totalContributions,
                  content_create: statsResult.data.contributionsByType?.content_create || 0,
                  content_review: statsResult.data.contributionsByType?.content_review || 0,
                  community_help: statsResult.data.contributionsByType?.community_help || 0
                });
              }
            }
          }
        }
      } catch (error) {
        console.error('获取贡献记录失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContributions();
  }, [activeFilter]);

  // 使用真实数据
  const filteredContributions = contributions.filter(contribution => 
    activeFilter === 'all' || contribution.type === activeFilter
  );

  const sortedContributions = [...filteredContributions].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    } else if (sortBy === 'value') {
      return b.value - a.value;
    }
    return 0;
  });

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'content_create':
        return DocumentTextIcon;
      case 'content_review':
        return EyeIcon;
      case 'community_help':
        return TrophyIcon;
      default:
        return ChartBarIcon;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'content_create':
        return 'text-blue-500';
      case 'content_review':
        return 'text-green-500';
      case 'community_help':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const getTypeBgColor = (type: string) => {
    switch (type) {
      case 'content_create':
        return 'bg-blue-500/10';
      case 'content_review':
        return 'bg-green-500/10';
      case 'community_help':
        return 'bg-purple-500/10';
      default:
        return 'bg-gray-500/10';
    }
  };

  return (
    <AuthGuard>
      <div className="space-y-6">
      {/* 页面标题和统计 */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
            <ChartBarIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              我的贡献记录
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              查看您在社区中的所有贡献活动
            </p>
          </div>
        </div>

        {/* 总体统计 */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">25</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">总贡献</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">180</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">贡献值</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">12</p>
            <p className="text-xs text-gray-600 dark:text-gray-400">本月</p>
          </div>
        </div>
      </div>

      {/* 筛选和排序 */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
          {/* 类型筛选 */}
          <div className="flex flex-wrap gap-2">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => setActiveFilter(filter.id)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  activeFilter === filter.id
                    ? 'bg-blue-500 text-white'
                    : 'glass-button text-gray-700 dark:text-gray-300'
                }`}
              >
                {filter.name}
                <span className="ml-2 text-xs opacity-75">({filter.count})</span>
              </button>
            ))}
          </div>

          {/* 排序选择 */}
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">排序：</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="glass-select text-sm"
            >
              <option value="date">按时间</option>
              <option value="value">按贡献值</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* 贡献记录列表 */}
      <div className="space-y-4">
        {sortedContributions.map((contribution) => {
          const TypeIcon = getTypeIcon(contribution.type);
          const typeColor = getTypeColor(contribution.type);
          const typeBgColor = getTypeBgColor(contribution.type);

          return (
            <GlassCard key={contribution.id} className="p-6 hover:bg-white/15 dark:hover:bg-black/15 transition-all">
              <div className="flex items-start space-x-4">
                {/* 类型图标 */}
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${typeBgColor}`}>
                  <TypeIcon className={`h-6 w-6 ${typeColor}`} />
                </div>

                {/* 主要内容 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-1">
                        {contribution.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                        {contribution.description}
                      </p>

                      {/* 详细信息 */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <span className="font-medium">贡献值:</span>
                          <span className="text-green-600 dark:text-green-400 font-bold">
                            +{contribution.value}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="h-4 w-4" />
                          <span>{formatDate(contribution.date)}</span>
                        </div>
                        {contribution.views && (
                          <div className="flex items-center space-x-1">
                            <EyeIcon className="h-4 w-4" />
                            <span>{contribution.views} 浏览</span>
                          </div>
                        )}
                        {contribution.likes && (
                          <div className="flex items-center space-x-1">
                            <span>❤️</span>
                            <span>{contribution.likes} 点赞</span>
                          </div>
                        )}
                      </div>

                      {/* 区块链信息 */}
                      {contribution.status === 'confirmed' && contribution.blockHeight && (
                        <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                          <div className="flex items-center space-x-2 text-sm">
                            <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                            <span className="text-green-800 dark:text-green-200 font-medium">
                              已上链确认
                            </span>
                          </div>
                          <div className="mt-2 text-xs text-green-700 dark:text-green-300 space-y-1">
                            <div>区块高度: #{contribution.blockHeight}</div>
                            <div className="font-mono">
                              交易哈希: {contribution.transactionHash}
                            </div>
                          </div>
                        </div>
                      )}

                      {contribution.status === 'pending' && (
                        <div className="mt-3 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                          <div className="flex items-center space-x-2 text-sm">
                            <ClockIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            <span className="text-yellow-800 dark:text-yellow-200 font-medium">
                              等待上链确认
                            </span>
                          </div>
                          <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                            贡献记录正在等待区块链网络确认
                          </p>
                        </div>
                      )}
                    </div>

                    {/* 状态标识 */}
                    <div className="flex-shrink-0 ml-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                        contribution.status === 'confirmed'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {contribution.status === 'confirmed' ? '已确认' : '待确认'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* 加载更多 */}
      <div className="text-center">
        <button className="glass-button px-6 py-3 text-gray-800 dark:text-white">
          加载更多记录
        </button>
      </div>
    </div>
    </AuthGuard>
  );
}