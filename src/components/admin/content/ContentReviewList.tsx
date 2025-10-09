'use client';

import React, { useState, useEffect } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { Content } from '../../../types/content';

interface ContentReviewListProps {
  onSelectContent: (content: Content) => void;
  selectedContentId?: string;
}

export const ContentReviewList: React.FC<ContentReviewListProps> = ({
  onSelectContent,
  selectedContentId
}) => {
  const [contents, setContents] = useState<Content[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('pending');

  useEffect(() => {
    fetchContents();
  }, [filter]);

  const fetchContents = async () => {
    setLoading(true);
    try {
      // 使用完整API URL
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/content/review?status=${filter}`, {
        headers: {
          'Content-Type': 'application/json',
          // TODO: 添加认证token
          // 'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (data.success) {
        setContents(data.data.contents || []);
      }
    } catch (error) {
      console.error('获取内容列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400';
      case 'approved': return 'text-green-400';
      case 'rejected': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '待审核';
      case 'approved': return '已通过';
      case 'rejected': return '已拒绝';
      default: return '草稿';
    }
  };

  if (loading) {
    return (
      <GlassCard className="p-6">
        <LoadingSpinner />
      </GlassCard>
    );
  }

  return (
    <GlassCard className="p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-white mb-4">内容审核列表</h2>
        
        {/* 状态筛选 */}
        <div className="flex space-x-2 mb-4">
          {[
            { key: 'all', label: '全部' },
            { key: 'pending', label: '待审核' },
            { key: 'approved', label: '已通过' },
            { key: 'rejected', label: '已拒绝' }
          ].map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setFilter(key as any)}
              className={`px-4 py-2 rounded-lg transition-all ${
                filter === key
                  ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                  : 'bg-white/5 text-gray-300 hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* 内容列表 */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {contents.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            暂无{filter === 'all' ? '' : getStatusText(filter)}内容
          </div>
        ) : (
          contents.map((content) => (
            <div
              key={content.id}
              onClick={() => onSelectContent(content)}
              className={`p-4 rounded-lg cursor-pointer transition-all ${
                selectedContentId === content.id
                  ? 'bg-blue-500/20 border border-blue-400/50'
                  : 'bg-white/5 hover:bg-white/10'
              }`}
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-medium text-white truncate flex-1 mr-2">
                  {content.title}
                </h3>
                <span className={`text-sm ${getStatusColor(content.status)}`}>
                  {getStatusText(content.status)}
                </span>
              </div>
              
              <p className="text-gray-300 text-sm mb-2 line-clamp-2">
                {content.summary || content.content.substring(0, 100) + '...'}
              </p>
              
              <div className="flex justify-between items-center text-xs text-gray-400">
                <span>作者ID: {content.authorId}</span>
                <span>{new Date(content.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
};