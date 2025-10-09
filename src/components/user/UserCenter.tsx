'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import {
  CogIcon,
  UserIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  StarIcon,
} from '@heroicons/react/24/outline';

interface UserCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

export function UserCenter({ isOpen, onClose }: UserCenterProps) {
  const [user, setUser] = useState<any>(null);
  const [notifications, setNotifications] = useState(3);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      // 获取最新的用户统计数据
      fetchUserStats(JSON.parse(userData).id);
    }
  }, []);

  const fetchUserStats = async (userId: string) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/stats`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          // 更新用户数据
          setUser((prev: any) => ({
            ...prev,
            ...result.data
          }));
        }
      }
    } catch (error) {
      console.error('获取用户统计数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* 遮罩层 */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* 用户中心面板 */}
      <div className="fixed top-0 right-0 h-full w-80 z-50 transform transition-transform duration-300 ease-in-out">
        <GlassCard className="h-full rounded-none rounded-l-xl border-r-0">
          <div className="flex flex-col h-full overflow-hidden">
            {/* 头部 */}
            <div className="p-6 border-b border-white/10 dark:border-white/5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                  个人中心
                </h2>
                <button
                  onClick={onClose}
                  className="glass-button p-2 rounded-full"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* 用户信息 */}
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xl font-bold">
                    {user?.username?.charAt(0)?.toUpperCase() || '用'}
                  </span>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 dark:text-white">
                    {user?.username || '游客'}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {user?.email || '未登录'}
                  </p>
                  <div className="flex items-center mt-1">
                    {[...Array(5)].map((_, i) => (
                      <StarIcon
                        key={i}
                        className={`h-4 w-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                      />
                    ))}
                    <span className="ml-2 text-xs text-gray-600 dark:text-gray-400">
                      活跃用户
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* 可滚动内容区域 */}
            <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent">
              {/* 统计信息 */}
              <div className="p-6 border-b border-white/10 dark:border-white/5">
                <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-4">
                  我的统计
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="glass-button p-3 text-center">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {loading ? '...' : (user?.tokenBalance || 0)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">激励代币</p>
                  </div>
                  <div className="glass-button p-3 text-center">
                    <ChartBarIcon className="h-6 w-6 text-blue-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {loading ? '...' : (user?.contributionCount || 0)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">贡献记录</p>
                  </div>
                  <div className="glass-button p-3 text-center">
                    <DocumentTextIcon className="h-6 w-6 text-purple-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {loading ? '...' : (user?.contentCount || 0)}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">发布内容</p>
                  </div>
                  <div className="glass-button p-3 text-center">
                    <UserIcon className="h-6 w-6 text-orange-500 mx-auto mb-1" />
                    <p className="text-lg font-bold text-gray-800 dark:text-white">
                      {loading ? '...' : (user?.activityScore?.toFixed(1) || '0.0')}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">用户评分</p>
                  </div>
                </div>
              </div>

              {/* 快捷操作 */}
              <div className="p-6 border-b border-white/10 dark:border-white/5">
                <h3 className="text-sm font-medium text-gray-800 dark:text-white mb-4">
                  快捷操作
                </h3>
                <div className="space-y-2">
                  <button className="w-full glass-button p-3 text-left flex items-center space-x-3 hover:bg-white/20 dark:hover:bg-black/20 transition-colors">
                    <DocumentTextIcon className="h-5 w-5 text-blue-500" />
                    <span className="text-gray-800 dark:text-white">发布新内容</span>
                  </button>
                  <button className="w-full glass-button p-3 text-left flex items-center space-x-3 hover:bg-white/20 dark:hover:bg-black/20 transition-colors">
                    <ChartBarIcon className="h-5 w-5 text-green-500" />
                    <span className="text-gray-800 dark:text-white">查看贡献记录</span>
                  </button>
                  <button className="w-full glass-button p-3 text-left flex items-center space-x-3 hover:bg-white/20 dark:hover:bg-black/20 transition-colors">
                    <CurrencyDollarIcon className="h-5 w-5 text-yellow-500" />
                    <span className="text-gray-800 dark:text-white">代币交易记录</span>
                  </button>
                </div>
              </div>

              {/* 通知中心 */}
              <div className="p-6 border-b border-white/10 dark:border-white/5">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-medium text-gray-800 dark:text-white">
                    通知中心
                  </h3>
                  {notifications > 0 && (
                    <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {notifications}
                    </span>
                  )}
                </div>
                <div className="space-y-3">
                  <div className="glass-button p-3 text-left">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 dark:text-white">
                          您的内容《React最佳实践》已通过审核
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          2小时前
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="glass-button p-3 text-left">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 dark:text-white">
                          获得50个激励代币奖励
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          5小时前
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="glass-button p-3 text-left">
                    <div className="flex items-start space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 flex-shrink-0"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-800 dark:text-white">
                          有新用户关注了您
                        </p>
                        <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                          1天前
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 设置区域 */}
            <div className="p-6 border-t border-white/10 dark:border-white/5 mt-auto">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-800 dark:text-white">主题切换</span>
                <ThemeToggle />
              </div>
              <button className="w-full mb-3 glass-button p-3 text-left flex items-center space-x-3 hover:bg-white/20 dark:hover:bg-black/20 transition-colors">
                <CogIcon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                <span className="text-gray-800 dark:text-white">更多设置</span>
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem('userToken');
                  localStorage.removeItem('user');
                  window.location.href = '/';
                }}
                className="w-full glass-button p-3 text-left flex items-center space-x-3 hover:bg-red-500/20 transition-colors text-red-600 dark:text-red-400"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span>退出登录</span>
              </button>
            </div>
          </div>
        </GlassCard>
      </div>
    </>
  );
}