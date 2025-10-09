'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { PlusIcon, FunnelIcon, ViewColumnsIcon, Squares2X2Icon } from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorModal } from '@/components/ui/ErrorModal';
import { AdvancedSearch, SearchFilters } from '@/components/user/knowledge/AdvancedSearch';
import { ContentCard } from '@/components/user/knowledge/ContentCard';
import { ContentRecommendations } from '@/components/user/knowledge/ContentRecommendations';
import { ContentStats } from '@/components/user/knowledge/ContentStats';
import { ContentFilters } from '@/components/user/knowledge/ContentFilters';
import { ContentListResponse, Category } from '@/types/content';

export default function KnowledgePage() {
  const [contentData, setContentData] = useState<ContentListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 搜索和筛选状态
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // 加载内容列表
  const loadContent = async (filters: SearchFilters = searchFilters, page: number = currentPage) => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: viewMode === 'grid' ? '12' : '10',
      });

      // 添加搜索参数
      if (filters.search?.trim()) {
        params.append('search', filters.search.trim());
      }

      if (filters.category) {
        params.append('category', filters.category);
      }

      if (filters.tags && filters.tags.length > 0) {
        params.append('tags', filters.tags.join(','));
      }

      if (filters.sortBy) {
        params.append('sort', filters.sortBy);
      }

      if (filters.dateRange?.start) {
        params.append('dateStart', filters.dateRange.start);
      }

      if (filters.dateRange?.end) {
        params.append('dateEnd', filters.dateRange.end);
      }

      if (filters.minViews) {
        params.append('minViews', filters.minViews.toString());
      }

      if (filters.minLikes) {
        params.append('minLikes', filters.minLikes.toString());
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (!response.ok) {
        throw new Error('加载内容失败');
      }

      const result = await response.json();
      setContentData(result.data);
    } catch (error) {
      console.error('加载内容失败:', error);
      // 不显示技术错误信息，只显示用户友好的提示
      setError('无法加载内容，请检查网络连接后重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 初始化加载
  useEffect(() => {
    loadContent();
  }, []);

  // 页面变化时重新加载
  useEffect(() => {
    if (currentPage > 1) {
      loadContent(searchFilters, currentPage);
    }
  }, [currentPage]);

  // 视图模式变化时重新加载
  useEffect(() => {
    if (contentData) {
      setCurrentPage(1);
      loadContent(searchFilters, 1);
    }
  }, [viewMode]);

  // 处理搜索
  const handleSearch = (filters: SearchFilters) => {
    setSearchFilters(filters);
    setCurrentPage(1);
    loadContent(filters, 1);
  };

  // 重置筛选
  const handleReset = () => {
    setSearchFilters({});
    setCurrentPage(1);
    loadContent({}, 1);
  };

  return (
    <div className="container-responsive py-8">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            知识内容
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            浏览和分享有价值的知识内容
          </p>
        </div>
        <div className="flex items-center space-x-4 mt-4 sm:mt-0">
          {/* 视图切换 */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`glass-button p-2 ${viewMode === 'grid' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}
              title="网格视图"
            >
              <Squares2X2Icon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`glass-button p-2 ${viewMode === 'list' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'}`}
              title="列表视图"
            >
              <ViewColumnsIcon className="h-5 w-5" />
            </button>
          </div>
          
          <Link
            href="/user/knowledge/create"
            className="glass-button bg-blue-500 hover:bg-blue-600 text-white font-medium px-6 py-3 inline-flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            发布内容
          </Link>
        </div>
      </div>

      {/* 高级搜索组件 */}
      <div className="mb-6">
        <AdvancedSearch
          onSearch={handleSearch}
          onReset={handleReset}
          initialFilters={searchFilters}
        />
      </div>

      {/* 活跃筛选器显示 */}
      <div className="mb-6">
        <ContentFilters
          activeFilters={searchFilters}
          onFiltersChange={handleSearch}
          onClearFilters={handleReset}
        />
      </div>

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 内容列表 */}
        <div className="lg:col-span-3">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner message="加载内容中..." />
            </div>
          ) : contentData && contentData.contents.length > 0 ? (
            <>
              {/* 结果统计 */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  找到 {contentData.total} 个结果
                  {searchFilters.search && (
                    <span className="ml-2">
                      关于 "<span className="font-medium">{searchFilters.search}</span>"
                    </span>
                  )}
                </p>
              </div>

              {/* 内容展示 */}
              {viewMode === 'grid' ? (
                <div className="grid-responsive mb-8">
                  {contentData.contents.map((content) => (
                    <ContentCard 
                      key={content.id} 
                      content={content} 
                      searchQuery={searchFilters.search}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-4 mb-8">
                  {contentData.contents.map((content) => (
                    <ContentCard 
                      key={content.id} 
                      content={content} 
                      compact 
                      searchQuery={searchFilters.search}
                    />
                  ))}
                </div>
              )}

              {/* 分页 */}
              {contentData.total > contentData.limit && (
                <div className="flex justify-center">
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="glass-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      上一页
                    </button>
                    
                    <span className="px-4 py-2 text-gray-600 dark:text-gray-400">
                      第 {currentPage} 页，共 {Math.ceil(contentData.total / contentData.limit)} 页
                    </span>
                    
                    <button
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage >= Math.ceil(contentData.total / contentData.limit)}
                      className="glass-button px-4 py-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      下一页
                    </button>
                  </div>
                </div>
              )}
            </>
          ) : (
            <GlassCard className="p-12 text-center">
              <div className="text-gray-500 dark:text-gray-400">
                <FunnelIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">暂无内容</h3>
                <p className="mb-4">
                  {Object.keys(searchFilters).length > 0 ? '没有找到符合条件的内容' : '还没有发布的内容'}
                </p>
                <Link
                  href="/user/knowledge/create"
                  className="glass-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 inline-flex items-center"
                >
                  <PlusIcon className="h-5 w-5 mr-2" />
                  发布第一篇内容
                </Link>
              </div>
            </GlassCard>
          )}
        </div>

        {/* 侧边栏 - 统计和推荐 */}
        <div className="lg:col-span-1">
          <div className="sticky top-8 space-y-6">
            <ContentStats />
            <ContentRecommendations limit={6} />
          </div>
        </div>
      </div>

      {/* 错误提示弹窗 */}
      <ErrorModal
        isOpen={!!error}
        onClose={() => setError(null)}
        message={error || ''}
      />
    </div>
  );
}