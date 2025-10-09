'use client';

import { useState, useEffect } from 'react';
import { 
  DocumentTextIcon, 
  EyeIcon, 
  HeartIcon, 
  TagIcon,
  UserGroupIcon,
  ArrowTrendingUpIcon
} from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface ContentStatsData {
  totalContents: number;
  totalViews: number;
  totalLikes: number;
  totalTags: number;
  activeUsers: number;
  todayContents: number;
  popularTags: Array<{
    name: string;
    count: number;
  }>;
  recentActivity: Array<{
    type: 'content' | 'like' | 'view';
    count: number;
    date: string;
  }>;
}

export function ContentStats() {
  const [stats, setStats] = useState<ContentStatsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/content/stats`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setStats(result.data);
        }
      } catch (error) {
        console.error('加载统计数据失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadStats();
  }, []);

  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            加载统计数据...
          </span>
        </div>
      </GlassCard>
    );
  }

  if (!stats) {
    return null;
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
  };

  return (
    <div className="space-y-6">
      {/* 总体统计 */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          社区统计
        </h3>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <DocumentTextIcon className="h-6 w-6 text-blue-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.totalContents)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              总内容数
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <EyeIcon className="h-6 w-6 text-green-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.totalViews)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              总浏览量
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <HeartIcon className="h-6 w-6 text-red-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.totalLikes)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              总点赞数
            </div>
          </div>
          
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <UserGroupIcon className="h-6 w-6 text-purple-500" />
            </div>
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatNumber(stats.activeUsers)}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              活跃用户
            </div>
          </div>
        </div>

        {/* 今日数据 */}
        {stats.todayContents > 0 && (
          <div className="mt-4 pt-4 border-t border-white/20 dark:border-white/10">
            <div className="flex items-center justify-center text-sm text-gray-600 dark:text-gray-400">
              <ArrowTrendingUpIcon className="h-4 w-4 mr-1" />
              今日新增 {stats.todayContents} 篇内容
            </div>
          </div>
        )}
      </GlassCard>

      {/* 热门标签 */}
      {stats.popularTags.length > 0 && (
        <GlassCard className="p-6">
          <div className="flex items-center mb-4">
            <TagIcon className="h-5 w-5 text-orange-500 mr-2" />
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              热门标签
            </h3>
          </div>
          
          <div className="space-y-2">
            {stats.popularTags.slice(0, 8).map((tag, index) => (
              <div key={tag.name} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                  #{tag.name}
                </span>
                <div className="flex items-center space-x-2">
                  <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${(tag.count / stats.popularTags[0].count) * 100}%` 
                      }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 dark:text-gray-400 w-8 text-right">
                    {tag.count}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      )}
    </div>
  );
}