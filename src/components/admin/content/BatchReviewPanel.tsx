'use client';

import React, { useState } from 'react';
import { GlassCard } from '../../ui/GlassCard';
import { LoadingSpinner } from '../../ui/LoadingSpinner';
import { SuccessModal } from '../../ui/SuccessModal';
import { ErrorModal } from '../../ui/ErrorModal';
import { Content } from '../../../types/content';

interface BatchReviewPanelProps {
  selectedContents: Content[];
  onBatchComplete: () => void;
  onClearSelection: () => void;
}

export const BatchReviewPanel: React.FC<BatchReviewPanelProps> = ({
  selectedContents,
  onBatchComplete,
  onClearSelection
}) => {
  const [loading, setLoading] = useState(false);
  const [batchReason, setBatchReason] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleBatchReview = async (status: 'approved' | 'rejected') => {
    if (selectedContents.length === 0) {
      setErrorMessage('请先选择要批量审核的内容');
      setShowErrorModal(true);
      return;
    }

    if (status === 'rejected' && !batchReason.trim()) {
      setErrorMessage('批量拒绝时必须填写拒绝原因');
      setShowErrorModal(true);
      return;
    }

    setLoading(true);
    try {
      const contentIds = selectedContents.map(content => content.id);
      
      const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'https://api.educhain.cc';
      const response = await fetch(`${backendUrl}/api/admin/content/batch-review`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          // TODO: 添加认证token
          // 'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          contentIds,
          status,
          reason: batchReason.trim() || undefined
        })
      });

      const data = await response.json();
      
      if (data.success) {
        const actionText = status === 'approved' ? '通过' : '拒绝';
        setSuccessMessage(`成功${actionText}了 ${selectedContents.length} 个内容`);
        setShowSuccessModal(true);
        setBatchReason('');
        onBatchComplete();
        onClearSelection();
      } else {
        setErrorMessage(data.message || '批量审核失败');
        setShowErrorModal(true);
      }
    } catch (error) {
      setErrorMessage('网络错误，请重试');
      setShowErrorModal(true);
    } finally {
      setLoading(false);
    }
  };

  if (selectedContents.length === 0) {
    return null;
  }

  return (
    <>
      <GlassCard className="p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-white">
            批量审核 ({selectedContents.length} 个内容)
          </h3>
          <button
            onClick={onClearSelection}
            className="text-gray-400 hover:text-white text-sm"
          >
            清空选择
          </button>
        </div>

        {/* 选中的内容列表 */}
        <div className="mb-4 max-h-32 overflow-y-auto">
          <div className="space-y-2">
            {selectedContents.map((content) => (
              <div
                key={content.id}
                className="flex justify-between items-center p-2 bg-white/5 rounded text-sm"
              >
                <span className="text-white truncate flex-1 mr-2">
                  {content.title}
                </span>
                <span className="text-gray-400 text-xs">
                  {content.authorId}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 批量审核意见 */}
        <div className="mb-4">
          <label className="block text-sm text-gray-300 mb-2">
            批量审核意见
          </label>
          <textarea
            value={batchReason}
            onChange={(e) => setBatchReason(e.target.value)}
            placeholder="请输入批量审核意见（批量拒绝时必填）"
            className="w-full p-3 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:border-blue-400/50 focus:outline-none resize-none"
            rows={3}
          />
        </div>

        {/* 批量操作按钮 */}
        <div className="flex space-x-4">
          <button
            onClick={() => handleBatchReview('approved')}
            disabled={loading}
            className="flex-1 bg-green-500/20 text-green-300 border border-green-400/50 py-3 px-6 rounded-lg hover:bg-green-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <LoadingSpinner message="处理中..." /> : '批量通过'}
          </button>
          
          <button
            onClick={() => handleBatchReview('rejected')}
            disabled={loading}
            className="flex-1 bg-red-500/20 text-red-300 border border-red-400/50 py-3 px-6 rounded-lg hover:bg-red-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {loading ? <LoadingSpinner message="处理中..." /> : '批量拒绝'}
          </button>
        </div>
      </GlassCard>

      {/* 成功提示 */}
      <SuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
        message={successMessage}
      />

      {/* 错误提示 */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="批量审核失败"
        message={errorMessage}
      />
    </>
  );
};