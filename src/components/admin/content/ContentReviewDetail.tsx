'use client';

import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { SuccessModal } from '../../ui/SuccessModal';
import { ErrorModal } from '../../ui/ErrorModal';
import { Content } from '../../../types/content';

interface ContentReviewDetailProps {
  content: Content | null;
  onReviewComplete: () => void;
}

export const ContentReviewDetail: React.FC<ContentReviewDetailProps> = ({
  content,
  onReviewComplete
}) => {
  const [loading, setLoading] = useState(false);
  const [reviewReason, setReviewReason] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!content) {
    return (
      <GlassCard className="p-6">
        <div className="text-center text-gray-400 py-12">
          请从左侧选择要审核的内容
        </div>
      </GlassCard>
    );
  }

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (status === 'rejected' && !reviewReason.trim()) {
      setErrorMessage('拒绝内容时必须填写拒绝原因');
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    try {
      // 获取存储在localStorage中的管理员令牌
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setErrorMessage('未找到认证令牌，请重新登录');
        setShowErrorModal(true);
        setLoading(false);
        return;
      }

      // 使用完整API URL
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/${content.id}/review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          status,
          reason: reviewReason.trim() || undefined
        })
      });

      const data = await response.json();
      
      if (data.success) {
        setShowSuccessModal(true);
        setReviewReason('');
        onReviewComplete();
      } else {
        setErrorMessage(data.message || '审核失败');
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage('网络错误，请重试');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'approved': return 'text-green-400 bg-green-400/10';
      case 'rejected': return 'text-red-400 bg-red-400/10';
      default: return 'text-gray-400 bg-gray-400/10';
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

  return (
    <>
      <GlassCard className="p-6">
        <div className="mb-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-white">{content.title}</h2>
            <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(content.status)}`}>
              {getStatusText(content.status)}
            </span>
          </div>
          
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300 mb-4">
            <div>
              <span className="text-gray-400">作者ID:</span> {content.authorId}
            </div>
            <div>
              <span className="text-gray-400">创建时间:</span> {new Date(content.createdAt).toLocaleString()}
            </div>
            <div>
              <span className="text-gray-400">浏览次数:</span> {content.viewCount}
            </div>
            <div>
              <span className="text-gray-400">点赞次数:</span> {content.likeCount}
            </div>
          </div>

          {/* 标签 */}
          {content.tags && content.tags.length > 0 && (
            <div className="mb-4">
              <span className="text-gray-400 text-sm">标签:</span>
              <div className="flex flex-wrap gap-2 mt-1">
                {content.tags.map((tag) => (
                  <span
                    key={tag.id}
                    className="px-2 py-1 bg-blue-500/20 text-blue-300 rounded text-xs"
                  >
                    {tag.name}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* 内容预览 */}
        <div className="mb-6">
          <h3 className="text-lg font-medium text-white mb-3">内容预览</h3>
          <div className="bg-black/20 rounded-lg p-4 max-h-64 overflow-y-auto">
            <div 
              className="text-gray-300 prose prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: content.content }}
            />
          </div>
        </div>

        {/* 附件 */}
        {content.attachments && content.attachments.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-medium text-white mb-3">附件</h3>
            <div className="space-y-2">
              {content.attachments.map((attachment) => (
                <div
                  key={attachment.id}
                  className="flex items-center justify-between p-3 bg-white/5 rounded-lg"
                >
                  <div>
                    <span className="text-white">{attachment.filename}</span>
                    <span className="text-gray-400 text-sm ml-2">
                      ({(attachment.fileSize / 1024 / 1024).toFixed(2)} MB)
                    </span>
                  </div>
                  <a
                    href={attachment.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    下载
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 审核操作 */}
        {content.status === 'pending' && (
          <div className="border-t border-white/10 pt-6">
            <h3 className="text-lg font-medium text-white mb-3">审核操作</h3>
            
            <div className="mb-4">
              <label className="block text-sm text-gray-300 mb-2">
                审核意见
              </label>
              <textarea
                value={reviewReason}
                onChange={(e) => setReviewReason(e.target.value)}
                placeholder="请输入审核意见（拒绝时必填）"
                className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-400/50 focus:outline-none resize-none"
                rows={3}
              />
            </div>

            <div className="flex space-x-4">
              <button
                onClick={() => handleReview('approved')}
                disabled={loading}
                className="flex-1 bg-green-500/20 text-green-300 border border-green-400/50 py-3 px-6 rounded-lg hover:bg-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  处理中...
                </div> : '通过审核'}
              </button>
              
              <button
                onClick={() => handleReview('rejected')}
                disabled={loading}
                className="flex-1 bg-red-500/20 text-red-300 border border-red-400/50 py-3 px-6 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <div className="flex items-center justify-center">
                  <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-2"></div>
                  处理中...
                </div> : '拒绝审核'}
              </button>
            </div>
          </div>
        )}
      </GlassCard>

      {/* 成功提示 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message="内容审核操作已完成"
      />

      {/* 错误提示 */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="审核失败"
        message={errorMessage}
      />
    </>
  );
};