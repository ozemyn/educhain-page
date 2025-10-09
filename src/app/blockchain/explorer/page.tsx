'use client';

import React, { useState } from 'react';
import BlockchainExplorer from '@/components/ui/charts/BlockchainExplorer';
import ContributionProgress from '@/components/ui/charts/ContributionProgress';
import RealTimeBlockchainData from '@/components/ui/charts/RealTimeBlockchainData';
import { useTheme } from '@/hooks/useTheme';

/**
 * 区块链浏览器页面
 * 
 * 实现需求6.3：可视化展示私链区块高度和贡献记录上链进度
 * 包含：
 * - 区块链浏览器界面
 * - 区块高度和交易展示
 * - 贡献记录上链进度显示
 * - 实时数据更新功能
 */
export default function BlockchainExplorerPage() {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState<'overview' | 'contributions' | 'realtime'>('overview');

  const tabs = [
    { id: 'overview', label: '区块链概览', icon: '🔗' },
    { id: 'contributions', label: '贡献记录', icon: '📊' },
    { id: 'realtime', label: '实时监控', icon: '⚡' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 transition-colors duration-300">
      {/* 页面头部 */}
      <div className="relative overflow-hidden">
        {/* 背景装饰 */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-400/5 dark:to-purple-400/5"></div>
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/5 dark:bg-blue-400/5 rounded-full blur-3xl"></div>
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-500/5 dark:bg-purple-400/5 rounded-full blur-3xl"></div>
        
        <div className="relative z-10 container mx-auto px-4 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                区块链浏览器
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                实时监控私有区块链状态和贡献记录上链进度
              </p>
            </div>
            
            {/* 主题切换按钮 */}
            <button
              onClick={toggleTheme}
              className="
                p-3 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
                border border-white/20 dark:border-gray-700/20 shadow-lg
                hover:bg-white/20 dark:hover:bg-gray-800/20 transition-all duration-300
                text-gray-700 dark:text-gray-300
              "
              title={theme === 'dark' ? '切换到浅色主题' : '切换到深色主题'}
            >
              {theme === 'dark' ? '🌞' : '🌙'}
            </button>
          </div>

          {/* 标签页导航 */}
          <div className="flex space-x-1 p-1 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10 border border-white/20 dark:border-gray-700/20 shadow-lg mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`
                  flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg
                  font-medium transition-all duration-300
                  ${activeTab === tab.id
                    ? 'bg-white/20 dark:bg-gray-700/20 text-blue-600 dark:text-blue-400 shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-gray-700/10'
                  }
                `}
              >
                <span className="text-lg">{tab.icon}</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div className="container mx-auto px-4 pb-8">
        <div className="relative">
          {/* 玻璃液态效果容器 */}
          <div className="
            rounded-2xl backdrop-blur-md bg-white/5 dark:bg-gray-800/5
            border border-white/10 dark:border-gray-700/10 shadow-2xl
            overflow-hidden
          ">
            {/* 装饰性渐变边框 */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 pointer-events-none"></div>
            
            <div className="relative z-10 p-6">
              {/* 标签页内容 */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      区块链网络概览
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      查看区块链网络的整体状态和最新区块信息
                    </p>
                  </div>
                  <BlockchainExplorer />
                </div>
              )}

              {activeTab === 'contributions' && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      贡献记录上链进度
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      监控用户贡献记录的上链状态和确认进度
                    </p>
                  </div>
                  <ContributionProgress />
                </div>
              )}

              {activeTab === 'realtime' && (
                <div className="space-y-8">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">
                      实时网络监控
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      实时监控区块链网络活动和最新交易动态
                    </p>
                  </div>
                  <RealTimeBlockchainData updateInterval={3000} />
                </div>
              )}
            </div>
          </div>

          {/* 底部装饰 */}
          <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-30"></div>
        </div>

        {/* 快速操作面板 */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="
            p-6 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
            border border-white/20 dark:border-gray-700/20 shadow-lg
            hover:bg-white/15 dark:hover:bg-gray-800/15 transition-all duration-300
            cursor-pointer group
          ">
            <div className="text-center">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                🔍
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                区块搜索
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                通过区块高度或哈希值搜索特定区块
              </p>
            </div>
          </div>

          <div className="
            p-6 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
            border border-white/20 dark:border-gray-700/20 shadow-lg
            hover:bg-white/15 dark:hover:bg-gray-800/15 transition-all duration-300
            cursor-pointer group
          ">
            <div className="text-center">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                📈
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                统计分析
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                查看详细的区块链网络统计和分析报告
              </p>
            </div>
          </div>

          <div className="
            p-6 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
            border border-white/20 dark:border-gray-700/20 shadow-lg
            hover:bg-white/15 dark:hover:bg-gray-800/15 transition-all duration-300
            cursor-pointer group
          ">
            <div className="text-center">
              <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                ⚙️
              </div>
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                网络设置
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                配置区块链网络参数和监控选项
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}