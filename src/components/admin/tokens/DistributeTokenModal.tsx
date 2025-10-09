'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Token, DistributeTokenRequest } from '@/types/token';
import { ApiResponse } from '@/types/api';
import { 
  XMarkIcon, 
  MagnifyingGlassIcon,
  UserIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface DistributeTokenModalProps {
  token: Token;
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}

interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
}

/**
 * 分发代币模态框组件
 * 提供手动分发代币给用户的界面
 */
export function DistributeTokenModal({ token, onClose, onSuccess, onError }: DistributeTokenModalProps) {
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [formData, setFormData] = useState<DistributeTokenRequest>({
    userId: '',
    tokenId: token.id,
    amount: 0,
    reason: ''
  });

  /**
   * 搜索用户
   */
  const searchUsers = async (query: string) => {
    if (!query.trim()) {
      setUsers([]);
      return;
    }

    try {
      setSearchLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users?search=${encodeURIComponent(query)}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        }
      });

      if (!response.ok) {
        throw new Error('搜索用户失败');
      }

      const result: ApiResponse<{ users: User[] }> = await response.json();
      
      if (result.success && result.data) {
        setUsers(result.data.users || []);
      } else {
        setUsers([]);
      }
      
    } catch (error) {
      console.error('搜索用户失败:', error);
      setUsers([]);
    } finally {
      setSearchLoading(false);
    }
  };

  /**
   * 处理搜索输入变化
   */
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(searchQuery);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  /**
   * 选择用户
   */
  const selectUser = (user: User) => {
    setSelectedUser(user);
    setFormData(prev => ({
      ...prev,
      userId: user.id
    }));
    setSearchQuery(user.username);
    setUsers([]);
  };

  /**
   * 处理表单字段变化
   */
  const handleFieldChange = (field: keyof DistributeTokenRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * 表单验证
   */
  const validateForm = (): string | null => {
    if (!selectedUser) {
      return '请选择要分发代币的用户';
    }
    
    if (formData.amount <= 0) {
      return '分发数量必须大于0';
    }
    
    if (formData.amount > (token.totalSupply - token.distributedSupply)) {
      return '分发数量超过剩余供应量';
    }
    
    if (!formData.reason.trim()) {
      return '请填写分发原因';
    }
    
    return null;
  };

  /**
   * 提交表单
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateForm();
    if (validationError) {
      onError(validationError);
      return;
    }
    
    try {
      setLoading(true);
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tokens/distribute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('分发代币失败');
      }
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error('分发代币失败');
      }
      
      onSuccess(`成功向 ${selectedUser?.username} 分发 ${formData.amount} ${token.symbol}！`);
      
    } catch (error) {
      console.error('分发代币失败:', error);
      onError(error instanceof Error ? error.message : '分发代币失败');
    } finally {
      setLoading(false);
    }
  };

  const remainingSupply = token.totalSupply - token.distributedSupply;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <GlassCard className="w-full max-w-2xl">
        <form onSubmit={handleSubmit}>
          {/* 模态框头部 */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-white/5">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                分发代币
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                手动分发 {token.name} ({token.symbol}) 给用户
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-500/20 text-gray-600 dark:text-gray-400 hover:bg-gray-500/30 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* 代币信息 */}
            <GlassCard className="p-4 bg-blue-500/10">
              <div className="flex items-center gap-3 mb-2">
                <CurrencyDollarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="font-medium text-gray-900 dark:text-white">
                  {token.name} ({token.symbol})
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600 dark:text-gray-400">剩余供应量:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {remainingSupply.toLocaleString()}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600 dark:text-gray-400">已分发:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-white">
                    {token.distributedSupply.toLocaleString()}
                  </span>
                </div>
              </div>
            </GlassCard>

            {/* 用户搜索 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                选择用户 *
              </label>
              <div className="relative">
                <div className="relative">
                  <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      if (selectedUser && e.target.value !== selectedUser.username) {
                        setSelectedUser(null);
                        setFormData(prev => ({ ...prev, userId: '' }));
                      }
                    }}
                    className="glass-input w-full pl-10"
                    placeholder="搜索用户名或邮箱..."
                    required
                  />
                  {searchLoading && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <LoadingSpinner size="sm" />
                    </div>
                  )}
                </div>

                {/* 搜索结果下拉列表 */}
                {users.length > 0 && !selectedUser && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/20 dark:border-white/10 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                    {users.map((user) => (
                      <button
                        key={user.id}
                        type="button"
                        onClick={() => selectUser(user)}
                        className="w-full flex items-center gap-3 p-3 hover:bg-white/50 dark:hover:bg-gray-700/50 transition-colors text-left"
                      >
                        <div className="flex-shrink-0">
                          {user.avatar ? (
                            <img
                              src={user.avatar}
                              alt={user.username}
                              className="h-8 w-8 rounded-full"
                            />
                          ) : (
                            <div className="h-8 w-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center">
                              <UserIcon className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 dark:text-white truncate">
                            {user.username}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                            {user.email}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 已选择的用户 */}
              {selectedUser && (
                <div className="mt-3 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      {selectedUser.avatar ? (
                        <img
                          src={selectedUser.avatar}
                          alt={selectedUser.username}
                          className="h-8 w-8 rounded-full"
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
                          <UserIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedUser.username}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {selectedUser.email}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 分发数量 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                分发数量 *
              </label>
              <input
                type="number"
                value={formData.amount}
                onChange={(e) => handleFieldChange('amount', parseFloat(e.target.value) || 0)}
                className="glass-input w-full"
                min="0"
                max={remainingSupply}
                step="0.01"
                placeholder="输入分发数量"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                最大可分发: {remainingSupply.toLocaleString()} {token.symbol}
              </p>
            </div>

            {/* 分发原因 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                分发原因 *
              </label>
              <textarea
                value={formData.reason}
                onChange={(e) => handleFieldChange('reason', e.target.value)}
                className="glass-input w-full h-24 resize-none"
                placeholder="请说明分发代币的原因..."
                required
              />
            </div>
          </div>

          {/* 模态框底部 */}
          <div className="flex items-center justify-end gap-3 p-6 border-t border-white/10 dark:border-white/5">
            <button
              type="button"
              onClick={onClose}
              className="glass-button text-gray-600 dark:text-gray-400"
              disabled={loading}
            >
              取消
            </button>
            <button
              type="submit"
              className="glass-button bg-blue-500/20 text-blue-600 dark:text-blue-400 disabled:opacity-50"
              disabled={loading || !selectedUser}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  分发中...
                </div>
              ) : (
                '确认分发'
              )}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}