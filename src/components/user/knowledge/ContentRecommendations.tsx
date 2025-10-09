'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { SparklesIcon, EyeIcon, HeartIcon } from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Content } from '@/types/content';

interface ContentRecommendationsProps {
  currentContentId?: string;
  userId?: string;
  limit?: number;
}

export function ContentRecommendations({ 
  currentContentId, 
  userId, 
  limit = 6 
}: ContentRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<Content[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        setIsLoading(true);
        
        // 构建推荐请求参数
        const params = new URLSearchParams({
          limit: limit.toString(),
        });

        if (currentContentId) {
          params.append('exclude', currentContentId);
        }

        if (userId) {
          params.append('userId', userId);
        }

        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/content/recommendations?${params}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );

        if (response.ok) {
          const result = await response.json();
          setRecommendations(result.data || []);
        }
      } catch (error) {
        console.error('加载推荐内容失败:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRecommendations();
  }, [currentContentId, userId, limit]);

  if (isLoading) {
    return (
      <GlassCard className="p-6">
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="md" />
          <span className="ml-3 text-gray-600 dark:text-gray-400">
            加载推荐内容...
          </span>
        </div>
      </GlassCard>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <GlassCard className="p-6">
      <div className="flex items-center mb-6">
        <SparklesIcon className="h-6 w-6 text-yellow-500 mr-2" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          推荐内容
        </h3>
      </div>

      <div className="space-y-4">
        {recommendations.map((content) => (
          <Link
            key={content.id}
            href={`/user/knowledge/detail?id=${content.id}`}
            className="block group"
          >
            <div className="glass-card p-4 hover:scale-105 transition-all duration-200">
              {/* 标题 */}
              <h4 className="font-medium text-gray-900 dark:text-white line-clamp-2 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                {content.title}
              </h4>

              {/* 摘要 */}
              {content.summary && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-3">
                  {content.summary}
                </p>
              )}

              {/* 标签 */}
              {content.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {content.tags.slice(0, 2).map((tag) => (
                    <span
                      key={tag.id}
                      className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                    >
                      {tag.name}
                    </span>
                  ))}
                  {content.tags.length > 2 && (
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                      +{content.tags.length - 2}
                    </span>
                  )}
                </div>
              )}

              {/* 统计信息 */}
              <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center">
                    <EyeIcon className="h-3 w-3 mr-1" />
                    <span>{content.viewCount}</span>
                  </div>
                  <div className="flex items-center">
                    <HeartIcon className="h-3 w-3 mr-1" />
                    <span>{content.likeCount}</span>
                  </div>
                </div>
                <span>
                  {new Date(content.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </GlassCard>
  );
}