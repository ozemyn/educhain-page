'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { Token } from '@/types/token';
import { ApiResponse } from '@/types/api';
import { 
  PlayIcon, 
  PauseIcon, 
  CurrencyDollarIcon,
  UsersIcon,
  CalendarIcon,
  ChevronDownIcon,
  ChevronUpIcon
} from '@heroicons/react/24/outline';

interface TokenListProps {
  tokens: Token[];
  onDistributeToken: (token: Token) => void;
  onRefresh: () => void;
}

/**
 * 代币列表组件
 * 显示所有代币的详细信息和管理操作
 */
export function TokenList({ tokens, onDistributeToken, onRefresh }: TokenListProps) {
  const [expandedTokens, setExpandedTokens] = useState<Set<string>>(new Set());
  const [updatingStatus, setUpdatingStatus] = useState<Set<string>>(new Set());

  /**
   * 切换代币详情展开状态
   */
  const toggleExpanded = (tokenId: string) => {
    const newExpanded = new Set(expandedTokens);
    if (newExpanded.has(tokenId)) {
      newExpanded.delete(tokenId);
    } else {
      newExpanded.add(tokenId);
    }
    setExpandedTokens(newExpanded);
  };

  /**
   * 更新代币状态
   */
  const updateTokenStatus = async (tokenId: string, newStatus: 'active' | 'paused') => {
    try {
      setUpdatingStatus(prev => new Set(prev).add(tokenId));
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tokens/${tokenId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('更新代币状态失败');
      }

      const result: ApiResponse<{ success: boolean }> = await response.json();
      
      if (!result.success) {
        throw new Error('更新代币状态失败');
      }

      // 刷新数据
      onRefresh();
      
    } catch (error) {
      console.error('更新代币状态失败:', error);
      alert(error instanceof Error ? error.message : '更新代币状态失败');
    } finally {
      setUpdatingStatus(prev => {
        const newSet = new Set(prev);
        newSet.delete(tokenId);
        return newSet;
      });
    }
  };

  /**
   * 格式化日期
   */
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * 获取状态颜色
   */
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'text-green-600 dark:text-green-400 bg-green-500/20';
      case 'paused':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-500/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-500/20';
    }
  };

  /**
   * 获取状态文本
   */
  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return '活跃';
      case 'paused':
        return '暂停';
      default:
        return '未知';
    }
  };

  if (tokens.length === 0) {
    return (
      <GlassCard className="p-12 text-center">
        <CurrencyDollarIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          暂无代币
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          点击"创建代币"按钮来创建第一个激励代币
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      {tokens.map((token) => {
        const isExpanded = expandedTokens.has(token.id);
        const isUpdating = updatingStatus.has(token.id);
        const distributionRate = (token.distributedSupply / token.totalSupply) * 100;

        return (
          <GlassCard key={token.id} className="overflow-hidden">
            {/* 代币基本信息 */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      {token.name}
                    </h3>
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-blue-500/20 text-blue-600 dark:text-blue-400">
                      {token.symbol}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(token.status)}`}>
                      {getStatusText(token.status)}
                    </span>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CurrencyDollarIcon className="h-4 w-4" />
                      <span>总供应量: {token.totalSupply.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <UsersIcon className="h-4 w-4" />
                      <span>已分发: {token.distributedSupply.toLocaleString()}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <CalendarIcon className="h-4 w-4" />
                      <span>创建时间: {formatDate(token.createdAt)}</span>
                    </div>
                  </div>

                  {/* 分发进度条 */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-gray-600 dark:text-gray-400">分发进度</span>
                      <span className="text-gray-900 dark:text-white font-medium">
                        {distributionRate.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(distributionRate, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 ml-4">
                  {/* 状态切换按钮 */}
                  <button
                    onClick={() => updateTokenStatus(
                      token.id, 
                      token.status === 'active' ? 'paused' : 'active'
                    )}
                    disabled={isUpdating}
                    className={`
                      p-2 rounded-lg transition-colors
                      ${token.status === 'active' 
                        ? 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400 hover:bg-yellow-500/30' 
                        : 'bg-green-500/20 text-green-600 dark:text-green-400 hover:bg-green-500/30'
                      }
                      ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                    title={token.status === 'active' ? '暂停代币' : '激活代币'}
                  >
                    {isUpdating ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                    ) : token.status === 'active' ? (
                      <PauseIcon className="h-4 w-4" />
                    ) : (
                      <PlayIcon className="h-4 w-4" />
                    )}
                  </button>

                  {/* 分发代币按钮 */}
                  <button
                    onClick={() => onDistributeToken(token)}
                    disabled={token.status !== 'active'}
                    className="glass-button text-blue-600 dark:text-blue-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    分发代币
                  </button>

                  {/* 展开/收起按钮 */}
                  <button
                    onClick={() => toggleExpanded(token.id)}
                    className="p-2 rounded-lg bg-gray-500/20 text-gray-600 dark:text-gray-400 hover:bg-gray-500/30 transition-colors"
                  >
                    {isExpanded ? (
                      <ChevronUpIcon className="h-4 w-4" />
                    ) : (
                      <ChevronDownIcon className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* 展开的详细信息 */}
            {isExpanded && (
              <div className="border-t border-white/10 dark:border-white/5 bg-white/5 dark:bg-black/5 p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {/* 分发规则 */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      分发规则
                    </h4>
                    <div className="space-y-2">
                      {token.distributionRules.map((rule, index) => (
                        <div 
                          key={index}
                          className="p-3 rounded-lg bg-white/10 dark:bg-black/10"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-gray-900 dark:text-white">
                              {rule.contributionType === 'content_create' && '内容创建'}
                              {rule.contributionType === 'content_review' && '内容审核'}
                              {rule.contributionType === 'community_help' && '社区帮助'}
                            </span>
                            <span className="text-blue-600 dark:text-blue-400 font-medium">
                              {rule.baseReward} {token.symbol}
                            </span>
                          </div>
                          
                          {Object.keys(rule.multipliers).length > 0 && (
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              <span>倍数: </span>
                              {rule.multipliers.qualityScore && (
                                <span className="mr-2">质量×{rule.multipliers.qualityScore}</span>
                              )}
                              {rule.multipliers.popularityBonus && (
                                <span className="mr-2">热度×{rule.multipliers.popularityBonus}</span>
                              )}
                              {rule.multipliers.timeBonus && (
                                <span>时间×{rule.multipliers.timeBonus}</span>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* 代币信息 */}
                  <div>
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-3">
                      代币信息
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/10 dark:bg-black/10">
                        <span className="text-gray-600 dark:text-gray-400">精度</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {token.decimals} 位小数
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/10 dark:bg-black/10">
                        <span className="text-gray-600 dark:text-gray-400">剩余供应量</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {(token.totalSupply - token.distributedSupply).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/10 dark:bg-black/10">
                        <span className="text-gray-600 dark:text-gray-400">分发规则数</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {token.distributionRules.length} 条
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center p-3 rounded-lg bg-white/10 dark:bg-black/10">
                        <span className="text-gray-600 dark:text-gray-400">创建者</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {token.createdBy}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </GlassCard>
        );
      })}
    </div>
  );
}