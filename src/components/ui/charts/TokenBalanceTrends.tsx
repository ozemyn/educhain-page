'use client';

import React, { useMemo } from 'react';
import BaseChart from './BaseChart';
import { useTheme } from '@/hooks/useTheme';
import * as echarts from 'echarts';

interface TokenBalanceTrendsProps {
  data: {
    trends: Array<{
      date: string;
      balance: number;
      change: number;
    }>;
    summary: {
      currentBalance: number;
      totalEarned: number;
      averageDaily: number;
      growth: number;
    };
  };
  loading?: boolean;
  height?: string | number;
  className?: string;
  period?: 'week' | 'month' | 'quarter' | 'year';
}

/**
 * 代币余额变化趋势图表组件
 * 
 * 显示用户代币余额随时间的变化趋势，支持：
 * - 折线图展示余额变化
 * - 柱状图展示每日变化量
 * - 深浅色主题适配
 * - 响应式布局
 * - 玻璃液态效果
 */
export default function TokenBalanceTrends({
  data,
  loading = false,
  height = '400px',
  className = '',
  period = 'month'
}: TokenBalanceTrendsProps) {
  const { theme } = useTheme();

  // 生成图表配置
  const chartOption = useMemo((): echarts.EChartsOption => {
    if (!data || !data.trends || data.trends.length === 0) {
      return {
        title: {
          text: '暂无数据',
          left: 'center',
          top: 'middle',
          textStyle: {
            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            fontSize: 16
          }
        }
      };
    }

    const { trends, summary } = data;
    
    // 格式化日期显示
    const formatDate = (dateStr: string) => {
      const date = new Date(dateStr);
      if (period === 'year') {
        return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'short' });
      } else {
        return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' });
      }
    };

    const dates = trends.map(item => formatDate(item.date));
    const balances = trends.map(item => item.balance);
    const changes = trends.map(item => item.change);

    return {
      title: {
        text: '代币余额变化趋势',
        left: 'center',
        textStyle: {
          color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
          fontSize: 18,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross',
          crossStyle: {
            color: theme === 'dark' ? '#6b7280' : '#9ca3af'
          }
        },
        backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        textStyle: {
          color: theme === 'dark' ? '#f3f4f6' : '#1f2937'
        },
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex;
          const trend = trends[dataIndex];
          return `
            <div class="p-2">
              <div class="font-semibold">${formatDate(trend.date)}</div>
              <div class="mt-1">
                <div>余额: ${trend.balance.toFixed(2)} 代币</div>
                <div class="${trend.change >= 0 ? 'text-green-500' : 'text-red-500'}">
                  变化: ${trend.change >= 0 ? '+' : ''}${trend.change.toFixed(2)} 代币
                </div>
              </div>
            </div>
          `;
        }
      },
      legend: {
        data: ['余额', '每日变化'],
        top: '8%',
        textStyle: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        top: '20%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: [
        {
          type: 'category',
          data: dates,
          axisPointer: {
            type: 'shadow'
          },
          axisLine: {
            lineStyle: {
              color: theme === 'dark' ? '#374151' : '#e5e7eb'
            }
          },
          axisLabel: {
            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            rotate: dates.length > 10 ? 45 : 0
          }
        }
      ],
      yAxis: [
        {
          type: 'value',
          name: '余额',
          position: 'left',
          nameTextStyle: {
            color: theme === 'dark' ? '#9ca3af' : '#6b7280'
          },
          axisLine: {
            lineStyle: {
              color: theme === 'dark' ? '#374151' : '#e5e7eb'
            }
          },
          axisLabel: {
            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            formatter: (value: number) => {
              if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'k';
              }
              return value.toFixed(0);
            }
          },
          splitLine: {
            lineStyle: {
              color: theme === 'dark' ? '#374151' : '#f3f4f6',
              type: 'dashed'
            }
          }
        },
        {
          type: 'value',
          name: '变化量',
          position: 'right',
          nameTextStyle: {
            color: theme === 'dark' ? '#9ca3af' : '#6b7280'
          },
          axisLine: {
            lineStyle: {
              color: theme === 'dark' ? '#374151' : '#e5e7eb'
            }
          },
          axisLabel: {
            color: theme === 'dark' ? '#9ca3af' : '#6b7280',
            formatter: (value: number) => {
              return value >= 0 ? '+' + value.toFixed(0) : value.toFixed(0);
            }
          }
        }
      ],
      series: [
        {
          name: '余额',
          type: 'line',
          yAxisIndex: 0,
          data: balances,
          smooth: true,
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: theme === 'dark' ? '#3b82f6' : '#60a5fa' },
              { offset: 1, color: theme === 'dark' ? '#8b5cf6' : '#a855f7' }
            ])
          },
          itemStyle: {
            color: theme === 'dark' ? '#3b82f6' : '#60a5fa',
            borderWidth: 2,
            borderColor: '#fff'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: theme === 'dark' ? 'rgba(59, 130, 246, 0.3)' : 'rgba(96, 165, 250, 0.3)' },
              { offset: 1, color: theme === 'dark' ? 'rgba(59, 130, 246, 0.05)' : 'rgba(96, 165, 250, 0.05)' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: theme === 'dark' ? '#60a5fa' : '#3b82f6',
              borderWidth: 3
            }
          }
        },
        {
          name: '每日变化',
          type: 'bar',
          yAxisIndex: 1,
          data: changes.map(change => ({
            value: change,
            itemStyle: {
              color: change >= 0 
                ? (theme === 'dark' ? '#10b981' : '#34d399')
                : (theme === 'dark' ? '#ef4444' : '#f87171')
            }
          })),
          barWidth: '40%',
          emphasis: {
            itemStyle: {
              opacity: 0.8
            }
          }
        }
      ],
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };
  }, [data, theme, period]);

  return (
    <div className={`w-full ${className}`}>
      <BaseChart
        option={chartOption}
        height={height}
        loading={loading}
        className="w-full"
      />
      
      {/* 统计摘要 */}
      {data && data.summary && (
        <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center p-3 rounded-lg bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <div className="text-sm text-gray-600 dark:text-gray-400">当前余额</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {data.summary.currentBalance.toFixed(2)}
            </div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <div className="text-sm text-gray-600 dark:text-gray-400">总收入</div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
              +{data.summary.totalEarned.toFixed(2)}
            </div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <div className="text-sm text-gray-600 dark:text-gray-400">日均收入</div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {data.summary.averageDaily.toFixed(2)}
            </div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <div className="text-sm text-gray-600 dark:text-gray-400">增长率</div>
            <div className={`text-lg font-semibold ${
              data.summary.growth >= 0 
                ? 'text-green-600 dark:text-green-400' 
                : 'text-red-600 dark:text-red-400'
            }`}>
              {data.summary.growth >= 0 ? '+' : ''}{data.summary.growth.toFixed(1)}%
            </div>
          </div>
        </div>
      )}
    </div>
  );
}