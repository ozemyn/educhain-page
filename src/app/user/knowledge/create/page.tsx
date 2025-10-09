'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';
import { ErrorModal } from '@/components/ui/ErrorModal';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ContentCreateForm } from '@/components/user/knowledge/ContentCreateForm';
import { CreateContentRequest } from '@/types/content';

export default function CreateKnowledgePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (data: CreateContentRequest) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('title', data.title);
      formData.append('content', data.content);
      formData.append('category', data.category);
      formData.append('tags', JSON.stringify(data.tags));

      // 添加附件文件
      if (data.attachments) {
        data.attachments.forEach((file, index) => {
          formData.append('attachments', file);
        });
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || '内容发布失败');
      }

      setSuccess('内容发布成功！等待管理员审核后即可展示。');
      
      // 3秒后跳转到内容列表页面
      setTimeout(() => {
        router.push('/user/knowledge');
      }, 3000);

    } catch (error) {
      console.error('内容发布失败:', error);
      setError(error instanceof Error ? error.message : '内容发布失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container-responsive py-8">
      <div className="max-w-4xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            发布知识内容
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            分享您的知识和经验，为社区贡献有价值的内容
          </p>
        </div>

        {/* 内容发布表单 */}
        <GlassCard className="p-6 sm:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <LoadingSpinner size="lg" />
              <span className="ml-3 text-lg text-gray-600 dark:text-gray-400">
                正在发布内容...
              </span>
            </div>
          ) : (
            <ContentCreateForm onSubmit={handleSubmit} />
          )}
        </GlassCard>

        {/* 发布提示 */}
        <GlassCard className="mt-6 p-4">
          <div className="flex items-start space-x-3">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p className="font-medium mb-1">发布须知：</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>内容将在管理员审核通过后展示</li>
                <li>优质内容将获得更多激励代币奖励</li>
                <li>请确保内容原创且有价值</li>
                <li>支持上传图片、文档等附件（单个文件不超过10MB）</li>
              </ul>
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 错误提示弹窗 */}
      <ErrorModal
        isOpen={!!error}
        onClose={() => setError(null)}
        message={error || ''}
      />

      {/* 成功提示弹窗 */}
      <SuccessModal
        isOpen={!!success}
        onClose={() => setSuccess(null)}
        message={success || ''}
      />
    </div>
  );
}