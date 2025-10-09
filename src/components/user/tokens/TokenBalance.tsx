'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { TokenBalance as TokenBalanceType } from '@/types/token';
import { 
  CurrencyDollarIcon,
  ArrowTrendingUpIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowPathIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

/**
 * 用户代币余额组件
 * 显示用户的所有代币余额和详细信息
 */
export function TokenBalance() {
  const [balances, setBalances] = useState<TokenBalanceType[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [showBalances, setShowBalances] = useState(true);
  const [lastUpdateTime, setLastUpdateTime] = useState<Date>(new Date());
  const [isRealTimeConnected, setIsRealTimeConnected] = useState(true);

  /**
   * 获取用户代币余额数据
   */
  const fetchTokenBalances = async (showLoading = true) => {
    try {
      if (showLoading) {
        setLoading(true);
      } else {
        setRefreshing(true);
      }

      // 获取当前用户信息
      const userData = localStorage.getItem('user');
      if (!userData) {
        console.error('用户未登录');
        return;
      }
      const user = JSON.parse(userData);
      const token = localStorage.getItem('token');

      // 调用后端 API 获取代币余额
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tokens/balance/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('获取代币余额失败');
      }

      const result = await response.json();
      if (result.success && result.data) {
        setBalances(result.data);
      }
      setLastUpdateTime(new Date());
      
    } catch (error) {
      console.error('获取代币余额失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  /**
   * 手动刷新余额
   */
  const handleRefresh = () => {
    fetchTokenBalances(false);
  };

  /**
   * 切换余额显示/隐藏
   */
  const toggleBalanceVisibility = () => {
    setShowBalances(!showBalances);
  };

  /**
   * 计算总价值（这里简化处理，实际应该有汇率转换）
   */
  const calculateTotalValue = () => {
    return balances.reduce((total, balance) => total + balance.balance, 0);
  };

  /**
   * 格式化代币数量显示
   */
  const formatTokenAmount = (amount: number, decimals: number = 8) => {
    if (!showBalances) {
      return '****';
    }
    return amount.toLocaleString('zh-CN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: Math.min(decimals, 4)
    });
  };

  useEffect(() => {
    fetchTokenBalances();
    
    // 设置定时刷新（每30秒）
    const interval = setInterval(() => {
      fetchTokenBalances(false);
    }, 30000);

    // 模拟实时余额更新（WebSocket连接）
    const simulateRealTimeUpdates = () => {
      // 在实际项目中，这里应该是WebSocket连接
      // const ws = new WebSocket('ws://localhost:3001/tokens/realtime');
      // ws.onmessage = (event) => {
      //   const data = JSON.parse(event.data);
      //   if (data.type === 'balance_update') {
      //     setBalances(prevBalances => 
      //       prevBalances.map(balance => 
      //         balance.tokenId === data.tokenId 
      //           ? { ...balance, balance: data.newBalance }
      //           : balance
      //       )
      //     );
      //   }
      // };
      
      // 实际项目中，这里应该通过 WebSocket 接收实时余额更新
      // 暂时不做模拟更新，避免数据不一致
      const updateInterval = null;
      
      return updateInterval;
    };

    const realtimeInterval = simulateRealTimeUpdates();

    return () => {
      clearInterval(interval);
      if (realtimeInterval) clearInterval(realtimeInterval);
    };
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner />
      </div>
    );
  }

  const totalValue = calculateTotalValue();

  return (
    <div className="space-y-6">
      {/* 总览卡片 */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-500/10">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                代币总览
              </h2>
              <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                <span>最后更新: {lastUpdateTime.toLocaleTimeString('zh-CN')}</span>
                <div className="flex items-center gap-1">
                  <div className={`w-2 h-2 rounded-full ${isRealTimeConnected ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className="text-xs">
                    {isRealTimeConnected ? '实时连接' : '连接断开'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBalanceVisibility}
              className="p-2 rounded-lg bg-white/10 dark:bg-black/10 text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-black/20 transition-colors"
              title={showBalances ? '隐藏余额' : '显示余额'}
            >
              {showBalances ? (
                <EyeSlashIcon className="h-4 w-4" />
              ) : (
                <EyeIcon className="h-4 w-4" />
              )}
            </button>
            
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2 rounded-lg bg-white/10 dark:bg-black/10 text-gray-600 dark:text-gray-400 hover:bg-white/20 dark:hover:bg-black/20 transition-colors disabled:opacity-50"
              title="刷新余额"
            >
              <ArrowPathIcon className={`h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-4 rounded-lg bg-white/5 dark:bg-black/5">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              代币种类
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {balances.length}
            </p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-white/5 dark:bg-black/5">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              总价值
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatTokenAmount(totalValue)}
            </p>
          </div>
          
          <div className="text-center p-4 rounded-lg bg-white/5 dark:bg-black/5">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              锁定数量
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatTokenAmount(balances.reduce((total, balance) => total + balance.lockedBalance, 0))}
            </p>
          </div>
        </div>
      </GlassCard>

      {/* 代币余额列表 */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            我的代币
          </h3>
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {balances.length} 种代币
          </span>
        </div>

        {balances.length === 0 ? (
          <GlassCard className="p-12 text-center">
            <CurrencyDollarIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              暂无代币
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              开始参与社区活动，获得您的第一个代币奖励
            </p>
          </GlassCard>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {balances.map((balance) => (
              <GlassCard key={balance.tokenId} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">
                        {balance.token.name}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-600 dark:text-blue-400">
                          {balance.token.symbol}
                        </span>
                        <span className={`
                          text-xs px-2 py-1 rounded-full
                          ${balance.token.status === 'active' 
                            ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                            : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                          }
                        `}>
                          {balance.token.status === 'active' ? '活跃' : '暂停'}
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {balance.lockedBalance > 0 && (
                    <div className="flex items-center gap-1 text-orange-600 dark:text-orange-400">
                      <InformationCircleIcon className="h-4 w-4" />
                      <span className="text-xs">有锁定</span>
                    </div>
                  )}
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      可用余额
                    </span>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      {formatTokenAmount(balance.balance, balance.token.decimals)} {balance.token.symbol}
                    </span>
                  </div>
                  
                  {balance.lockedBalance > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        锁定余额
                      </span>
                      <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                        {formatTokenAmount(balance.lockedBalance, balance.token.decimals)} {balance.token.symbol}
                      </span>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>总余额</span>
                    <span>
                      {formatTokenAmount(balance.balance + balance.lockedBalance, balance.token.decimals)} {balance.token.symbol}
                    </span>
                  </div>
                </div>

                {/* 代币分发进度 */}
                <div className="mt-4 pt-4 border-t border-white/10 dark:border-white/5">
                  <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-2">
                    <span>全网分发进度</span>
                    <span>
                      {((balance.token.distributedSupply / balance.token.totalSupply) * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div 
                      className="bg-gradient-to-r from-blue-500 to-purple-500 h-1.5 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${Math.min((balance.token.distributedSupply / balance.token.totalSupply) * 100, 100)}%` 
                      }}
                    />
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>

      {/* 提示信息 */}
      <GlassCard className="p-4">
        <div className="flex items-start gap-3">
          <InformationCircleIcon className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
          <div className="text-sm text-gray-600 dark:text-gray-400">
            <p className="font-medium text-gray-900 dark:text-white mb-1">
              关于代币余额
            </p>
            <ul className="space-y-1 text-xs">
              <li>• 代币余额每30秒自动更新一次</li>
              <li>• 锁定余额是暂时不可使用的代币，通常用于质押或奖励发放</li>
              <li>• 所有代币交易都会记录在区块链上，确保透明和可追溯</li>
              <li>• 点击眼睛图标可以隐藏/显示余额数量</li>
            </ul>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}