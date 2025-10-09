'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
    ArrowLeftIcon,
    EyeIcon,
    HeartIcon,
    CalendarIcon,
    UserIcon,
    ShareIcon,
    BookmarkIcon,
    PaperClipIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorModal } from '@/components/ui/ErrorModal';
import { ContentRecommendations } from '@/components/user/knowledge/ContentRecommendations';
import { Content } from '@/types/content';

export default function ContentDetailPage() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const contentId = searchParams.get('id');

    const [content, setContent] = useState<Content | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isLiked, setIsLiked] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [likeCount, setLikeCount] = useState(0);

    // 如果没有ID，重定向到知识列表页
    useEffect(() => {
        if (!contentId) {
            router.push('/user/knowledge');
            return;
        }
    }, [contentId, router]);

    // 加载内容详情
    useEffect(() => {
        if (!contentId) return;

        const loadContent = async () => {
            try {
                setIsLoading(true);
                const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/${contentId}`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    },
                });

                if (!response.ok) {
                    throw new Error('加载内容失败');
                }

                const result = await response.json();
                setContent(result.data);
                setIsLiked(result.data.isLiked || false);
                setIsBookmarked(result.data.isBookmarked || false);
                setLikeCount(result.data.likeCount || 0);
            } catch (error) {
                console.error('加载内容失败:', error);
                setError(error instanceof Error ? error.message : '加载内容失败');
            } finally {
                setIsLoading(false);
            }
        };

        loadContent();
    }, [contentId]);

    // 处理点赞
    const handleLike = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/${contentId}/like`, {
                method: isLiked ? 'DELETE' : 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setIsLiked(!isLiked);
                setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
            }
        } catch (error) {
            console.error('点赞操作失败:', error);
        }
    };

    // 处理收藏
    const handleBookmark = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/${contentId}/bookmark`, {
                method: isBookmarked ? 'DELETE' : 'POST',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                setIsBookmarked(!isBookmarked);
            }
        } catch (error) {
            console.error('收藏操作失败:', error);
        }
    };

    if (isLoading) {
        return (
            <div className="container-responsive py-8">
                <div className="flex items-center justify-center py-12">
                    <LoadingSpinner message="加载内容中..." />
                </div>
            </div>
        );
    }

    if (error || !content) {
        return (
            <div className="container-responsive py-8">
                <GlassCard className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                        内容加载失败
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {error || '未找到指定的内容'}
                    </p>
                    <button
                        onClick={() => router.push('/user/knowledge')}
                        className="glass-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                    >
                        返回知识列表
                    </button>
                </GlassCard>
            </div>
        );
    }

    return (
        <div className="container-responsive py-8">
            {/* 返回按钮 */}
            <button
                onClick={() => router.back()}
                className="glass-button mb-6 inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white"
            >
                <ArrowLeftIcon className="h-5 w-5 mr-2" />
                返回
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* 主要内容 */}
                <div className="lg:col-span-3">
                    <GlassCard className="p-8">
                        {/* 内容标题和元信息 */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                                {content.title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-6">
                                <div className="flex items-center">
                                    <UserIcon className="h-4 w-4 mr-1" />
                                    作者ID: {content.authorId}
                                </div>
                                <div className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1" />
                                    {new Date(content.createdAt).toLocaleDateString('zh-CN')}
                                </div>
                                <div className="flex items-center">
                                    <EyeIcon className="h-4 w-4 mr-1" />
                                    {content.viewCount || 0} 次浏览
                                </div>
                            </div>

                            {/* 操作按钮 */}
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handleLike}
                                    className={`glass-button inline-flex items-center px-4 py-2 ${isLiked ? 'text-red-500' : 'text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    {isLiked ? (
                                        <HeartSolidIcon className="h-5 w-5 mr-2" />
                                    ) : (
                                        <HeartIcon className="h-5 w-5 mr-2" />
                                    )}
                                    {likeCount}
                                </button>

                                <button
                                    onClick={handleBookmark}
                                    className={`glass-button inline-flex items-center px-4 py-2 ${isBookmarked ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'
                                        }`}
                                >
                                    <BookmarkIcon className="h-5 w-5 mr-2" />
                                    {isBookmarked ? '已收藏' : '收藏'}
                                </button>

                                <button className="glass-button inline-flex items-center px-4 py-2 text-gray-600 dark:text-gray-400">
                                    <ShareIcon className="h-5 w-5 mr-2" />
                                    分享
                                </button>
                            </div>
                        </div>

                        {/* 内容正文 */}
                        <div className="prose prose-lg max-w-none dark:prose-invert mb-8">
                            <div dangerouslySetInnerHTML={{ __html: content.content }} />
                        </div>

                        {/* 附件 */}
                        {content.attachments && content.attachments.length > 0 && (
                            <div className="border-t border-white/20 dark:border-white/10 pt-6">
                                <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4 flex items-center">
                                    <PaperClipIcon className="h-5 w-5 mr-2" />
                                    附件
                                </h3>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    {content.attachments.map((attachment, index) => (
                                        <a
                                            key={index}
                                            href={attachment.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="glass-button p-4 text-left hover:bg-white/10 dark:hover:bg-white/5"
                                        >
                                            <div className="font-medium text-gray-800 dark:text-white">
                                                {attachment.filename}
                                            </div>
                                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                                {attachment.fileSize && `${(attachment.fileSize / 1024 / 1024).toFixed(2)} MB`}
                                            </div>
                                        </a>
                                    ))}
                                </div>
                            </div>
                        )}
                    </GlassCard>
                </div>

                {/* 侧边栏 - 推荐内容 */}
                <div className="lg:col-span-1">
                    <div className="sticky top-8">
                        <ContentRecommendations currentContentId={contentId || undefined} limit={6} />
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