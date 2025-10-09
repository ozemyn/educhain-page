'use client';

import React, { useMemo } from 'react';
import BaseChart from './BaseChart';
import { useTheme } from '@/hooks/useTheme';
import * as echarts from 'echarts';

interface ContributionTrendsProps {
  data: {
    trends: Array<{
      date: string;
      contributions: number;
      value: number;
    }>;
    summary: {
      totalContributions: number;
      totalValue: number;
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
 * 贡献趋势图表组件
 * 
 * 显示贡献数量和价值随时间的变化趋势，支持：
 * - 双轴图表（贡献数量 + 贡献价值）
 * - 深浅色主题适配
 * - 响应式布局
 * - 玻璃液态效果
 */
export default function ContributionTrends({
  data,
  loading = false,
  height = '400px',
  className = '',
  period = 'month'
}: ContributionTrendsProps) {
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
    const contributions = trends.map(item => item.contributions);
    const values = trends.map(item => item.value);

    return {
      title: {
        text: '贡献趋势分析',
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
                <div>贡献次数: ${trend.contributions}</div>
                <div>贡献价值: ${trend.value.toFixed(2)}</div>
              </div>
            </div>
          `;
        }
      },
      legend: {
        data: ['贡献次数', '贡献价值'],
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
          name: '贡献次数',
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
            formatter: (value: number) => value.toString()
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
          name: '贡献价值',
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
              if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'k';
              }
              return value.toFixed(0);
            }
          }
        }
      ],
      series: [
        {
          name: '贡献次数',
          type: 'bar',
          yAxisIndex: 0,
          data: contributions,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: theme === 'dark' ? '#3b82f6' : '#60a5fa' },
              { offset: 1, color: theme === 'dark' ? '#1d4ed8' : '#3b82f6' }
            ]),
            borderRadius: [4, 4, 0, 0]
          },
          barWidth: '40%',
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: theme === 'dark' ? '#60a5fa' : '#3b82f6' },
                { offset: 1, color: theme === 'dark' ? '#3b82f6' : '#1d4ed8' }
              ])
            }
          }
        },
        {
          name: '贡献价值',
          type: 'line',
          yAxisIndex: 1,
          data: values,
          smooth: true,
          lineStyle: {
            width: 3,
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: theme === 'dark' ? '#10b981' : '#34d399' },
              { offset: 1, color: theme === 'dark' ? '#059669' : '#10b981' }
            ])
          },
          itemStyle: {
            color: theme === 'dark' ? '#10b981' : '#34d399',
            borderWidth: 2,
            borderColor: '#fff'
          },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: theme === 'dark' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(52, 211, 153, 0.3)' },
              { offset: 1, color: theme === 'dark' ? 'rgba(16, 185, 129, 0.05)' : 'rgba(52, 211, 153, 0.05)' }
            ])
          },
          emphasis: {
            itemStyle: {
              color: theme === 'dark' ? '#34d399' : '#10b981',
              borderWidth: 3
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
            <div className="text-sm text-gray-600 dark:text-gray-400">总贡献次数</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-white">
              {data.summary.totalContributions.toLocaleString()}
            </div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <div className="text-sm text-gray-600 dark:text-gray-400">总贡献价值</div>
            <div className="text-lg font-semibold text-blue-600 dark:text-blue-400">
              {data.summary.totalValue.toFixed(2)}
            </div>
          </div>
          
          <div className="text-center p-3 rounded-lg bg-white/10 dark:bg-gray-800/10 backdrop-blur-sm border border-white/20 dark:border-gray-700/20">
            <div className="text-sm text-gray-600 dark:text-gray-400">日均贡献</div>
            <div className="text-lg font-semibold text-green-600 dark:text-green-400">
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