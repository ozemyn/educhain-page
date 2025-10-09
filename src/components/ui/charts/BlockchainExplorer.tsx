'use client';

import React, { useState, useEffect } from 'react';
import { Block, ContributionRecord, BlockchainStatus } from '@/types/blockchain';
import BaseChart from './BaseChart';
import { useTheme } from '@/hooks/useTheme';

interface BlockchainExplorerProps {
  className?: string;
}

/**
 * 区块链浏览器组件
 * 
 * 实现需求6.3：可视化展示私链区块高度和贡献记录上链进度
 * 功能包括：
 * - 区块高度展示
 * - 交易数量统计
 * - 贡献记录上链进度
 * - 实时数据更新
 */
export default function BlockchainExplorer({ className = '' }: BlockchainExplorerProps) {
  const { theme } = useTheme();
  const [blockchainStatus, setBlockchainStatus] = useState<BlockchainStatus | null>(null);
  const [recentBlocks, setRecentBlocks] = useState<Block[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 获取区块链状态
  const fetchBlockchainStatus = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/status`);
      const result = await response.json();
      
      if (result.success) {
        setBlockchainStatus(result.data);
      } else {
        setError(result.message || '获取区块链状态失败');
      }
    } catch (err) {
      setError('网络错误，无法获取区块链状态');
      console.error('获取区块链状态失败:', err);
    }
  };

  // 获取最近的区块
  const fetchRecentBlocks = async () => {
    try {
      // 获取最新的5个区块
      const blocks: Block[] = [];
      if (blockchainStatus?.blockHeight) {
        for (let i = Math.max(0, blockchainStatus.blockHeight - 4); i <= blockchainStatus.blockHeight; i++) {
          try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/blocks/${i}`);
            const result = await response.json();
            if (result.success) {
              blocks.push(result.data);
            }
          } catch (err) {
            console.warn(`获取区块 ${i} 失败:`, err);
          }
        }
      }
      setRecentBlocks(blocks.reverse()); // 最新的在前面
    } catch (err) {
      console.error('获取最近区块失败:', err);
    }
  };

  // 初始化数据
  useEffect(() => {
    const initData = async () => {
      setLoading(true);
      await fetchBlockchainStatus();
      setLoading(false);
    };

    initData();
  }, []);

  // 当区块链状态更新时，获取最近区块
  useEffect(() => {
    if (blockchainStatus) {
      fetchRecentBlocks();
    }
  }, [blockchainStatus]);

  // 实时数据更新
  useEffect(() => {
    const interval = setInterval(() => {
      fetchBlockchainStatus();
    }, 10000); // 每10秒更新一次

    return () => clearInterval(interval);
  }, []);

  // 区块高度趋势图配置
  const blockHeightChartOption = {
    title: {
      text: '区块高度趋势',
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
    xAxis: {
      type: 'category' as const,
      data: recentBlocks.map(block => `区块 ${block.height}`),
      axisLabel: {
        color: theme === 'dark' ? '#9ca3af' : '#6b7280'
      }
    },
    yAxis: {
      type: 'value' as const,
      name: '交易数量',
      axisLabel: {
        color: theme === 'dark' ? '#9ca3af' : '#6b7280'
      }
    },
    series: [{
      name: '交易数量',
      type: 'line' as const,
      data: recentBlocks.map(block => block.transactionCount),
      smooth: true,
      lineStyle: {
        color: theme === 'dark' ? '#60a5fa' : '#3b82f6',
        width: 3
      },
      itemStyle: {
        color: theme === 'dark' ? '#60a5fa' : '#3b82f6'
      },
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [{
            offset: 0,
            color: theme === 'dark' ? 'rgba(96, 165, 250, 0.3)' : 'rgba(59, 130, 246, 0.3)'
          }, {
            offset: 1,
            color: theme === 'dark' ? 'rgba(96, 165, 250, 0.1)' : 'rgba(59, 130, 246, 0.1)'
          }]
        }
      }
    }]
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
          <div className="h-32 bg-gray-300 dark:bg-gray-600 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`
        p-6 rounded-xl backdrop-blur-md bg-red-50/10 dark:bg-red-900/10
        border border-red-200/20 dark:border-red-700/20 shadow-lg
        ${className}
      `}>
        <div className="text-red-600 dark:text-red-400 text-center">
          <p className="font-semibold mb-2">区块链数据加载失败</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* 区块链状态概览 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="
          p-4 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
          border border-white/20 dark:border-gray-700/20 shadow-lg
        ">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
              {blockchainStatus?.blockHeight || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              当前区块高度
            </div>
          </div>
        </div>

        <div className="
          p-4 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
          border border-white/20 dark:border-gray-700/20 shadow-lg
        ">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400">
              {blockchainStatus?.totalTransactions || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              总交易数量
            </div>
          </div>
        </div>

        <div className="
          p-4 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
          border border-white/20 dark:border-gray-700/20 shadow-lg
        ">
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
              {blockchainStatus?.consensusNodes || 0}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              共识节点数
            </div>
          </div>
        </div>

        <div className="
          p-4 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
          border border-white/20 dark:border-gray-700/20 shadow-lg
        ">
          <div className="text-center">
            <div className={`text-2xl font-bold ${
              blockchainStatus?.networkStatus === 'active' 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {blockchainStatus?.networkStatus === 'active' ? '正常' : '异常'}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
              网络状态
            </div>
          </div>
        </div>
      </div>

      {/* 区块高度趋势图 */}
      {recentBlocks.length > 0 && (
        <BaseChart
          option={blockHeightChartOption}
          height="300px"
          className="w-full"
        />
      )}
    </div>
  );
}