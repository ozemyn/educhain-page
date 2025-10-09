'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AdminAuthGuard } from '@/components/admin/AdminAuthGuard';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalContent: 0,
    totalTokens: 0,
    blockHeight: 0
  });
  const [activities, setActivities] = useState<any[]>([]);
  const [systemStatus, setSystemStatus] = useState({
    blockchain: 'unknown',
    database: 'unknown',
    cache: 'unknown'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };

      // 获取统计数据
      const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/dashboard/stats`, { headers });
      if (statsResponse.ok) {
        const result = await statsResponse.json();
        if (result.success && result.data) {
          setStats(result.data);
        }
      }

      // 获取最近活动
      const activitiesResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/activities/recent?limit=5`, { headers });
      if (activitiesResponse.ok) {
        const result = await activitiesResponse.json();
        if (result.success && result.data) {
          setActivities(result.data);
        }
      }

      // 获取系统状态
      const statusResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/blockchain/status`, { headers });
      if (statusResponse.ok) {
        const result = await statusResponse.json();
        if (result.success && result.data) {
          setSystemStatus({
            blockchain: result.data.isHealthy ? 'healthy' : 'error',
            database: 'healthy',
            cache: 'healthy'
          });
        }
      }
    } catch (error) {
      console.error('获取仪表板数据失败:', error);
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
    <AdminAuthGuard>
      <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
          管理仪表板
        </h1>
        <p className="text-gray-600 dark:text-gray-300">
          欢迎使用EduChain管理系统
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <GlassCard className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-500/20">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">总用户数</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalUsers.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-500/20">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">知识内容</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalContent.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-500/20">
              <svg className="w-6 h-6 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">激励代币</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.totalTokens.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-orange-500/20">
              <svg className="w-6 h-6 text-orange-600 dark:text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">区块高度</p>
              <p className="text-2xl font-semibold text-gray-900 dark:text-white">{stats.blockHeight.toLocaleString()}</p>
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            最近活动
          </h3>
          {activities.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              暂无最近活动
            </div>
          ) : (
            <div className="space-y-4">
              {activities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.type === 'content' ? 'bg-green-500' :
                    activity.type === 'block' ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`}></div>
                  <span className="text-sm text-gray-600 dark:text-gray-300">
                    {activity.description}
                  </span>
                </div>
              ))}
            </div>
          )}
        </GlassCard>

        <GlassCard className="p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
            系统状态
          </h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">区块链状态</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                systemStatus.blockchain === 'healthy'
                  ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                  : 'bg-red-500/20 text-red-700 dark:text-red-400'
              }`}>
                {systemStatus.blockchain === 'healthy' ? '正常运行' : '异常'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">数据库连接</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                systemStatus.database === 'healthy'
                  ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                  : 'bg-red-500/20 text-red-700 dark:text-red-400'
              }`}>
                {systemStatus.database === 'healthy' ? '已连接' : '断开'}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600 dark:text-gray-300">缓存服务</span>
              <span className={`px-2 py-1 rounded-full text-xs ${
                systemStatus.cache === 'healthy'
                  ? 'bg-green-500/20 text-green-700 dark:text-green-400'
                  : 'bg-red-500/20 text-red-700 dark:text-red-400'
              }`}>
                {systemStatus.cache === 'healthy' ? '运行中' : '停止'}
              </span>
            </div>
          </div>
        </GlassCard>
      </div>
    </div>
    </AdminAuthGuard>
  );
}