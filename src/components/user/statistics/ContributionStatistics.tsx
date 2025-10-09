'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ContributionLeaderboard from '@/components/ui/charts/ContributionLeaderboard';
import TokenBalanceTrends from '@/components/ui/charts/TokenBalanceTrends';
import ContributionTrends from '@/components/ui/charts/ContributionTrends';
import { ChartBarIcon, TrophyIcon, CurrencyDollarIcon, ClockIcon } from '@heroicons/react/24/outline';

interface ContributionStatisticsProps {
  userId?: string; // 如果提供userId，显示特定用户的统计；否则显示全局统计
  className?: string;
}

// API数据类型定义
interface LeaderboardData {
  leaderboard: Array<{
    userId: string;
    username: string;
    avatarUrl?: string;
    totalContributions: number;
    totalValue: number;
    rank: number;
  }>;
  total: number;
}

interface TokenTrendsData {
  trends: Array<{
    date: string;
    balance: number;
    change: number;
  }>;
  summary: {
    currentBalance: number;
    totalEarned: number;
    averageDaily: number;
    growth: number;
  };
}

interface ContributionTrendsData {
  trends: Array<{
    date: string;
    contributions: number;
    value: number;
  }>;
  summary: {
    totalContributions: number;
    totalValue: number;
    averageDaily: number;
    growth: number;
  };
}

/**
 * 用户贡献统计页面组件
 * 
 * 集成多个图表组件，提供完整的贡献统计功能：
 * - 贡献排行榜
 * - 代币余额变化趋势
 * - 贡献趋势分析
 * - 响应式布局和玻璃液态效果
 */
export default function ContributionStatistics({
  userId,
  className = ''
}: ContributionStatisticsProps) {
  const [activeTab, setActiveTab] = useState<'leaderboard' | 'balance' | 'trends'>('leaderboard');
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [loading, setLoading] = useState(false);
  
  // 数据状态
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [tokenTrendsData, setTokenTrendsData] = useState<TokenTrendsData | null>(null);
  const [contributionTrendsData, setContributionTrendsData] = useState<ContributionTrendsData | null>(null);

  // 获取贡献排行榜数据
  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contributions/leaderboard?limit=20&period=${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setLeaderboardData(result.data);
      }
    } catch (error) {
      console.error('获取排行榜数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取代币余额趋势数据
  const fetchTokenTrendsData = async () => {
    if (!userId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tokens/balance-trends/${userId}?period=${period}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setTokenTrendsData(result.data);
      }
    } catch (error) {
      console.error('获取代币趋势数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 获取贡献趋势数据
  const fetchContributionTrendsData = async () => {
    try {
      setLoading(true);
      const url = userId 
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/contributions/trends?userId=${userId}&period=${period}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/contributions/trends?period=${period}`;
        
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const result = await response.json();
        setContributionTrendsData(result.data);
      }
    } catch (error) {
      console.error('获取贡献趋势数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  // 根据活跃标签页加载对应数据
  useEffect(() => {
    switch (activeTab) {
      case 'leaderboard':
        fetchLeaderboardData();
        break;
      case 'balance':
        if (userId) {
          fetchTokenTrendsData();
        }
        break;
      case 'trends':
        fetchContributionTrendsData();
        break;
    }
  }, [activeTab, period, userId]);

  // 标签页配置
  const tabs = [
    {
      key: 'leaderboard' as const,
      label: '贡献排行榜',
      icon: TrophyIcon,
      description: '查看社区贡献者排行'
    },
    ...(userId ? [{
      key: 'balance' as const,
      label: '代币余额趋势',
      icon: CurrencyDollarIcon,
      description: '查看代币余额变化'
    }] : []),
    {
      key: 'trends' as const,
      label: '贡献趋势',
      icon: ChartBarIcon,
      description: userId ? '查看个人贡献趋势' : '查看整体贡献趋势'
    }
  ];

  // 周期选择器配置
  const periods = [
    { key: 'week' as const, label: '最近一周' },
    { key: 'month' as const, label: '最近一月' },
    { key: 'quarter' as const, label: '最近三月' },
    { key: 'year' as const, label: '最近一年' }
  ];

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          {userId ? '个人贡献统计' : '社区贡献统计'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          {userId ? '查看您的贡献记录和代币收益' : '查看社区整体贡献情况和排行榜'}
        </p>
      </div>

      {/* 标签页导航 */}
      <div className="flex flex-wrap justify-center gap-2 p-1 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`
              flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
              ${activeTab === tab.key
                ? 'bg-blue-500 text-white shadow-lg'
                : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-700/10'
              }
            `}
          >
            <tab.icon className="w-5 h-5" />
            <span className="font-medium">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* 周期选择器 */}
      <div className="flex justify-center">
        <div className="flex gap-2 p-1 rounded-lg bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
          {periods.map((periodOption) => (
            <button
              key={periodOption.key}
              onClick={() => setPeriod(periodOption.key)}
              className={`
                flex items-center gap-1 px-3 py-1.5 rounded-md text-sm transition-all duration-200
                ${period === periodOption.key
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-700/10'
                }
              `}
            >
              <ClockIcon className="w-4 h-4" />
              {periodOption.label}
            </button>
          ))}
        </div>
      </div>

      {/* 图表内容区域 */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        {activeTab === 'leaderboard' && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                贡献值排行榜
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                展示社区中贡献值最高的用户
              </p>
            </div>
            <ContributionLeaderboard
              data={leaderboardData?.leaderboard || []}
              loading={loading}
              height="500px"
            />
          </div>
        )}

        {activeTab === 'balance' && userId && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                代币余额变化趋势
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                查看您的代币余额随时间的变化情况
              </p>
            </div>
            <TokenBalanceTrends
              data={tokenTrendsData || { trends: [], summary: { currentBalance: 0, totalEarned: 0, averageDaily: 0, growth: 0 } }}
              loading={loading}
              height="500px"
              period={period}
            />
          </div>
        )}

        {activeTab === 'trends' && (
          <div className="space-y-4">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {userId ? '个人贡献趋势' : '社区贡献趋势'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400">
                {userId ? '查看您的贡献活动趋势' : '查看社区整体贡献活动趋势'}
              </p>
            </div>
            <ContributionTrends
              data={contributionTrendsData || { trends: [], summary: { totalContributions: 0, totalValue: 0, averageDaily: 0, growth: 0 } }}
              loading={loading}
              height="500px"
              period={period}
            />
          </div>
        )}
      </motion.div>

      {/* 数据说明 */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400 space-y-1">
        <p>数据每小时更新一次，显示的是已确认的贡献记录</p>
        <p>贡献值基于内容质量、社区互动等多个维度综合计算</p>
      </div>
    </div>
  );
}