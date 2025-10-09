'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { ErrorModal } from '@/components/ui/ErrorModal';
import { SuccessModal } from '@/components/ui/SuccessModal';
import { TokenOverview } from '@/components/admin/tokens/TokenOverview';
import { TokenList } from '@/components/admin/tokens/TokenList';
import { CreateTokenModal } from '@/components/admin/tokens/CreateTokenModal';
import { DistributeTokenModal } from '@/components/admin/tokens/DistributeTokenModal';
import { TokenStatistics } from '@/components/admin/tokens/TokenStatistics';
import { Token, TokenStatistics as TokenTypeStats } from '@/types/token';
import { ApiResponse } from '@/types/api';
import { PlusIcon, ChartBarIcon, CurrencyDollarIcon, ListBulletIcon } from '@heroicons/react/24/outline';

/**
 * 管理端代币管理主页面
 * 
 * 功能包括：
 * 1. 代币概览和统计
 * 2. 代币列表管理
 * 3. 创建新代币
 * 4. 手动分发代币
 * 5. 数据可视化图表
 */
export default function AdminTokensPage() {
  // 状态管理
  const [tokens, setTokens] = useState<Token[]>([]);
  const [tokenStats, setTokenStats] = useState<TokenTypeStats[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  // 模态框状态
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDistributeModal, setShowDistributeModal] = useState(false);
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  
  // 视图状态
  const [activeTab, setActiveTab] = useState<'overview' | 'list' | 'statistics'>('overview');

  /**
   * 加载代币数据
   */
  const loadTokens = async () => {
    try {
      setLoading(true);
      
      // 获取代币列表
      const tokensResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tokens`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });
      
      if (!tokensResponse.ok) {
        throw new Error('获取代币列表失败');
      }
      
      const tokensResult: ApiResponse<Token[]> = await tokensResponse.json();
      
      if (!tokensResult.success) {
        throw new Error('获取代币列表失败');
      }
      
      setTokens(tokensResult.data || []);
      
      // 获取代币统计数据
      const statsPromises = (tokensResult.data || []).map(async (token) => {
        const statsResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tokens/${token.id}/statistics`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
          }
        });
        
        if (statsResponse.ok) {
          const statsResult: ApiResponse<TokenTypeStats> = await statsResponse.json();
          return statsResult.data;
        }
        return null;
      });
      
      const statsResults = await Promise.all(statsPromises);
      setTokenStats(statsResults.filter(Boolean) as TokenTypeStats[]);
      
    } catch (err) {
      console.error('加载代币数据失败:', err);
      setError(err instanceof Error ? err.message : '加载代币数据失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理创建代币成功
   */
  const handleCreateSuccess = (message: string) => {
    setSuccess(message);
    setShowCreateModal(false);
    loadTokens(); // 重新加载数据
  };

  /**
   * 处理分发代币成功
   */
  const handleDistributeSuccess = (message: string) => {
    setSuccess(message);
    setShowDistributeModal(false);
    setSelectedToken(null);
    loadTokens(); // 重新加载数据
  };

  /**
   * 打开分发代币模态框
   */
  const handleDistributeToken = (token: Token) => {
    setSelectedToken(token);
    setShowDistributeModal(true);
  };

  // 初始化加载数据
  useEffect(() => {
    loadTokens();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container-responsive py-6 space-y-6">
      {/* 页面标题和操作按钮 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            代币管理
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            管理内部激励代币的创建、分发和统计
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowCreateModal(true)}
            className="glass-button flex items-center gap-2 text-blue-600 dark:text-blue-400"
          >
            <PlusIcon className="h-5 w-5" />
            创建代币
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <GlassCard className="p-1">
        <div className="flex space-x-1">
          {[
            { key: 'overview', label: '概览', icon: CurrencyDollarIcon },
            { key: 'list', label: '代币列表', icon: ListBulletIcon },
            { key: 'statistics', label: '统计分析', icon: ChartBarIcon }
          ].map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key as any)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200
                ${activeTab === key 
                  ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                  : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-black/10'
                }
              `}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </GlassCard>

      {/* 内容区域 */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <TokenOverview 
            tokens={tokens} 
            onDistributeToken={handleDistributeToken}
          />
        )}
        
        {activeTab === 'list' && (
          <TokenList 
            tokens={tokens} 
            onDistributeToken={handleDistributeToken}
            onRefresh={loadTokens}
          />
        )}
        
        {activeTab === 'statistics' && (
          <TokenStatistics 
            tokens={tokens}
            statistics={tokenStats}
          />
        )}
      </div>

      {/* 模态框 */}
      {showCreateModal && (
        <CreateTokenModal
          onClose={() => setShowCreateModal(false)}
          onSuccess={handleCreateSuccess}
          onError={setError}
        />
      )}

      {showDistributeModal && selectedToken && (
        <DistributeTokenModal
          token={selectedToken}
          onClose={() => {
            setShowDistributeModal(false);
            setSelectedToken(null);
          }}
          onSuccess={handleDistributeSuccess}
          onError={setError}
        />
      )}

      {/* 错误提示 */}
      {error && (
        <ErrorModal
          isOpen={!!error}
          message={error}
          onClose={() => setError(null)}
        />
      )}

      {/* 成功提示 */}
      {success && (
        <SuccessModal
          isOpen={!!success}
          message={success}
          onClose={() => setSuccess(null)}
        />
      )}
    </div>
  );
}