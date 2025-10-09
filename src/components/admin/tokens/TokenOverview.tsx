'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Token } from '@/types/token';
import { 
  CurrencyDollarIcon, 
  UsersIcon, 
  ArrowTrendingUpIcon,
  ClockIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline';

interface TokenOverviewProps {
  tokens: Token[];
  onDistributeToken: (token: Token) => void;
}

interface OverviewStats {
  totalTokens: number;
  totalSupply: number;
  totalDistributed: number;
  activeTokens: number;
  recentDistributions: number;
}

/**
 * 代币概览组件
 * 显示代币系统的整体统计信息和快速操作
 */
export function TokenOverview({ tokens, onDistributeToken }: TokenOverviewProps) {
  const [stats, setStats] = useState<OverviewStats | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * 计算概览统计数据
   */
  const calculateStats = async () => {
    try {
      setLoading(true);
      
      // 基础统计
      const totalTokens = tokens.length;
      const activeTokens = tokens.filter(token => token.status === 'active').length;
      const totalSupply = tokens.reduce((sum, token) => sum + token.totalSupply, 0);
      const totalDistributed = tokens.reduce((sum, token) => sum + token.distributedSupply, 0);
      
      // 获取最近分发数据
      let recentDistributions = 0;
      try {
        const token = localStorage.getItem('adminToken');
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tokens/distributions/recent?limit=100&days=7`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (response.ok) {
          const result = await response.json();
          if (result.success && result.data) {
            recentDistributions = result.data.length || 0;
          }
        }
      } catch (error) {
        console.error('获取最近分发数据失败:', error);
      }
      
      setStats({
        totalTokens,
        totalSupply,
        totalDistributed,
        activeTokens,
        recentDistributions
      });
      
    } catch (error) {
      console.error('计算统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    calculateStats();
  }, [tokens]);

  if (loading || !stats) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const statCards = [
    {
      title: '代币总数',
      value: stats.totalTokens,
      icon: CurrencyDollarIcon,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-500/10',
      description: `${stats.activeTokens} 个活跃`
    },
    {
      title: '总供应量',
      value: stats.totalSupply.toLocaleString(),
      icon: ArrowTrendingUpIcon,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-500/10',
      description: '所有代币总量'
    },
    {
      title: '已分发量',
      value: stats.totalDistributed.toLocaleString(),
      icon: UsersIcon,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-500/10',
      description: `${((stats.totalDistributed / stats.totalSupply) * 100).toFixed(1)}% 分发率`
    },
    {
      title: '近期分发',
      value: stats.recentDistributions,
      icon: ClockIcon,
      color: 'text-orange-600 dark:text-orange-400',
      bgColor: 'bg-orange-500/10',
      description: '最近7天'
    }
  ];

  return (
    <div className="space-y-6">
      {/* 统计卡片网格 */}
      <div className="grid-responsive">
        {statCards.map((stat, index) => (
          <GlassCard key={index} className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {stat.value}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                  {stat.description}
                </p>
              </div>
              <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-6 w-6 ${stat.color}`} />
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* 快速操作区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 活跃代币列表 */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              活跃代币
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {stats.activeTokens} 个
            </span>
          </div>
          
          <div className="space-y-3">
            {tokens
              .filter(token => token.status === 'active')
              .slice(0, 5)
              .map((token) => (
                <div 
                  key={token.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-black/5"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-gray-900 dark:text-white">
                        {token.name}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        {token.symbol}
                      </span>
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                      已分发: {token.distributedSupply.toLocaleString()} / {token.totalSupply.toLocaleString()}
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mt-2">
                      <div 
                        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                        style={{ 
                          width: `${Math.min((token.distributedSupply / token.totalSupply) * 100, 100)}%` 
                        }}
                      />
                    </div>
                  </div>
                  
                  <button
                    onClick={() => onDistributeToken(token)}
                    className="ml-4 p-2 rounded-lg bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/30 transition-colors"
                    title="分发代币"
                  >
                    <ArrowRightIcon className="h-4 w-4" />
                  </button>
                </div>
              ))}
            
            {tokens.filter(token => token.status === 'active').length === 0 && (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                暂无活跃代币
              </div>
            )}
          </div>
        </GlassCard>

        {/* 分发规则概览 */}
        <GlassCard className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              分发规则概览
            </h3>
          </div>
          
          <div className="space-y-4">
            {tokens.length > 0 ? (
              tokens.slice(0, 3).map((token) => (
                <div key={token.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-gray-900 dark:text-white">
                      {token.name}
                    </span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {token.distributionRules.length} 条规则
                    </span>
                  </div>
                  
                  <div className="space-y-1">
                    {token.distributionRules.slice(0, 2).map((rule, index) => (
                      <div 
                        key={index}
                        className="flex items-center justify-between text-sm p-2 rounded bg-white/5 dark:bg-black/5"
                      >
                        <span className="text-gray-600 dark:text-gray-400">
                          {rule.contributionType === 'content_create' && '内容创建'}
                          {rule.contributionType === 'content_review' && '内容审核'}
                          {rule.contributionType === 'community_help' && '社区帮助'}
                        </span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {rule.baseReward} {token.symbol}
                        </span>
                      </div>
                    ))}
                    
                    {token.distributionRules.length > 2 && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 text-center">
                        还有 {token.distributionRules.length - 2} 条规则...
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                暂无代币规则
              </div>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}