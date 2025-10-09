'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Block, ContributionRecord, BlockchainStatus } from '@/types/blockchain';
import BaseChart from './BaseChart';
import { useTheme } from '@/hooks/useTheme';

interface RealTimeBlockchainDataProps {
  className?: string;
  updateInterval?: number; // 更新间隔，毫秒
}

/**
 * 实时区块链数据组件
 * 
 * 实现实时数据更新功能：
 * - 实时区块链状态监控
 * - 最新交易展示
 * - 网络活动指标
 * - 自动刷新机制
 */
export default function RealTimeBlockchainData({ 
  className = '', 
  updateInterval = 5000 
}: RealTimeBlockchainDataProps) {
  const { theme } = useTheme();
  const [blockchainStatus, setBlockchainStatus] = useState<BlockchainStatus | null>(null);
  const [recentTransactions, setRecentTransactions] = useState<ContributionRecord[]>([]);
  const [networkActivity, setNetworkActivity] = useState<Array<{
    timestamp: number;
    blockHeight: number;
    transactionCount: number;
  }>>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [isConnected, setIsConnected] = useState(true);

  // 获取区块链状态
  const fetchBlockchainStatus = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/status`);
      const result = await response.json();
      
      if (result.success) {
        const newStatus = result.data;
        setBlockchainStatus(newStatus);
        
        // 更新网络活动数据
        setNetworkActivity(prev => {
          const newActivity = {
            timestamp: Date.now(),
            blockHeight: newStatus.blockHeight,
            transactionCount: newStatus.totalTransactions
          };
          
          // 保留最近20个数据点
          const updated = [...prev, newActivity].slice(-20);
          return updated;
        });
        
        setIsConnected(true);
        setLastUpdate(new Date());
      } else {
        setIsConnected(false);
      }
    } catch (err) {
      setIsConnected(false);
      console.error('获取区块链状态失败:', err);
    }
  }, []);

  // 获取最近交易
  const fetchRecentTransactions = useCallback(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contributions?limit=10&status=all`);
      const result = await response.json();
      
      if (result.success) {
        setRecentTransactions(result.data.contributions || []);
      }
    } catch (err) {
      console.error('获取最近交易失败:', err);
    }
  }, []);

  // 初始化数据
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await Promise.all([
        fetchBlockchainStatus(),
        fetchRecentTransactions()
      ]);
      setLoading(false);
    };

    initData();
  }, [fetchBlockchainStatus, fetchRecentTransactions]);

  // 设置定时更新
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBlockchainStatus();
      fetchRecentTransactions();
    }, updateInterval);

    return () => clearInterval(interval);
  }, [fetchBlockchainStatus, fetchRecentTransactions, updateInterval]);

  // 网络活动图表配置
  const networkActivityChartOption = {
    title: {
      text: '网络活动实时监控',
      textStyle: {
        color: theme === 'dark' ? '#e5e7eb' : '#374151',
        fontSize: 16,
        fontWeight: 600
      }
    },
    tooltip: {
      trigger: 'axis' as const,
      backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
      borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
      textStyle: {
        color: theme === 'dark' ? '#e5e7eb' : '#374151'
      }
    },
    legend: {
      data: ['区块高度', '交易总数'],
      textStyle: {
        color: theme === 'dark' ? '#e5e7eb' : '#374151'
      }
    },
    xAxis: {
      type: 'time' as const,
      axisLabel: {
        color: theme === 'dark' ? '#9ca3af' : '#6b7280',
        formatter: (value: number) => {
          return new Date(value).toLocaleTimeString();
        }
      }
    },
    yAxis: [
      {
        type: 'value' as const,
        name: '区块高度',
        position: 'left' as const,
        axisLabel: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280'
        }
      },
      {
        type: 'value' as const,
        name: '交易总数',
        position: 'right' as const,
        axisLabel: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280'
        }
      }
    ],
    series: [
      {
        name: '区块高度',
        type: 'line' as const,
        yAxisIndex: 0,
        data: networkActivity.map(item => [item.timestamp, item.blockHeight]),
        smooth: true,
        lineStyle: {
          color: theme === 'dark' ? '#60a5fa' : '#3b82f6',
          width: 2
        },
        itemStyle: {
          color: theme === 'dark' ? '#60a5fa' : '#3b82f6'
        }
      },
      {
        name: '交易总数',
        type: 'line' as const,
        yAxisIndex: 1,
        data: networkActivity.map(item => [item.timestamp, item.transactionCount]),
        smooth: true,
        lineStyle: {
          color: theme === 'dark' ? '#10b981' : '#059669',
          width: 2
        },
        itemStyle: {
          color: theme === 'dark' ? '#10b981' : '#059669'
        }
      }
    ]
  };

  // 格式化贡献类型
  const formatContributionType = (type: string) => {
    const typeMap = {
      'content_create': '内容创建',
      'content_review': '内容审核',
      'community_help': '社区帮助',
      'token_reward': '代币奖励'
    };
    return typeMap[type as keyof typeof typeMap] || type;
  };

  // 格式化状态
  const formatStatus = (status: string) => {
    const statusMap = {
      'confirmed': '已确认',
      'pending': '待确认',
      'failed': '失败'
    };
    return statusMap[status as keyof typeof statusMap] || status;
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'failed':
        return 'text-red-600 dark:text-red-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  if (loading) {
    return (
      <div className={`
        p-6 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
        border border-white/20 dark:border-gray-700/20 shadow-lg
        ${className}
      `}>
        <div className="animate-pulse">
          <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
          <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 连接状态指示器 */}
      <div className="flex items-center justify-between p-4 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-700/20 shadow-lg">
        <div className="flex items-center space-x-3">
          <div className={`w-3 h-3 rounded-full ${
            isConnected ? 'bg-green-500 animate-pulse' : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {isConnected ? '实时连接中' : '连接断开'}
          </span>
        </div>
        {lastUpdate && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            最后更新: {lastUpdate.toLocaleTimeString()}
          </div>
        )}
      </div>

      {/* 实时网络活动图表 */}
      {networkActivity.length > 0 && (
        <BaseChart
          option={networkActivityChartOption}
          height="300px"
          className="w-full"
        />
      )}

      {/* 最近交易列表 */}
      <div className="p-6 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-700/20 shadow-lg">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">
          最近交易记录
        </h3>
        
        {recentTransactions.length > 0 ? (
          <div className="space-y-3 max-h-64 overflow-y-auto">
            {recentTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 rounded-lg bg-white/5 dark:bg-gray-800/5 border border-white/10 dark:border-gray-700/10"
              >
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {formatContributionType(transaction.contributionType)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(transaction.status)}`}>
                      {formatStatus(transaction.status)}
                    </span>
                  </div>
                  <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                    {new Date(transaction.createdAt).toLocaleString()}
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-sm font-semibold text-blue-600 dark:text-blue-400">
                    +{transaction.contributionValue}
                  </div>
                  {transaction.transactionHash && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-mono">
                      {transaction.transactionHash.substring(0, 8)}...
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            暂无交易记录
          </div>
        )}
      </div>
    </div>
  );
}