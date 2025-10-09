'use client';

import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  FunnelIcon, 
  XMarkIcon,
  CalendarIcon,
  TagIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';
import { Category, Tag } from '@/types/content';

interface AdvancedSearchProps {
  onSearch: (filters: SearchFilters) => void;
  onReset: () => void;
  initialFilters?: SearchFilters;
}

export interface SearchFilters {
  search?: string;
  category?: string;
  tags?: string[];
  dateRange?: {
    start?: string;
    end?: string;
  };
  sortBy?: string;
  minViews?: number;
  minLikes?: number;
}

export function AdvancedSearch({ onSearch, onReset, initialFilters }: AdvancedSearchProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>(initialFilters || {});
  const [categories, setCategories] = useState<Category[]>([]);
  const [availableTags, setAvailableTags] = useState<Tag[]>([]);
  const [tagSearch, setTagSearch] = useState('');

  // 加载分类和标签数据
  useEffect(() => {
    const loadData = async () => {
      try {
        // 加载分类
        const categoriesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/content/categories/list`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (categoriesResponse.ok) {
          const categoriesResult = await categoriesResponse.json();
          setCategories(categoriesResult.data || []);
        }

        // 加载热门标签
        const tagsResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/content/tags/list?limit=50`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        if (tagsResponse.ok) {
          const tagsResult = await tagsResponse.json();
          setAvailableTags(tagsResult.data || []);
        }
      } catch (error) {
        console.error('加载搜索数据失败:', error);
      }
    };

    loadData();
  }, []);

  // 处理搜索
  const handleSearch = () => {
    onSearch(filters);
  };

  // 重置筛选
  const handleReset = () => {
    setFilters({});
    onReset();
  };

  // 更新筛选条件
  const updateFilter = (key: keyof SearchFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // 添加标签
  const addTag = (tagId: string) => {
    const currentTags = filters.tags || [];
    if (!currentTags.includes(tagId)) {
      updateFilter('tags', [...currentTags, tagId]);
    }
  };

  // 移除标签
  const removeTag = (tagId: string) => {
    const currentTags = filters.tags || [];
    updateFilter('tags', currentTags.filter(id => id !== tagId));
  };

  // 获取选中的标签名称
  const getSelectedTagNames = () => {
    if (!filters.tags) return [];
    return availableTags
      .filter(tag => filters.tags!.includes(tag.id))
      .map(tag => tag.name);
  };

  // 筛选可用标签
  const filteredTags = availableTags.filter(tag =>
    tag.name.toLowerCase().includes(tagSearch.toLowerCase())
  );

  return (
    <GlassCard className="p-6">
      {/* 基础搜索 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {/* 搜索框 */}
        <div className="md:col-span-2">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={filters.search || ''}
              onChange={(e) => updateFilter('search', e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="搜索标题或内容..."
              className="glass-input w-full pl-10"
            />
          </div>
        </div>

        {/* 分类筛选 */}
        <div>
          <select
            value={filters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="glass-input w-full"
          >
            <option value="">所有分类</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* 排序 */}
        <div>
          <select
            value={filters.sortBy || 'created_at_desc'}
            onChange={(e) => updateFilter('sortBy', e.target.value)}
            className="glass-input w-full"
          >
            <option value="created_at_desc">最新发布</option>
            <option value="created_at_asc">最早发布</option>
            <option value="view_count_desc">浏览最多</option>
            <option value="like_count_desc">点赞最多</option>
            <option value="relevance">相关性</option>
          </select>
        </div>
      </div>

      {/* 高级筛选切换 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="glass-button text-gray-600 dark:text-gray-400 px-4 py-2 inline-flex items-center"
        >
          <FunnelIcon className="h-4 w-4 mr-2" />
          高级筛选
          <span className="ml-2 text-xs">
            {isExpanded ? '收起' : '展开'}
          </span>
        </button>

        <div className="flex space-x-2">
          <button
            onClick={handleSearch}
            className="glass-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
          >
            搜索
          </button>
          <button
            onClick={handleReset}
            className="glass-button text-gray-600 dark:text-gray-400 px-4 py-2"
          >
            重置
          </button>
        </div>
      </div>

      {/* 高级筛选面板 */}
      {isExpanded && (
        <div className="border-t border-white/20 dark:border-white/10 pt-4 space-y-4">
          {/* 标签选择 */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              <TagIcon className="h-4 w-4 inline mr-1" />
              标签筛选
            </label>
            
            {/* 已选标签 */}
            {filters.tags && filters.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {getSelectedTagNames().map((tagName, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center px-3 py-1 text-sm rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
                  >
                    {tagName}
                    <button
                      onClick={() => removeTag(filters.tags![index])}
                      className="ml-2 hover:text-blue-600"
                    >
                      <XMarkIcon className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}

            {/* 标签搜索 */}
            <div className="relative mb-2">
              <input
                type="text"
                value={tagSearch}
                onChange={(e) => setTagSearch(e.target.value)}
                placeholder="搜索标签..."
                className="glass-input w-full text-sm"
              />
            </div>

            {/* 可选标签 */}
            <div className="max-h-32 overflow-y-auto scrollbar-glass">
              <div className="flex flex-wrap gap-1">
                {filteredTags.slice(0, 20).map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() => addTag(tag.id)}
                    disabled={filters.tags?.includes(tag.id)}
                    className={`px-2 py-1 text-xs rounded-full transition-colors ${
                      filters.tags?.includes(tag.id)
                        ? 'bg-blue-500 text-white cursor-not-allowed'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    {tag.name} ({tag.usageCount})
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 日期范围 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                <CalendarIcon className="h-4 w-4 inline mr-1" />
                开始日期
              </label>
              <input
                type="date"
                value={filters.dateRange?.start || ''}
                onChange={(e) => updateFilter('dateRange', {
                  ...filters.dateRange,
                  start: e.target.value
                })}
                className="glass-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                结束日期
              </label>
              <input
                type="date"
                value={filters.dateRange?.end || ''}
                onChange={(e) => updateFilter('dateRange', {
                  ...filters.dateRange,
                  end: e.target.value
                })}
                className="glass-input w-full"
              />
            </div>
          </div>

          {/* 数值筛选 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                最小浏览数
              </label>
              <input
                type="number"
                min="0"
                value={filters.minViews || ''}
                onChange={(e) => updateFilter('minViews', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="0"
                className="glass-input w-full"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                最小点赞数
              </label>
              <input
                type="number"
                min="0"
                value={filters.minLikes || ''}
                onChange={(e) => updateFilter('minLikes', e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="0"
                className="glass-input w-full"
              />
            </div>
          </div>
        </div>
      )}
    </GlassCard>
  );
}