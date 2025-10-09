'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { BackendError } from '@/components/ui/BackendError';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { AuthGuard } from '@/components/auth/AuthGuard';

// 添加请求去重缓存
const requestCache = new Map<string, Promise<any>>();
const cacheExpiry = new Map<string, number>();

// 带缓存的fetch函数
const cachedFetch = async (url: string, options: RequestInit, cacheKey: string, ttl: number = 60000) => {
  const now = Date.now();
  
  // 检查是否有未过期的缓存请求
  if (requestCache.has(cacheKey)) {
    const expiry = cacheExpiry.get(cacheKey);
    if (expiry && now < expiry) {
      return requestCache.get(cacheKey);
    } else {
      // 缓存过期，删除旧缓存
      requestCache.delete(cacheKey);
      cacheExpiry.delete(cacheKey);
    }
  }
  
  // 创建新请求并缓存
  const requestPromise = fetch(url, options);
  requestCache.set(cacheKey, requestPromise);
  cacheExpiry.set(cacheKey, now + ttl);
  
  // 请求完成后清理缓存
  requestPromise.finally(() => {
    requestCache.delete(cacheKey);
    cacheExpiry.delete(cacheKey);
  });
  
  return requestPromise;
};

export default function UserHomePage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [popularContent, setPopularContent] = useState<any[]>([]);
  const [ranking, setRanking] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // 检查用户登录状态
    const token = localStorage.getItem('userToken');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsLoggedIn(true);
      setUser(JSON.parse(userData));
      fetchUserData(JSON.parse(userData).id);
    } else {
      setLoading(false);
    }
  }, []);

  // 获取用户数据
  const fetchUserData = async (userId: string) => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('userToken');
      const headers = {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      };
      
      // 使用带缓存的并行请求
      const [statsResponse, contentResponse, rankingResponse] = await Promise.all([
        cachedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/stats`, 
          { headers },
          `user-stats-${userId}`,
          60000 // 1分钟缓存
        ),
        cachedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/content?sort=popular&limit=3`, 
          { headers },
          'popular-content',
          300000 // 5分钟缓存
        ),
        cachedFetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/contributions/leaderboard?limit=5`, 
          { headers },
          'leaderboard',
          120000 // 2分钟缓存
        )
      ]);
      
      // 处理响应
      const statsResult = statsResponse.ok ? await statsResponse.json() : null;
      const contentResult = contentResponse.ok ? await contentResponse.json() : null;
      const rankingResult = rankingResponse.ok ? await rankingResponse.json() : null;
      
      // 更新状态
      if (statsResult?.success) {
        setUserStats(statsResult.data);
      }
      
      if (contentResult?.success && contentResult.data) {
        setPopularContent(contentResult.data.contents || []);
      }
      
      if (rankingResult?.success && rankingResult.data) {
        setRanking(rankingResult.data.leaderboard || []);
      }
      
      setLoading(false);
    } catch (err) {
      console.error('获取数据失败:', err);
      setError('无法连接到后端服务，请检查网络连接');
      setLoading(false);
    }
  };

  // 重新加载数据
  const handleRetry = () => {
    if (user && user.id) {
      fetchUserData(user.id);
    }
  };

  // 渲染加载状态
  if (loading) {
    return <LoadingSpinner message="正在加载用户数据..." />;
  }

  // 渲染错误状态
  if (error) {
    return <BackendError message={error} onRetry={handleRetry} />;
  }

  return (
    <AuthGuard>
      <div className="space-y-8">
      {/* 欢迎横幅 */}
      <GlassCard className="p-6 md:p-8 text-center">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4">
          {isLoggedIn ? `欢迎回来，${user?.username}！` : '欢迎来到EduChain'}
        </h1>
        <p className="text-base md:text-lg text-gray-600 dark:text-gray-300 mb-6">
          分享知识，获得激励，建立可信的贡献记录
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          {isLoggedIn ? (
            <>
              <Link href="/user/knowledge/create">
                <button className="glass-button px-6 py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  发布知识内容
                </button>
              </Link>
              <Link href="/user/knowledge">
                <button className="glass-button px-6 py-3 text-gray-800 dark:text-white font-semibold">
                  浏览社区内容
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/user/login">
                <button className="glass-button px-6 py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700">
                  立即登录
                </button>
              </Link>
              <Link href="/user/register">
                <button className="glass-button px-6 py-3 text-white font-semibold bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700">
                  免费注册
                </button>
              </Link>
            </>
          )}
        </div>
      </GlassCard>

      {/* 统计信息 */}
      {isLoggedIn && userStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{userStats.tokenCount || 0}</h3>
            <p className="text-gray-600 dark:text-gray-300">我的激励代币</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{userStats.contentCount || 0}</h3>
            <p className="text-gray-600 dark:text-gray-300">发布的内容</p>
          </GlassCard>

          <GlassCard className="p-6 text-center">
            <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full mx-auto mb-4 flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">{userStats.contributionCount || 0}</h3>
            <p className="text-gray-600 dark:text-gray-300">贡献记录</p>
          </GlassCard>
        </div>
      )}

      {/* 最新内容 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            热门知识内容
          </h2>
          <div className="space-y-4">
            {popularContent && popularContent.length > 0 ? (
              popularContent.map((item: any) => (
                <div key={item.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-lg flex-shrink-0"></div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-800 dark:text-white mb-1">
                      {item.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {item.summary || '暂无摘要'}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-500">
                      <span>{item.author?.username || '未知作者'}</span>
                      <span className="mx-2">•</span>
                      <span>{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : '未知时间'}</span>
                      <span className="mx-2">•</span>
                      <span>{item.viewCount || 0} 浏览</span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                暂无热门内容
              </p>
            )}
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
            贡献排行榜
          </h2>
          <div className="space-y-4">
            {ranking && ranking.length > 0 ? (
              ranking.map((rankItem: any, index: number) => (
                <div key={rankItem.id} className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    index === 0 ? 'bg-yellow-500 text-white' :
                    index === 1 ? 'bg-gray-400 text-white' :
                    index === 2 ? 'bg-orange-500 text-white' :
                    'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400'
                  }`}>
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-800 dark:text-white">{rankItem.username}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{rankItem.contributionCount || 0} 贡献值</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-800 dark:text-white">{rankItem.tokenBalance || 0} 代币</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-600 dark:text-gray-400 text-center py-4">
                暂无排行榜数据
              </p>
            )}
          </div>
        </GlassCard>
      </div>
    </div>
    </AuthGuard>
  );
}