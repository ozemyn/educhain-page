'use client';

import { useState, useEffect, useRef } from 'react';
import { MagnifyingGlassIcon, ClockIcon, ArrowTrendingUpIcon } from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';

interface SearchSuggestion {
  id: string;
  title: string;
  type: 'content' | 'tag' | 'category';
  count?: number;
}

interface QuickSearchProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export function QuickSearch({ onSearch, placeholder = "搜索内容..." }: QuickSearchProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 加载最近搜索记录
  useEffect(() => {
    const recent = localStorage.getItem('recentSearches');
    if (recent) {
      setRecentSearches(JSON.parse(recent));
    }
  }, []);

  // 搜索建议防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim() && query.length >= 2) {
        loadSuggestions(query);
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 加载搜索建议
  const loadSuggestions = async (searchQuery: string) => {
    try {
      setIsLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/content/suggestions?q=${encodeURIComponent(searchQuery)}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      if (response.ok) {
        const result = await response.json();
        setSuggestions(result.data || []);
      }
    } catch (error) {
      console.error('加载搜索建议失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 处理搜索
  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;

    // 保存到最近搜索
    const newRecentSearches = [
      searchQuery,
      ...recentSearches.filter(item => item !== searchQuery)
    ].slice(0, 5);
    
    setRecentSearches(newRecentSearches);
    localStorage.setItem('recentSearches', JSON.stringify(newRecentSearches));

    // 执行搜索
    onSearch(searchQuery);
    setIsOpen(false);
    setQuery('');
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch(query);
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  // 清除最近搜索
  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'content':
        return <MagnifyingGlassIcon className="h-4 w-4" />;
      case 'tag':
        return <ArrowTrendingUpIcon className="h-4 w-4" />;
      case 'category':
        return <ArrowTrendingUpIcon className="h-4 w-4" />;
      default:
        return <MagnifyingGlassIcon className="h-4 w-4" />;
    }
  };

  return (
    <div className="relative">
      {/* 搜索输入框 */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="glass-input w-full pl-10 pr-4"
        />
        {isLoading && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
          </div>
        )}
      </div>

      {/* 搜索建议下拉框 */}
      {isOpen && (
        <div ref={dropdownRef} className="absolute top-full left-0 right-0 mt-2 z-50">
          <GlassCard className="p-4 max-h-80 overflow-y-auto scrollbar-glass">
            {/* 搜索建议 */}
            {suggestions.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  搜索建议
                </h4>
                <div className="space-y-1">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.id}
                      onClick={() => handleSearch(suggestion.title)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors flex items-center space-x-3"
                    >
                      <div className="text-gray-500 dark:text-gray-400">
                        {getSuggestionIcon(suggestion.type)}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {suggestion.title}
                        </div>
                        {suggestion.count && (
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {suggestion.count} 个结果
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 最近搜索 */}
            {recentSearches.length > 0 && (
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    最近搜索
                  </h4>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                  >
                    清除
                  </button>
                </div>
                <div className="space-y-1">
                  {recentSearches.map((search, index) => (
                    <button
                      key={index}
                      onClick={() => handleSearch(search)}
                      className="w-full text-left px-3 py-2 rounded-lg hover:bg-white/20 dark:hover:bg-black/20 transition-colors flex items-center space-x-3"
                    >
                      <ClockIcon className="h-4 w-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">
                        {search}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 空状态 */}
            {suggestions.length === 0 && recentSearches.length === 0 && query.length >= 2 && (
              <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">没有找到相关建议</p>
              </div>
            )}
          </GlassCard>
        </div>
      )}
    </div>
  );
}