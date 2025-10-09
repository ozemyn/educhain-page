'use client';

import React, { useState, useEffect } from 'react';
import { ContributionRecord } from '@/types/blockchain';
import BaseChart from './BaseChart';
import { useTheme } from '@/hooks/useTheme';

interface ContributionProgressProps {
    userId?: string;
    className?: string;
}

/**
 * 贡献记录上链进度组件
 * 
 * 显示贡献记录的上链状态和进度
 * 包括：
 * - 待确认的贡献记录
 * - 已确认的贡献记录
 * - 上链进度统计
 */
export default function ContributionProgress({ userId, className = '' }: ContributionProgressProps) {
    const { theme } = useTheme();
    const [contributions, setContributions] = useState<ContributionRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // 获取贡献记录
    const fetchContributions = async () => {
        try {
            setLoading(true);
            const url = userId
                ? `${process.env.NEXT_PUBLIC_API_URL}/api/contributions/user/${userId}?limit=50`
                : `${process.env.NEXT_PUBLIC_API_URL}/api/contributions?limit=50`;

            const response = await fetch(url);
            const result = await response.json();

            if (result.success) {
                setContributions(result.data.contributions || result.data || []);
                setError(null);
            } else {
                setError(result.message || '获取贡献记录失败');
            }
        } catch (err) {
            setError('网络错误，无法获取贡献记录');
            console.error('获取贡献记录失败:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContributions();
    }, [userId]);

    // 实时更新
    useEffect(() => {
        const interval = setInterval(fetchContributions, 15000); // 每15秒更新一次
        return () => clearInterval(interval);
    }, [userId]);

    // 计算统计数据
    const stats = React.useMemo(() => {
        const total = contributions.length;
        const confirmed = contributions.filter(c => c.status === 'confirmed').length;
        const pending = contributions.filter(c => c.status === 'pending').length;
        const failed = contributions.filter(c => c.status === 'failed').length;

        return {
            total,
            confirmed,
            pending,
            failed,
            confirmationRate: total > 0 ? (confirmed / total) * 100 : 0
        };
    }, [contributions]);

    // 上链进度饼图配置
    const progressChartOption = {
        title: {
            text: '贡献记录上链状态',
            left: 'center',
            textStyle: {
                color: theme === 'dark' ? '#e5e7eb' : '#374151',
                fontSize: 16,
                fontWeight: 600
            }
        },
        tooltip: {
            trigger: 'item' as const,
            formatter: '{a} <br/>{b}: {c} ({d}%)',
            backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
            textStyle: {
                color: theme === 'dark' ? '#e5e7eb' : '#374151'
            }
        },
        legend: {
            orient: 'vertical' as const,
            left: 'left' as const,
            textStyle: {
                color: theme === 'dark' ? '#e5e7eb' : '#374151'
            }
        },
        series: [{
            name: '上链状态',
            type: 'pie' as const,
            radius: ['40%', '70%'],
            center: ['60%', '50%'],
            avoidLabelOverlap: false,
            itemStyle: {
                borderRadius: 10,
                borderColor: theme === 'dark' ? '#1f2937' : '#ffffff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center' as const
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 20,
                    fontWeight: 600,
                    color: theme === 'dark' ? '#e5e7eb' : '#374151'
                }
            },
            labelLine: {
                show: false
            },
            data: [
                {
                    value: stats.confirmed,
                    name: '已确认',
                    itemStyle: {
                        color: theme === 'dark' ? '#10b981' : '#059669'
                    }
                },
                {
                    value: stats.pending,
                    name: '待确认',
                    itemStyle: {
                        color: theme === 'dark' ? '#f59e0b' : '#d97706'
                    }
                },
                {
                    value: stats.failed,
                    name: '失败',
                    itemStyle: {
                        color: theme === 'dark' ? '#ef4444' : '#dc2626'
                    }
                }
            ]
        }]
    };

    // 最近贡献记录时间线图配置
    const timelineData = contributions
        .slice(0, 10)
        .map(contribution => ({
            name: new Date(contribution.createdAt).toLocaleDateString(),
            value: [
                new Date(contribution.createdAt).getTime(),
                contribution.contributionValue,
                contribution.status,
                contribution.contributionType
            ]
        }));

    const timelineChartOption = {
        title: {
            text: '最近贡献记录时间线',
            textStyle: {
                color: theme === 'dark' ? '#e5e7eb' : '#374151',
                fontSize: 16,
                fontWeight: 600
            }
        },
        tooltip: {
            trigger: 'item' as const,
            formatter: (params: any) => {
                const [timestamp, value, status, type] = params.value;
                const date = new Date(timestamp).toLocaleString();
                const statusText = status === 'confirmed' ? '已确认' : status === 'pending' ? '待确认' : '失败';
                const typeText = type === 'content_create' ? '内容创建' :
                    type === 'content_review' ? '内容审核' :
                        type === 'community_help' ? '社区帮助' : '代币奖励';
                return `时间: ${date}<br/>类型: ${typeText}<br/>价值: ${value}<br/>状态: ${statusText}`;
            },
            backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
            borderColor: theme === 'dark' ? '#4b5563' : '#d1d5db',
            textStyle: {
                color: theme === 'dark' ? '#e5e7eb' : '#374151'
            }
        },
        xAxis: {
            type: 'time' as const,
            axisLabel: {
                color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }
        },
        yAxis: {
            type: 'value' as const,
            name: '贡献价值',
            axisLabel: {
                color: theme === 'dark' ? '#9ca3af' : '#6b7280'
            }
        },
        series: [{
            name: '贡献记录',
            type: 'scatter' as const,
            data: timelineData,
            symbolSize: (data: any) => Math.max(8, Math.min(20, data[1] * 2)),
            itemStyle: {
                color: (params: any) => {
                    const status = params.value[2];
                    if (status === 'confirmed') return theme === 'dark' ? '#10b981' : '#059669';
                    if (status === 'pending') return theme === 'dark' ? '#f59e0b' : '#d97706';
                    return theme === 'dark' ? '#ef4444' : '#dc2626';
                }
            }
        }]
    };

    if (loading) {
        return (
            <div className={`
        p-6 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
        border border-white/20 dark:border-gray-700/20 shadow-lg
        ${className}
      `}>
                <div className="animate-pulse">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-4"></div>
                    <div className="h-64 bg-gray-300 dark:bg-gray-600 rounded"></div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`
        p-6 rounded-xl backdrop-blur-md bg-red-50/10 dark:bg-red-900/10
        border border-red-200/20 dark:border-red-700/20 shadow-lg
        ${className}
      `}>
                <div className="text-red-600 dark:text-red-400 text-center">
                    <p className="font-semibold mb-2">贡献记录加载失败</p>
                    <p className="text-sm">{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className={`space-y-6 ${className}`}>
            {/* 统计概览 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="
          p-4 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
          border border-white/20 dark:border-gray-700/20 shadow-lg
        ">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            {stats.total}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            总贡献记录
                        </div>
                    </div>
                </div>

                <div className="
          p-4 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
          border border-white/20 dark:border-gray-700/20 shadow-lg
        ">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                            {stats.confirmed}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            已确认
                        </div>
                    </div>
                </div>

                <div className="
          p-4 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
          border border-white/20 dark:border-gray-700/20 shadow-lg
        ">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                            {stats.pending}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            待确认
                        </div>
                    </div>
                </div>

                <div className="
          p-4 rounded-xl backdrop-blur-md bg-white/10 dark:bg-gray-800/10
          border border-white/20 dark:border-gray-700/20 shadow-lg
        ">
                    <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                            {stats.confirmationRate.toFixed(1)}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                            确认率
                        </div>
                    </div>
                </div>
            </div>

            {/* 图表区域 */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* 上链状态饼图 */}
                {stats.total > 0 && (
                    <BaseChart
                        option={progressChartOption}
                        height="300px"
                        className="w-full"
                    />
                )}

                {/* 时间线图 */}
                {timelineData.length > 0 && (
                    <BaseChart
                        option={timelineChartOption}
                        height="300px"
                        className="w-full"
                    />
                )}
            </div>
        </div>
    );
}