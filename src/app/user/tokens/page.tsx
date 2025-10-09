'use client';

import { useState, useEffect } from 'react';
import { TokenBalance } from '../../../components/user/tokens/TokenBalance';
import { TokenTransactionHistory } from '../../../components/user/tokens/TokenTransactionHistory';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AuthGuard } from '@/components/auth/AuthGuard';
import { 
  CurrencyDollarIcon,
  ClockIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';

/**
 * 用户端代币查看页面
 * 显示用户的代币余额和交易历史
 */
export default function UserTokensPage() {
  const [activeTab, setActiveTab] = useState<'balance' | 'history' | 'statistics'>('balance');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模拟页面加载
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    {
      key: 'balance' as const,
      name: '代币余额',
      icon: CurrencyDollarIcon,
      description: '查看您的代币余额和详情'
    },
    {
      key: 'history' as const,
      name: '交易历史',
      icon: ClockIcon,
      description: '查看代币获得和使用记录'
    },
    {
      key: 'statistics' as const,
      name: '统计分析',
      icon: ChartBarIcon,
      description: '查看您的代币统计数据'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <AuthGuard>
      <div className="space-y-6">
      {/* 页面标题 */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          我的激励代币
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          查看您的代币余额、交易记录和统计分析
        </p>
      </div>

      {/* 标签页导航 */}
      <GlassCard className="p-1">
        <div className="flex flex-col sm:flex-row gap-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`
                flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg
                transition-all duration-200 text-sm font-medium
                ${activeTab === tab.key
                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 shadow-lg'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-black/10'
                }
              `}
            >
              <tab.icon className="h-4 w-4" />
              <span className="hidden sm:inline">{tab.name}</span>
              <span className="sm:hidden">{tab.name.split('')[0]}</span>
            </button>
          ))}
        </div>
      </GlassCard>

      {/* 标签页内容 */}
      <div className="min-h-[500px]">
        {activeTab === 'balance' && <TokenBalance />}
        {activeTab === 'history' && <TokenTransactionHistory />}
        {activeTab === 'statistics' && (
          <GlassCard className="p-12 text-center">
            <ChartBarIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              统计功能开发中
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              代币统计分析功能即将上线，敬请期待
            </p>
          </GlassCard>
        )}
      </div>
    </div>
    </AuthGuard>
  );
}