'use client';

import { useState } from 'react';
import { 
  FunnelIcon, 
  XMarkIcon,
  CalendarIcon,
  EyeIcon,
  HeartIcon,
  TagIcon
} from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';

interface ContentFiltersProps {
  activeFilters: {
    category?: string;
    tags?: string[];
    dateRange?: { start?: string; end?: string };
    minViews?: number;
    minLikes?: number;
    sortBy?: string;
  };
  onFiltersChange: (filters: any) => void;
  onClearFilters: () => void;
}

export function ContentFilters({ 
  activeFilters, 
  onFiltersChange, 
  onClearFilters 
}: ContentFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // 计算活跃筛选器数量
  const getActiveFilterCount = () => {
    let count = 0;
    if (activeFilters.category) count++;
    if (activeFilters.tags && activeFilters.tags.length > 0) count++;
    if (activeFilters.dateRange?.start || activeFilters.dateRange?.end) count++;
    if (activeFilters.minViews) count++;
    if (activeFilters.minLikes) count++;
    return count;
  };

  const activeFilterCount = getActiveFilterCount();

  // 移除单个筛选器
  const removeFilter = (filterType: string) => {
    const newFilters = { ...activeFilters };
    
    switch (filterType) {
      case 'category':
        delete newFilters.category;
        break;
      case 'tags':
        delete newFilters.tags;
        break;
      case 'dateRange':
        delete newFilters.dateRange;
        break;
      case 'minViews':
        delete newFilters.minViews;
        break;
      case 'minLikes':
        delete newFilters.minLikes;
        break;
    }
    
    onFiltersChange(newFilters);
  };

  // 获取筛选器显示文本
  const getFilterDisplayText = (filterType: string, value: any) => {
    switch (filterType) {
      case 'category':
        return `分类: ${value}`;
      case 'tags':
        return `标签: ${value.length} 个`;
      case 'dateRange':
        if (value.start && value.end) {
          return `日期: ${value.start} 至 ${value.end}`;
        } else if (value.start) {
          return `日期: ${value.start} 之后`;
        } else if (value.end) {
          return `日期: ${value.end} 之前`;
        }
        return '日期筛选';
      case 'minViews':
        return `最少浏览: ${value}`;
      case 'minLikes':
        return `最少点赞: ${value}`;
      default:
        return '';
    }
  };

  if (activeFilterCount === 0) {
    return null;
  }

  return (
    <GlassCard className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-blue-500" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            已应用筛选 ({activeFilterCount})
          </span>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {isExpanded ? '收起' : '展开'}
          </button>
        </div>
        
        <button
          onClick={onClearFilters}
          className="text-sm text-red-500 hover:text-red-600 font-medium"
        >
          清除全部
        </button>
      </div>

      {/* 筛选器标签 */}
      {(isExpanded || activeFilterCount <= 3) && (
        <div className="mt-3 flex flex-wrap gap-2">
          {activeFilters.category && (
            <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
              <span>{getFilterDisplayText('category', activeFilters.category)}</span>
              <button
                onClick={() => removeFilter('category')}
                className="ml-2 hover:text-blue-600"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          )}

          {activeFilters.tags && activeFilters.tags.length > 0 && (
            <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
              <TagIcon className="h-3 w-3 mr-1" />
              <span>{getFilterDisplayText('tags', activeFilters.tags)}</span>
              <button
                onClick={() => removeFilter('tags')}
                className="ml-2 hover:text-green-600"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          )}

          {(activeFilters.dateRange?.start || activeFilters.dateRange?.end) && (
            <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200">
              <CalendarIcon className="h-3 w-3 mr-1" />
              <span>{getFilterDisplayText('dateRange', activeFilters.dateRange)}</span>
              <button
                onClick={() => removeFilter('dateRange')}
                className="ml-2 hover:text-purple-600"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          )}

          {activeFilters.minViews && (
            <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-orange-100 dark:bg-orange-900 text-orange-800 dark:text-orange-200">
              <EyeIcon className="h-3 w-3 mr-1" />
              <span>{getFilterDisplayText('minViews', activeFilters.minViews)}</span>
              <button
                onClick={() => removeFilter('minViews')}
                className="ml-2 hover:text-orange-600"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          )}

          {activeFilters.minLikes && (
            <div className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200">
              <HeartIcon className="h-3 w-3 mr-1" />
              <span>{getFilterDisplayText('minLikes', activeFilters.minLikes)}</span>
              <button
                onClick={() => removeFilter('minLikes')}
                className="ml-2 hover:text-red-600"
              >
                <XMarkIcon className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      )}
    </GlassCard>
  );
}