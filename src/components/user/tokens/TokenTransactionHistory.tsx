'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { TokenTransaction } from '@/types/token';
import { 
  ClockIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  FunnelIcon,
  MagnifyingGlassIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ClockIcon as PendingIcon
} from '@heroicons/react/24/outline';

/**
 * 代币交易历史组件
 * 显示用户的代币交易记录，支持筛选和搜索
 */
export function TokenTransactionHistory() {
  const [transactions, setTransactions] = useState<TokenTransaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'reward' | 'transfer' | 'burn'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'confirmed' | 'failed'>('all');

  /**
   * 获取交易历史数据
   */
  const fetchTransactionHistory = async (page = 1) => {
    try {
      setLoading(true);
      
      // 获取当前用户信息
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.error('用户未登录');
        return;
      }
      const user = JSON.parse(userData);
      const token = localStorage.getItem('token');

      // 构建查询参数
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '10'
      });
      
      if (filterType !== 'all') {
        params.append('transactionType', filterType);
      }
      
      if (filterStatus !== 'all') {
        params.append('status', filterStatus);
      }

      // 调用后端 API 获取交易历史
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tokens/transactions/${user.id}?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('获取交易历史失败');
      }

      const result = await response.json();
      if (result.success && result.data) {
        let filteredTransactions = result.data.transactions.map((tx: any) => ({
          ...tx,
          createdAt: new Date(tx.createdAt)
        }));

        // 应用搜索筛选
        if (searchTerm) {
          filteredTransactions = filteredTransactions.filter((tx: TokenTransaction) => 
            tx.reason?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tx.transactionHash?.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }

        setTransactions(filteredTransactions);
        setTotalPages(Math.ceil(result.data.total / 10));
      }
      
    } catch (error) {
      console.error('获取交易历史失败:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 获取交易类型显示文本
   */
  const getTransactionTypeText = (type: string) => {
    switch (type) {
      case 'reward': return '奖励';
      case 'transfer': return '转账';
      case 'burn': return '销毁';
      default: return type;
    }
  };

  /**
   * 获取交易状态显示组件
   */
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed':
        return <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />;
      case 'failed':
        return <ExclamationCircleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />;
      case 'pending':
      default:
        return <PendingIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />;
    }
  };

  /**
   * 获取交易状态文本
   */
  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return '已确认';
      case 'failed': return '失败';
      case 'pending': return '待确认';
      default: return status;
    }
  };

  /**
   * 格式化代币数量
   */
  const formatAmount = (amount: number) => {
    return amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4
    });
  };

  /**
   * 格式化时间
   */
  const formatDate = (date: Date) => {
    return date.toLocaleString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  useEffect(() => {
    fetchTransactionHistory(currentPage);
  }, [currentPage, filterType, filterStatus, searchTerm]);

  return (
    <div className="space-y-6">
      {/* 筛选和搜索区域 */}
      <GlassCard className="p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* 搜索框 */}
          <div className="flex-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="搜索交易记录..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="
                  w-full pl-10 pr-4 py-2 rounded-lg border-0
                  bg-white/10 dark:bg-black/10
                  text-gray-900 dark:text-white
                  placeholder-gray-500 dark:placeholder-gray-400
                  focus:ring-2 focus:ring-blue-500/50 focus:bg-white/20 dark:focus:bg-black/20
                  transition-all duration-200
                "
              />
            </div>
          </div>

          {/* 筛选器 */}
          <div className="flex gap-3">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="
                px-3 py-2 rounded-lg border-0
                bg-white/10 dark:bg-black/10
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500/50
                transition-all duration-200
              "
            >
              <option value="all">所有类型</option>
              <option value="reward">奖励</option>
              <option value="transfer">转账</option>
              <option value="burn">销毁</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="
                px-3 py-2 rounded-lg border-0
                bg-white/10 dark:bg-black/10
                text-gray-900 dark:text-white
                focus:ring-2 focus:ring-blue-500/50
                transition-all duration-200
              "
            >
              <option value="all">所有状态</option>
              <option value="confirmed">已确认</option>
              <option value="pending">待确认</option>
              <option value="failed">失败</option>
            </select>
          </div>
        </div>
      </GlassCard>

      {/* 交易历史列表 */}
      <GlassCard className="overflow-hidden">
        <div className="p-6 border-b border-white/10 dark:border-white/5">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              交易历史
            </h3>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              共 {transactions.length} 条记录
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner />
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-12 text-center">
            <ClockIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              暂无交易记录
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              开始参与社区活动，获得您的第一笔代币奖励
            </p>
          </div>
        ) : (
          <div className="divide-y divide-white/10 dark:divide-white/5">
            {transactions.map((transaction) => (
              <div key={transaction.id} className="p-6 hover:bg-white/5 dark:hover:bg-black/5 transition-colors">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    {/* 交易类型图标 */}
                    <div className={`
                      p-2 rounded-lg
                      ${transaction.transactionType === 'reward' 
                        ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                        : transaction.transactionType === 'transfer'
                        ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                        : 'bg-red-500/20 text-red-600 dark:text-red-400'
                      }
                    `}>
                      {transaction.transactionType === 'reward' ? (
                        <ArrowDownIcon className="h-4 w-4" />
                      ) : (
                        <ArrowUpIcon className="h-4 w-4" />
                      )}
                    </div>

                    {/* 交易详情 */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-gray-900 dark:text-white">
                          {getTransactionTypeText(transaction.transactionType)}
                        </span>
                        <span className={`
                          text-xs px-2 py-1 rounded-full
                          ${transaction.transactionType === 'reward' 
                            ? 'bg-green-500/20 text-green-600 dark:text-green-400'
                            : transaction.transactionType === 'transfer'
                            ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                            : 'bg-red-500/20 text-red-600 dark:text-red-400'
                          }
                        `}>
                          +{formatAmount(transaction.amount)}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {transaction.reason || '无备注'}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>{formatDate(transaction.createdAt)}</span>
                        {transaction.transactionHash && (
                          <span className="font-mono">
                            {transaction.transactionHash.slice(0, 10)}...
                          </span>
                        )}
                        {transaction.blockHeight && (
                          <span>区块 #{transaction.blockHeight}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* 状态和金额 */}
                  <div className="text-right">
                    <div className="flex items-center justify-end gap-2 mb-1">
                      {getStatusIcon(transaction.status)}
                      <span className={`
                        text-sm font-medium
                        ${transaction.status === 'confirmed' 
                          ? 'text-green-600 dark:text-green-400'
                          : transaction.status === 'failed'
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-yellow-600 dark:text-yellow-400'
                        }
                      `}>
                        {getStatusText(transaction.status)}
                      </span>
                    </div>
                    
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      +{formatAmount(transaction.amount)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 分页 */}
        {!loading && transactions.length > 0 && totalPages > 1 && (
          <div className="p-6 border-t border-white/10 dark:border-white/5">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-500 dark:text-gray-400">
                第 {currentPage} 页，共 {totalPages} 页
              </span>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="
                    px-3 py-1 rounded-lg text-sm
                    bg-white/10 dark:bg-black/10
                    text-gray-600 dark:text-gray-400
                    hover:bg-white/20 dark:hover:bg-black/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors
                  "
                >
                  上一页
                </button>
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="
                    px-3 py-1 rounded-lg text-sm
                    bg-white/10 dark:bg-black/10
                    text-gray-600 dark:text-gray-400
                    hover:bg-white/20 dark:hover:bg-black/20
                    disabled:opacity-50 disabled:cursor-not-allowed
                    transition-colors
                  "
                >
                  下一页
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}