'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function BlockchainManagement() {
  const [blockchainStats, setBlockchainStats] = useState({
    blockHeight: 0,
    totalTransactions: 0,
    validatorNodes: 0,
    avgBlockTime: 0
  });
  const [recentBlocks, setRecentBlocks] = useState<any[]>([]);
  const [blockList, setBlockList] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBlockchainData();
  }, []);

  const fetchBlockchainData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // 获取区块链状态
      const statusResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/status`, { headers });
      if (statusResponse.ok) {
        const result = await statusResponse.json();
        if (result.success && result.data) {
          setBlockchainStats({
            blockHeight: result.data.blockHeight || 0,
            totalTransactions: result.data.pendingTransactions || 0,
            validatorNodes: result.data.validatorNodes || 0,
            avgBlockTime: result.data.averageBlockTime || 0
          });
        }
      }

      // 获取最新区块
      const blocksResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/blocks?limit=5`, { headers });
      if (blocksResponse.ok) {
        const result = await blocksResponse.json();
        if (result.success && result.data) {
          setRecentBlocks(result.data);
        }
      }

      // 获取区块列表
      const blockListResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/blocks?page=1&limit=5`, { headers });
      if (blockListResponse.ok) {
        const result = await blockListResponse.json();
        if (result.success && result.data) {
          setBlockList(result.data.blocks || []);
        }
      }
    } catch (error) {
      console.error('获取区块链数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          区块链管理
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          监控和管理私有区块链网络状态
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <GlassCard className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500/20">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">当前区块高度</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{blockchainStats.blockHeight}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500/20">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">总交易数</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{blockchainStats.totalTransactions.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500/20">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">验证节点</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{blockchainStats.validatorNodes}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-500/20">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">平均出块时间</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{blockchainStats.avgBlockTime}s</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            网络状态
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">区块链同步状态</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs">
                已同步
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">共识机制</span>
              <span className="px-2 py-1 bg-blue-500/20 text-blue-700 dark:text-blue-400 rounded-full text-xs">
                PoA
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">网络延迟</span>
              <span className="px-2 py-1 bg-green-500/20 text-green-700 dark:text-green-400 rounded-full text-xs">
                &lt; 100ms
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">存储使用</span>
              <span className="px-2 py-1 bg-yellow-500/20 text-yellow-700 dark:text-yellow-400 rounded-full text-xs">
                45%
              </span>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            最新区块
          </h3>
          {recentBlocks.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              暂无区块数据
            </div>
          ) : (
            <div className="space-y-4">
              {recentBlocks.map((block) => (
                <div key={block.height} className="flex items-center justify-between p-3 bg-white/5 dark:bg-black/5 rounded-lg">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      区块 #{block.height}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {block.transactionCount || 0} 笔交易
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {new Date(block.timestamp).toLocaleString('zh-CN')}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                      {block.hash?.substring(0, 10)}...
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </GlassCard>
      </div>

      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
            区块浏览器
          </h2>
          <div className="flex space-x-2">
            <button className="glass-button">
              刷新
            </button>
            <button className="glass-button">
              导出数据
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 dark:border-white/5">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">区块高度</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">区块哈希</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">交易数</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">验证者</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">时间戳</th>
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-600 dark:text-gray-400">操作</th>
              </tr>
            </thead>
            <tbody>
              {blockList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-gray-500 dark:text-gray-400">
                    暂无区块数据
                  </td>
                </tr>
              ) : (
                blockList.map((block) => (
                  <tr key={block.height} className="border-b border-white/5 dark:border-white/5 hover:bg-white/5 dark:hover:bg-black/5">
                    <td className="py-3 px-4 text-sm text-gray-800 dark:text-white font-mono">
                      #{block.height}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300 font-mono">
                      {block.hash?.substring(0, 16)}...
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                      {block.transactionCount || 0}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                      {block.validator || '未知'}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600 dark:text-gray-300">
                      {new Date(block.timestamp).toLocaleString('zh-CN')}
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 text-sm">
                        查看详情
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}