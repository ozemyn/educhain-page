'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { CreateTokenRequest, DistributionRule } from '@/types/token';
import { ApiResponse } from '@/types/api';
import { 
  XMarkIcon, 
  PlusIcon, 
  TrashIcon,
  InformationCircleIcon
} from '@heroicons/react/24/outline';

interface CreateTokenModalProps {
  onClose: () => void;
  onSuccess: (message: string) => void;
  onError: (error: string) => void;
}

/**
 * 创建代币模态框组件
 * 提供创建新代币的表单界面
 */
export function CreateTokenModal({ onClose, onSuccess, onError }: CreateTokenModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateTokenRequest>({
    name: '',
    symbol: '',
    totalSupply: 1000000,
    distributionRules: [
      {
        contributionType: 'content_create',
        baseReward: 10,
        multipliers: {
          qualityScore: 1.5,
          popularityBonus: 0.1,
          timeBonus: 0.2
        }
      }
    ]
  });

  // 贡献类型选项
  const contributionTypes = [
    { value: 'content_create', label: '内容创建' },
    { value: 'content_review', label: '内容审核' },
    { value: 'community_help', label: '社区帮助' }
  ];

  /**
   * 处理表单字段变化
   */
  const handleFieldChange = (field: keyof CreateTokenRequest, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  /**
   * 添加分发规则
   */
  const addDistributionRule = () => {
    const newRule: DistributionRule = {
      contributionType: 'content_create',
      baseReward: 10,
      multipliers: {}
    };
    
    setFormData(prev => ({
      ...prev,
      distributionRules: [...prev.distributionRules, newRule]
    }));
  };

  /**
   * 删除分发规则
   */
  const removeDistributionRule = (index: number) => {
    setFormData(prev => ({
      ...prev,
      distributionRules: prev.distributionRules.filter((_, i) => i !== index)
    }));
  };

  /**
   * 更新分发规则
   */
  const updateDistributionRule = (index: number, field: keyof DistributionRule, value: any) => {
    setFormData(prev => ({
      ...prev,
      distributionRules: prev.distributionRules.map((rule, i) => 
        i === index ? { ...rule, [field]: value } : rule
      )
    }));
  };

  /**
   * 更新倍数设置
   */
  const updateMultiplier = (ruleIndex: number, multiplierKey: string, value: number) => {
    setFormData(prev => ({
      ...prev,
      distributionRules: prev.distributionRules.map((rule, i) => 
        i === ruleIndex ? {
          ...rule,
          multipliers: {
            ...rule.multipliers,
            [multiplierKey]: value || undefined
          }
        } : rule
      )
    }));
  };

  /**
   * 表单验证
   */
  const validateForm = (): string | null => {
    if (!formData.name.trim()) {
      return '请输入代币名称';
    }
    
    if (!formData.symbol.trim()) {
      return '请输入代币符号';
    }
    
    if (formData.symbol.length > 10) {
      return '代币符号不能超过10个字符';
    }
    
    if (formData.totalSupply <= 0) {
      return '总供应量必须大于0';
    }
    
    if (formData.distributionRules.length === 0) {
      return '至少需要一条分发规则';
    }
    
    for (let i = 0; i < formData.distributionRules.length; i++) {
      const rule = formData.distributionRules[i];
      if (rule.baseReward <= 0) {
        return `第${i + 1}条规则的基础奖励必须大于0`;
      }
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
      
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tokens`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('创建代币失败');
      }
      
      const result: ApiResponse = await response.json();
      
      if (!result.success) {
        throw new Error('创建代币失败');
      }
      
      onSuccess(`代币 ${formData.name} 创建成功！`);
      
    } catch (error) {
      console.error('创建代币失败:', error);
      onError(error instanceof Error ? error.message : '创建代币失败');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <GlassCard className="w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <form onSubmit={handleSubmit}>
          {/* 模态框头部 */}
          <div className="flex items-center justify-between p-6 border-b border-white/10 dark:border-white/5">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              创建新代币
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-lg bg-gray-500/20 text-gray-600 dark:text-gray-400 hover:bg-gray-500/30 transition-colors"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 space-y-6">
            {/* 基本信息 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  代币名称 *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className="glass-input w-full"
                  placeholder="例如：社区贡献币"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  代币符号 *
                </label>
                <input
                  type="text"
                  value={formData.symbol}
                  onChange={(e) => handleFieldChange('symbol', e.target.value.toUpperCase())}
                  className="glass-input w-full"
                  placeholder="例如：CCC"
                  maxLength={10}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                总供应量 *
              </label>
              <input
                type="number"
                value={formData.totalSupply}
                onChange={(e) => handleFieldChange('totalSupply', parseInt(e.target.value) || 0)}
                className="glass-input w-full"
                min="1"
                required
              />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                代币的最大发行量，创建后不可修改
              </p>
            </div>

            {/* 分发规则 */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    分发规则
                  </h3>
                  <div className="group relative">
                    <InformationCircleIcon className="h-4 w-4 text-gray-400 cursor-help" />
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 dark:bg-gray-700 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                      定义不同贡献行为的奖励规则
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={addDistributionRule}
                  className="glass-button flex items-center gap-2 text-blue-600 dark:text-blue-400"
                >
                  <PlusIcon className="h-4 w-4" />
                  添加规则
                </button>
              </div>

              <div className="space-y-4">
                {formData.distributionRules.map((rule, index) => (
                  <GlassCard key={index} className="p-4">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-medium text-gray-900 dark:text-white">
                        规则 {index + 1}
                      </h4>
                      {formData.distributionRules.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeDistributionRule(index)}
                          className="p-1 rounded text-red-600 dark:text-red-400 hover:bg-red-500/20 transition-colors"
                        >
                          <TrashIcon className="h-4 w-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          贡献类型
                        </label>
                        <select
                          value={rule.contributionType}
                          onChange={(e) => updateDistributionRule(index, 'contributionType', e.target.value)}
                          className="glass-input w-full"
                        >
                          {contributionTypes.map(type => (
                            <option key={type.value} value={type.value}>
                              {type.label}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          基础奖励
                        </label>
                        <input
                          type="number"
                          value={rule.baseReward}
                          onChange={(e) => updateDistributionRule(index, 'baseReward', parseFloat(e.target.value) || 0)}
                          className="glass-input w-full"
                          min="0"
                          step="0.01"
                        />
                      </div>
                    </div>

                    {/* 倍数设置 */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        奖励倍数（可选）
                      </label>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            质量评分倍数
                          </label>
                          <input
                            type="number"
                            value={rule.multipliers.qualityScore || ''}
                            onChange={(e) => updateMultiplier(index, 'qualityScore', parseFloat(e.target.value))}
                            className="glass-input w-full text-sm"
                            min="0"
                            step="0.1"
                            placeholder="1.0"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            受欢迎度倍数
                          </label>
                          <input
                            type="number"
                            value={rule.multipliers.popularityBonus || ''}
                            onChange={(e) => updateMultiplier(index, 'popularityBonus', parseFloat(e.target.value))}
                            className="glass-input w-full text-sm"
                            min="0"
                            step="0.1"
                            placeholder="0.1"
                          />
                        </div>
                        
                        <div>
                          <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                            时间奖励倍数
                          </label>
                          <input
                            type="number"
                            value={rule.multipliers.timeBonus || ''}
                            onChange={(e) => updateMultiplier(index, 'timeBonus', parseFloat(e.target.value))}
                            className="glass-input w-full text-sm"
                            min="0"
                            step="0.1"
                            placeholder="0.2"
                          />
                        </div>
                      </div>
                    </div>
                  </GlassCard>
                ))}
              </div>
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
              disabled={loading}
            >
              {loading ? (
                <div className="flex items-center gap-2">
                  <LoadingSpinner size="sm" />
                  创建中...
                </div>
              ) : (
                '创建代币'
              )}
            </button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
}