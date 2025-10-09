'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { CreateContentRequest, Category, Tag } from '@/types/content';
import { RichTextEditor } from './RichTextEditor';
import { FileUpload } from './FileUpload';
import { CategorySelector } from './CategorySelector';
import { TagSelector } from './TagSelector';

// 表单验证规则
const contentSchema = z.object({
  title: z.string()
    .min(5, '标题至少需要5个字符')
    .max(100, '标题不能超过100个字符'),
  content: z.string()
    .min(50, '内容至少需要50个字符')
    .max(50000, '内容不能超过50000个字符'),
  category: z.string()
    .min(1, '请选择内容分类'),
  tags: z.array(z.string())
    .min(1, '请至少添加一个标签')
    .max(10, '标签数量不能超过10个'),
});

type ContentFormData = z.infer<typeof contentSchema>;

interface ContentCreateFormProps {
  onSubmit: (data: CreateContentRequest) => void;
}

export function ContentCreateForm({ onSubmit }: ContentCreateFormProps) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingTags, setIsLoadingTags] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    setValue,
    watch,
    trigger,
  } = useForm<ContentFormData>({
    resolver: zodResolver(contentSchema),
    mode: 'onChange',
    defaultValues: {
      title: '',
      content: '',
      category: '',
      tags: [],
    },
  });

  const watchedTitle = watch('title');
  const watchedContent = watch('content');

  // 加载分类列表
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/categories/list`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (response.ok) {
          const result = await response.json();
          setCategories(result.data || []);
        }
      } catch (error) {
        console.error('加载分类失败:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    loadCategories();
  }, []);

  // 搜索标签
  const searchTags = async (query: string) => {
    if (!query.trim()) {
      setTags([]);
      return;
    }

    setIsLoadingTags(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/tags/list?search=${encodeURIComponent(query)}&limit=20`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (response.ok) {
        const result = await response.json();
        setTags(result.data || []);
      }
    } catch (error) {
      console.error('搜索标签失败:', error);
    } finally {
      setIsLoadingTags(false);
    }
  };

  // 处理表单提交
  const handleFormSubmit = (data: ContentFormData) => {
    // 验证附件大小
    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const oversizedFiles = attachments.filter(file => file.size > maxFileSize);
    
    if (oversizedFiles.length > 0) {
      alert(`以下文件超过10MB限制：${oversizedFiles.map(f => f.name).join(', ')}`);
      return;
    }

    // 验证附件总数
    if (attachments.length > 10) {
      alert('附件数量不能超过10个');
      return;
    }

    onSubmit({
      ...data,
      attachments,
    });
  };

  // 处理内容变化
  const handleContentChange = (content: string) => {
    setValue('content', content);
    trigger('content');
  };

  // 处理分类选择
  const handleCategoryChange = (categoryId: string) => {
    setValue('category', categoryId);
    trigger('category');
  };

  // 处理标签选择
  const handleTagsChange = (selectedTags: string[]) => {
    setValue('tags', selectedTags);
    trigger('tags');
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      {/* 标题输入 */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          标题 <span className="text-red-500">*</span>
        </label>
        <input
          {...register('title')}
          type="text"
          id="title"
          className="glass-input w-full text-gray-900 dark:text-white"
          placeholder="请输入内容标题（5-100个字符）"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-500">{errors.title.message}</p>
        )}
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {watchedTitle.length}/100
        </div>
      </div>

      {/* 分类选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          分类 <span className="text-red-500">*</span>
        </label>
        <CategorySelector
          categories={categories}
          selectedCategory={watch('category')}
          onCategoryChange={handleCategoryChange}
          isLoading={isLoadingCategories}
        />
        {errors.category && (
          <p className="mt-1 text-sm text-red-500">{errors.category.message}</p>
        )}
      </div>

      {/* 标签选择 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          标签 <span className="text-red-500">*</span>
        </label>
        <TagSelector
          tags={tags}
          selectedTags={watch('tags')}
          onTagsChange={handleTagsChange}
          onSearch={searchTags}
          isLoading={isLoadingTags}
        />
        {errors.tags && (
          <p className="mt-1 text-sm text-red-500">{errors.tags.message}</p>
        )}
      </div>

      {/* 内容编辑器 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          内容 <span className="text-red-500">*</span>
        </label>
        <RichTextEditor
          value={watchedContent}
          onChange={handleContentChange}
          placeholder="请输入内容详情，支持富文本格式（至少50个字符）"
        />
        {errors.content && (
          <p className="mt-1 text-sm text-red-500">{errors.content.message}</p>
        )}
        <div className="mt-1 text-xs text-gray-500 dark:text-gray-400 text-right">
          {watchedContent.length}/50000
        </div>
      </div>

      {/* 文件上传 */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          附件（可选）
        </label>
        <FileUpload
          files={attachments}
          onFilesChange={setAttachments}
          maxFiles={10}
          maxFileSize={10 * 1024 * 1024} // 10MB
          acceptedTypes={[
            'image/*',
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
          ]}
        />
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
          支持图片、PDF、Office文档等格式，单个文件不超过10MB，最多10个文件
        </p>
      </div>

      {/* 提交按钮 */}
      <div className="flex justify-end space-x-4 pt-6 border-t border-white/20 dark:border-white/10">
        <button
          type="button"
          className="glass-button px-6 py-2 text-gray-700 dark:text-gray-300"
          onClick={() => window.history.back()}
        >
          取消
        </button>
        <button
          type="submit"
          disabled={!isValid}
          className={`glass-button px-6 py-2 text-white font-medium ${
            isValid
              ? 'bg-blue-500 hover:bg-blue-600 focus:ring-2 focus:ring-blue-500'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          发布内容
        </button>
      </div>
    </form>
  );
}