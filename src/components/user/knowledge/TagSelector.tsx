'use client';

import { useState, useRef, useEffect } from 'react';
import { XMarkIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { Tag } from '@/types/content';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface TagSelectorProps {
  tags: Tag[];
  selectedTags: string[];
  onTagsChange: (tags: string[]) => void;
  onSearch: (query: string) => void;
  isLoading?: boolean;
  maxTags?: number;
}

export function TagSelector({
  tags,
  selectedTags,
  onTagsChange,
  onSearch,
  isLoading = false,
  maxTags = 10
}: TagSelectorProps) {
  const [inputValue, setInputValue] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 处理输入变化
  const handleInputChange = (value: string) => {
    setInputValue(value);
    setIsDropdownOpen(true);
    onSearch(value);
  };

  // 添加标签
  const addTag = (tagName: string) => {
    if (selectedTags.length >= maxTags) {
      alert(`最多只能添加 ${maxTags} 个标签`);
      return;
    }

    if (!selectedTags.includes(tagName)) {
      onTagsChange([...selectedTags, tagName]);
    }
    setInputValue('');
    setIsDropdownOpen(false);
    inputRef.current?.focus();
  };

  // 移除标签
  const removeTag = (tagName: string) => {
    onTagsChange(selectedTags.filter(tag => tag !== tagName));
  };

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (inputValue.trim()) {
        addTag(inputValue.trim());
      }
    } else if (e.key === 'Backspace' && !inputValue && selectedTags.length > 0) {
      // 删除最后一个标签
      removeTag(selectedTags[selectedTags.length - 1]);
    } else if (e.key === 'Escape') {
      setIsDropdownOpen(false);
    }
  };

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // 过滤已选择的标签
  const availableTags = tags.filter(tag => !selectedTags.includes(tag.name));

  return (
    <div className="relative">
      {/* 标签输入区域 */}
      <div className="glass-card p-3 min-h-[2.5rem]">
        <div className="flex flex-wrap items-center gap-2">
          {/* 已选择的标签 */}
          {selectedTags.map((tagName) => (
            <span
              key={tagName}
              className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200"
            >
              {tagName}
              <button
                type="button"
                onClick={() => removeTag(tagName)}
                className="ml-1 inline-flex items-center justify-center w-4 h-4 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
              >
                <XMarkIcon className="w-3 h-3" />
              </button>
            </span>
          ))}

          {/* 输入框 */}
          <div className="flex-1 min-w-[120px] relative">
            <div className="flex items-center">
              <MagnifyingGlassIcon className="w-4 h-4 text-gray-400 mr-2" />
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => handleInputChange(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={() => setIsDropdownOpen(true)}
                placeholder={selectedTags.length === 0 ? '搜索或输入标签名称' : ''}
                className="flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                disabled={selectedTags.length >= maxTags}
              />
            </div>
          </div>
        </div>

        {/* 标签计数 */}
        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400 text-right">
          {selectedTags.length}/{maxTags} 个标签
        </div>
      </div>

      {/* 下拉建议列表 */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 glass-card max-h-48 overflow-auto shadow-lg"
        >
          {isLoading ? (
            <div className="p-3 flex items-center justify-center">
              <LoadingSpinner size="sm" />
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                搜索中...
              </span>
            </div>
          ) : (
            <>
              {/* 创建新标签选项 */}
              {inputValue.trim() && !tags.some(tag => tag.name.toLowerCase() === inputValue.toLowerCase()) && (
                <button
                  type="button"
                  onClick={() => addTag(inputValue.trim())}
                  className="w-full px-3 py-2 text-left hover:bg-white/20 dark:hover:bg-black/20 transition-colors border-b border-white/10 dark:border-white/5"
                >
                  <div className="flex items-center">
                    <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                      创建标签: "{inputValue.trim()}"
                    </span>
                  </div>
                </button>
              )}

              {/* 现有标签列表 */}
              {availableTags.length > 0 ? (
                availableTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => addTag(tag.name)}
                    className="w-full px-3 py-2 text-left hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-900 dark:text-white">
                        {tag.name}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {tag.usageCount} 次使用
                      </span>
                    </div>
                  </button>
                ))
              ) : inputValue && !isLoading ? (
                <div className="p-3 text-center text-sm text-gray-500 dark:text-gray-400">
                  没有找到相关标签
                </div>
              ) : null}
            </>
          )}
        </div>
      )}

      {/* 使用提示 */}
      <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
        <div className="flex items-center space-x-4">
          <span>按 Enter 键添加标签</span>
          <span>按 Backspace 键删除标签</span>
          <span>按 Esc 键关闭列表</span>
        </div>
      </div>
    </div>
  );
}