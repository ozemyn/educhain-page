'use client';

import React, { useState, useCallback } from 'react';
import { ContentReviewList } from '../../../components/admin/content/ContentReviewList';
import { ContentReviewDetail } from '../../../components/admin/content/ContentReviewDetail';
import { BatchReviewPanel } from '../../../components/admin/content/BatchReviewPanel';
import { ReviewHistory } from '../../../components/admin/content/ReviewHistory';
import { ReviewStats } from '../../../components/admin/content/ReviewStats';
import { ContentQualityScore } from '../../../components/admin/content/ContentQualityScore';
import { Content } from '../../../types/content';

export default function ContentReviewPage() {
  const [selectedContent, setSelectedContent] = useState<Content | null>(null);
  const [selectedContents, setSelectedContents] = useState<Content[]>([]);
  const [activeTab, setActiveTab] = useState<'review' | 'history' | 'stats'>('review');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleSelectContent = useCallback((content: Content) => {
    setSelectedContent(content);
  }, []);

  const handleBatchSelect = useCallback((content: Content, selected: boolean) => {
    setSelectedContents(prev => {
      if (selected) {
        return [...prev, content];
      } else {
        return prev.filter(c => c.id !== content.id);
      }
    });
  }, []);

  const handleReviewComplete = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
    // 如果当前选中的内容已被审核，清空选择
    if (selectedContent && selectedContent.status === 'pending') {
      setSelectedContent(null);
    }
  }, [selectedContent]);

  const handleBatchComplete = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleClearSelection = useCallback(() => {
    setSelectedContents([]);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 p-6">
      <div className="max-w-7xl mx-auto">
        {/* 页面标题 */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">内容审核管理</h1>
          <p className="text-gray-400">管理和审核用户提交的知识内容</p>
        </div>

        {/* 标签页导航 */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white/5 p-1 rounded-lg w-fit">
            {[
              { key: 'review', label: '内容审核', icon: '📝' },
              { key: 'history', label: '审核历史', icon: '📋' },
              { key: 'stats', label: '统计分析', icon: '📊' }
            ].map(({ key, label, icon }) => (
              <button
                key={key}
                onClick={() => setActiveTab(key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  activeTab === key
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-400/50'
                    : 'text-gray-300 hover:bg-white/10'
                }`}
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 内容区域 */}
        {activeTab === 'review' && (
          <>
            {/* 批量审核面板 */}
            <BatchReviewPanel
              selectedContents={selectedContents}
              onBatchComplete={handleBatchComplete}
              onClearSelection={handleClearSelection}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* 左侧：内容列表 */}
              <div className="lg:col-span-1">
                <ContentReviewList
                  key={refreshTrigger}
                  onSelectContent={handleSelectContent}
                  selectedContentId={selectedContent?.id}
                />
              </div>

              {/* 中间：内容详情和审核 */}
              <div className="lg:col-span-1">
                <ContentReviewDetail
                  content={selectedContent}
                  onReviewComplete={handleReviewComplete}
                />
              </div>

              {/* 右侧：质量评分 */}
              <div className="lg:col-span-1">
                <ContentQualityScore
                  content={selectedContent}
                />
              </div>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="lg:col-span-1">
              <ReviewHistory />
            </div>
            <div className="lg:col-span-1">
              {selectedContent && (
                <ReviewHistory contentId={selectedContent.id} />
              )}
            </div>
          </div>
        )}

        {activeTab === 'stats' && (
          <ReviewStats />
        )}
      </div>
    </div>
  );
}