'use client';

import React, { useMemo } from 'react';
import BaseChart from './BaseChart';
import { useTheme } from '@/hooks/useTheme';
import * as echarts from 'echarts';

interface ContributionLeaderboardProps {
  data: Array<{
    userId: string;
    username: string;
    avatarUrl?: string;
    totalContributions: number;
    totalValue: number;
    rank: number;
  }>;
  loading?: boolean;
  height?: string | number;
  className?: string;
}

/**
 * 贡献排行榜图表组件
 * 
 * 显示用户贡献值排行榜，支持：
 * - 横向条形图展示
 * - 深浅色主题适配
 * - 响应式布局
 * - 玻璃液态效果
 */
export default function ContributionLeaderboard({
  data,
  loading = false,
  height = '400px',
  className = ''
}: ContributionLeaderboardProps) {
  const { theme } = useTheme();

  // 生成图表配置
  const chartOption = useMemo((): echarts.EChartsOption => {
    if (!data || data.length === 0) {
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

    // 按排名排序并取前10名
    const sortedData = [...data]
      .sort((a, b) => a.rank - b.rank)
      .slice(0, 10);

    const usernames = sortedData.map(item => item.username);
    const values = sortedData.map(item => item.totalValue);
    const contributions = sortedData.map(item => item.totalContributions);

    return {
      title: {
        text: '用户贡献值排行榜',
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
          type: 'shadow'
        },
        backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.9)' : 'rgba(255, 255, 255, 0.9)',
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        textStyle: {
          color: theme === 'dark' ? '#f3f4f6' : '#1f2937'
        },
        formatter: (params: any) => {
          const dataIndex = params[0].dataIndex;
          const item = sortedData[dataIndex];
          return `
            <div class="p-2">
              <div class="font-semibold text-lg">${item.username}</div>
              <div class="mt-1">
                <div>排名: #${item.rank}</div>
                <div>贡献值: ${item.totalValue.toFixed(2)}</div>
                <div>贡献次数: ${item.totalContributions}</div>
              </div>
            </div>
          `;
        }
      },
      grid: {
        left: '15%',
        right: '10%',
        top: '15%',
        bottom: '10%',
        containLabel: true
      },
      xAxis: {
        type: 'value',
        name: '贡献值',
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
            return value.toString();
          }
        },
        splitLine: {
          lineStyle: {
            color: theme === 'dark' ? '#374151' : '#f3f4f6',
            type: 'dashed'
          }
        }
      },
      yAxis: {
        type: 'category',
        data: usernames,
        axisLine: {
          lineStyle: {
            color: theme === 'dark' ? '#374151' : '#e5e7eb'
          }
        },
        axisLabel: {
          color: theme === 'dark' ? '#9ca3af' : '#6b7280',
          formatter: (value: string) => {
            // 限制用户名长度
            return value.length > 8 ? value.substring(0, 8) + '...' : value;
          }
        }
      },
      series: [
        {
          name: '贡献值',
          type: 'bar',
          data: values.map((value, index) => ({
            value,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: theme === 'dark' ? '#3b82f6' : '#60a5fa' },
                { offset: 1, color: theme === 'dark' ? '#8b5cf6' : '#a855f7' }
              ]),
              borderRadius: [0, 4, 4, 0]
            }
          })),
          barWidth: '60%',
          label: {
            show: true,
            position: 'right',
            color: theme === 'dark' ? '#f3f4f6' : '#1f2937',
            formatter: (params: any) => {
              const value = params.value;
              if (value >= 1000) {
                return (value / 1000).toFixed(1) + 'k';
              }
              return value.toFixed(1);
            }
          },
          emphasis: {
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: theme === 'dark' ? '#60a5fa' : '#3b82f6' },
                { offset: 1, color: theme === 'dark' ? '#a855f7' : '#8b5cf6' }
              ])
            }
          }
        }
      ],
      animationDuration: 1000,
      animationEasing: 'cubicOut'
    };
  }, [data, theme]);

  return (
    <div className={`w-full ${className}`}>
      <BaseChart
        option={chartOption}
        height={height}
        loading={loading}
        className="w-full"
      />
      
      {/* 图表说明 */}
      {data && data.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
          <p>显示前 {Math.min(data.length, 10)} 名用户的贡献值排行</p>
        </div>
      )}
    </div>
  );
}