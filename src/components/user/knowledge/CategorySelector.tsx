'use client';

import { useState, Fragment } from 'react';
import { Listbox, Transition } from '@headlessui/react';
import { ChevronUpDownIcon, CheckIcon } from '@heroicons/react/24/outline';
import { Category } from '@/types/content';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

interface CategorySelectorProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
  isLoading?: boolean;
}

export function CategorySelector({
  categories,
  selectedCategory,
  onCategoryChange,
  isLoading = false
}: CategorySelectorProps) {
  // 扁平化分类树，用于显示
  const flattenCategories = (cats: Category[], level = 0): (Category & { level: number })[] => {
    const result: (Category & { level: number })[] = [];
    
    cats.forEach(cat => {
      result.push({ ...cat, level });
      if (cat.children && cat.children.length > 0) {
        result.push(...flattenCategories(cat.children, level + 1));
      }
    });
    
    return result;
  };

  const flatCategories = flattenCategories(categories);
  const selectedCategoryData = flatCategories.find(cat => cat.id === selectedCategory);

  if (isLoading) {
    return (
      <div className="glass-card p-3 flex items-center justify-center">
        <LoadingSpinner size="sm" />
        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
          加载分类中...
        </span>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="glass-card p-3 text-center text-gray-500 dark:text-gray-400">
        暂无可用分类
      </div>
    );
  }

  return (
    <Listbox value={selectedCategory} onChange={onCategoryChange}>
      <div className="relative">
        <Listbox.Button className="glass-input w-full text-left flex items-center justify-between">
          <span className={selectedCategoryData ? 'text-gray-900 dark:text-white' : 'text-gray-500 dark:text-gray-400'}>
            {selectedCategoryData ? selectedCategoryData.name : '请选择分类'}
          </span>
          <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Listbox.Button>

        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 w-full glass-card max-h-60 overflow-auto py-1 shadow-lg">
            {flatCategories.map((category) => (
              <Listbox.Option
                key={category.id}
                className={({ active }) =>
                  `relative cursor-pointer select-none py-2 px-3 ${
                    active ? 'bg-white/20 dark:bg-black/20' : ''
                  }`
                }
                value={category.id}
              >
                {({ selected }) => (
                  <div className="flex items-center">
                    {/* 层级缩进 */}
                    <div style={{ marginLeft: `${category.level * 16}px` }} className="flex items-center flex-1">
                      <span
                        className={`block truncate ${
                          selected ? 'font-medium' : 'font-normal'
                        } ${
                          category.level > 0 ? 'text-sm' : ''
                        }`}
                      >
                        {category.level > 0 && '└ '}
                        {category.name}
                      </span>
                      {category.description && (
                        <span className="ml-2 text-xs text-gray-500 dark:text-gray-400 truncate">
                          {category.description}
                        </span>
                      )}
                    </div>
                    {selected && (
                      <CheckIcon className="h-5 w-5 text-blue-500 flex-shrink-0" aria-hidden="true" />
                    )}
                  </div>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
}