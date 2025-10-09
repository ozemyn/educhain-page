'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import ContributionStatistics from '@/components/user/statistics/ContributionStatistics';
import { ChartBarIcon, UsersIcon, CurrencyDollarIcon, DocumentTextIcon } from '@heroicons/react/24/outline';

interface AdminStats {
  totalUsers: number;
  totalContributions: number;
  totalTokensDistributed: number;
  totalContent: number;
  activeUsers: number;
  pendingReviews: number;
}

/**
 * 管理端统计页面
 * 
 * 提供管理员查看社区整体统计数据：
 * - 社区概览统计
 * - 贡献排行榜
 * - 代币分发统计
 * - 内容审核统计
 */
export default function AdminStatisticsPage() {
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  // 获取管理员统计数据
  useEffect(() => {
    const fetchAdminStats = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          window.location.href = '/admin/login';
          return;
        }

        // 并行获取多个统计数据
        const [usersRes, contributionsRes, tokensRes, contentRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/users/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contributions/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tokens/admin/overview`, {
            headers: { 'Authorization': `Bearer ${token}` }
          }),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/content/stats`, {
            headers: { 'Authorization': `Bearer ${token}` }
          })
        ]);

        const [usersData, contributionsData, tokensData, contentData] = await Promise.all([
          usersRes.ok ? usersRes.json() : { data: {} },
          contributionsRes.ok ? contributionsRes.json() : { data: {} },
          tokensRes.ok ? tokensRes.json() : { data: [] },
          contentRes.ok ? contentRes.json() : { data: {} }
        ]);

        // 计算总代币分发量
        const totalTokensDistributed = tokensData.data?.reduce((sum: number, token: any) => 
          sum + (token.totalDistributed || 0), 0) || 0;

        setAdminStats({
          totalUsers: usersData.data?.totalUsers || 0,
          totalContributions: contributionsData.data?.totalContributions || 0,
          totalTokensDistributed,
          totalContent: contentData.data?.totalContent || 0,
          activeUsers: usersData.data?.activeUsers || 0,
          pendingReviews: contentData.data?.pendingReviews || 0
        });

      } catch (error) {
        console.error('获取管理员统计数据失败:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">加载统计数据中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      {/* 背景装饰 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* 页面头部 */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8"
        >
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-500/10 dark:bg-blue-400/10 mb-4">
            <ChartBarIcon className="w-8 h-8 text-blue-600 dark:text-blue-400" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            社区统计分析
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            管理员视角的社区数据概览和深度分析
          </p>
        </motion.div>

        {/* 统计卡片 */}
        {adminStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
          >
            <div className="p-6 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总用户数</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {adminStats.totalUsers.toLocaleString()}
                  </p>
                  <p className="text-xs text-green-600 dark:text-green-400 mt-1">
                    活跃用户: {adminStats.activeUsers}
                  </p>
                </div>
                <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg flex items-center justify-center">
                  <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">总贡献数</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {adminStats.totalContributions.toLocaleString()}
                  </p>
                  <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                    已确认贡献
                  </p>
                </div>
                <div className="w-12 h-12 bg-green-500/10 dark:bg-green-400/10 rounded-lg flex items-center justify-center">
                  <ChartBarIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">代币分发总量</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {adminStats.totalTokensDistributed.toLocaleString()}
                  </p>
                  <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">
                    激励代币
                  </p>
                </div>
                <div className="w-12 h-12 bg-purple-500/10 dark:bg-purple-400/10 rounded-lg flex items-center justify-center">
                  <CurrencyDollarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">内容总数</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">
                    {adminStats.totalContent.toLocaleString()}
                  </p>
                  <p className="text-xs text-orange-600 dark:text-orange-400 mt-1">
                    待审核: {adminStats.pendingReviews}
                  </p>
                </div>
                <div className="w-12 h-12 bg-orange-500/10 dark:bg-orange-400/10 rounded-lg flex items-center justify-center">
                  <DocumentTextIcon className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* 图表统计 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-7xl mx-auto"
        >
          <ContributionStatistics className="w-full" />
        </motion.div>

        {/* 管理功能快捷入口 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white text-center mb-6">
            管理功能
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <a
              href="/admin/users"
              className="block p-6 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-blue-500/10 dark:bg-blue-400/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <UsersIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                用户管理
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                管理用户账户、权限和状态
              </p>
            </a>

            <a
              href="/admin/content-review"
              className="block p-6 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-green-500/10 dark:bg-green-400/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <DocumentTextIcon className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                内容审核
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                审核用户提交的知识内容
              </p>
            </a>

            <a
              href="/admin/tokens"
              className="block p-6 rounded-xl bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20 hover:bg-white/20 dark:hover:bg-gray-700/20 transition-all duration-200"
            >
              <div className="w-12 h-12 bg-purple-500/10 dark:bg-purple-400/10 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CurrencyDollarIcon className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                代币管理
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm text-center">
                管理激励代币和分发规则
              </p>
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
}