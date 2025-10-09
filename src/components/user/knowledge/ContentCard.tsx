'use client';

import Link from 'next/link';
import { 
  EyeIcon, 
  HeartIcon, 
  CalendarIcon, 
  UserIcon,
  DocumentTextIcon,
  PaperClipIcon
} from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';
import { SearchHighlight } from './SearchHighlight';
import { Content } from '@/types/content';

interface ContentCardProps {
  content: Content;
  showAuthor?: boolean;
  compact?: boolean;
  searchQuery?: string;
}

export function ContentCard({ content, showAuthor = false, compact = false, searchQuery }: ContentCardProps) {
  // 格式化日期
  const formatDate = (date: Date) => {
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - new Date(date).getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '今天';
    if (diffDays === 2) return '昨天';
    if (diffDays <= 7) return `${diffDays}天前`;
    if (diffDays <= 30) return `${Math.ceil(diffDays / 7)}周前`;
    if (diffDays <= 365) return `${Math.ceil(diffDays / 30)}个月前`;
    return `${Math.ceil(diffDays / 365)}年前`;
  };

  // 获取状态颜色
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'text-green-600 dark:text-green-400';
      case 'pending':
        return 'text-yellow-600 dark:text-yellow-400';
      case 'rejected':
        return 'text-red-600 dark:text-red-400';
      case 'draft':
        return 'text-gray-600 dark:text-gray-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  // 获取状态文本
  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved':
        return '已发布';
      case 'pending':
        return '待审核';
      case 'rejected':
        return '已拒绝';
      case 'draft':
        return '草稿';
      default:
        return status;
    }
  };

  if (compact) {
    return (
      <Link href={`/user/knowledge/detail?id=${content.id}`} className="block group">
        <div className="glass-card p-4 hover:scale-105 transition-all duration-200">
          <div className="flex items-start space-x-3">
            <DocumentTextIcon className="h-5 w-5 text-blue-500 mt-1 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 dark:text-white line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                <SearchHighlight text={content.title} searchQuery={searchQuery} />
              </h4>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500 dark:text-gray-400">
                <div className="flex items-center">
                  <EyeIcon className="h-3 w-3 mr-1" />
                  <span>{content.viewCount}</span>
                </div>
                <div className="flex items-center">
                  <HeartIcon className="h-3 w-3 mr-1" />
                  <span>{content.likeCount}</span>
                </div>
                <span>{formatDate(content.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <GlassCard className="p-6 hover:scale-105 transition-all duration-300 group">
      <Link href={`/user/knowledge/detail?id=${content.id}`}>
        <div className="space-y-4">
          {/* 状态标识 */}
          {content.status !== 'approved' && (
            <div className="flex justify-end">
              <span className={`text-xs px-2 py-1 rounded-full bg-white/20 dark:bg-black/20 ${getStatusColor(content.status)}`}>
                {getStatusText(content.status)}
              </span>
            </div>
          )}

          {/* 标题 */}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
            <SearchHighlight text={content.title} searchQuery={searchQuery} />
          </h3>

          {/* 摘要 */}
          {content.summary && (
            <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3">
              <SearchHighlight text={content.summary} searchQuery={searchQuery} />
            </p>
          )}

          {/* 标签 */}
          {content.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {content.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag.id}
                  className="px-2 py-1 text-xs rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                >
                  {tag.name}
                </span>
              ))}
              {content.tags.length > 3 && (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                  +{content.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 附件指示器 */}
          {content.attachments.length > 0 && (
            <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
              <PaperClipIcon className="h-4 w-4 mr-1" />
              <span>{content.attachments.length} 个附件</span>
            </div>
          )}

          {/* 元信息 */}
          <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 pt-2 border-t border-white/10 dark:border-white/5">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <EyeIcon className="h-4 w-4 mr-1" />
                <span>{content.viewCount} 浏览</span>
              </div>
              <div className="flex items-center">
                <HeartIcon className="h-4 w-4 mr-1" />
                <span>{content.likeCount} 点赞</span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {showAuthor && (
                <div className="flex items-center">
                  <UserIcon className="h-4 w-4 mr-1" />
                  <span>作者ID: {content.authorId.slice(0, 8)}...</span>
                </div>
              )}
              <div className="flex items-center">
                <CalendarIcon className="h-4 w-4 mr-1" />
                <span>{formatDate(content.createdAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </GlassCard>
  );
}