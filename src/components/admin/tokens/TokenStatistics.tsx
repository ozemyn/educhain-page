'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Token, TokenStatistics as TokenStatsType } from '@/types/token';
import ReactECharts from 'echarts-for-react';
import { 
  ChartBarIcon, 
  ArrowTrendingUpIcon,
  UsersIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';

interface TokenStatisticsProps {
  tokens: Token[];
  statistics: TokenStatsType[];
}

/**
 * 代币统计组件
 * 使用ECharts展示代币分发统计和数据可视化
 */
export function TokenStatistics({ tokens, statistics }: TokenStatisticsProps) {
  const [loading, setLoading] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState<'7d' | '30d' | '90d'>('30d');

  /**
   * 生成分发统计图表配置
   */
  const getDistributionChartOption = () => {
    const data = tokens.map(token => ({
      name: token.name,
      value: token.distributedSupply,
      symbol: token.symbol
    }));

    return {
      title: {
        text: '代币分发分布',
        left: 'center',
        textStyle: {
          color: '#374151',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        textStyle: {
          color: '#6B7280'
        }
      },
      series: [
        {
          name: '分发数量',
          type: 'pie',
          radius: '50%',
          data: data,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          },
          itemStyle: {
            borderRadius: 8,
            borderColor: '#fff',
            borderWidth: 2
          }
        }
      ],
      backgroundColor: 'transparent'
    };
  };

  /**
   * 生成代币供应量对比图表配置
   */
  const getSupplyComparisonOption = () => {
    const tokenNames = tokens.map(token => token.name);
    const totalSupply = tokens.map(token => token.totalSupply);
    const distributedSupply = tokens.map(token => token.distributedSupply);

    return {
      title: {
        text: '代币供应量对比',
        left: 'center',
        textStyle: {
          color: '#374151',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        }
      },
      legend: {
        data: ['总供应量', '已分发量'],
        top: 30,
        textStyle: {
          color: '#6B7280'
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: tokenNames,
        axisLabel: {
          color: '#6B7280'
        },
        axisLine: {
          lineStyle: {
            color: '#E5E7EB'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#6B7280'
        },
        axisLine: {
          lineStyle: {
            color: '#E5E7EB'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#F3F4F6'
          }
        }
      },
      series: [
        {
          name: '总供应量',
          type: 'bar',
          data: totalSupply,
          itemStyle: {
            color: '#3B82F6',
            borderRadius: [4, 4, 0, 0]
          }
        },
        {
          name: '已分发量',
          type: 'bar',
          data: distributedSupply,
          itemStyle: {
            color: '#10B981',
            borderRadius: [4, 4, 0, 0]
          }
        }
      ],
      backgroundColor: 'transparent'
    };
  };

  /**
   * 生成分发趋势图表配置
   */
  const getDistributionTrendOption = () => {
    // 从统计数据中获取趋势数据
    const dates: string[] = [];
    const distributionData: number[] = [];
    
    // 如果有统计数据，使用真实数据
    if (statistics.length > 0 && statistics[0].distributionChart) {
      statistics[0].distributionChart.forEach((trend) => {
        dates.push(trend.date ? new Date(trend.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }) : trend.name);
        distributionData.push(trend.value || 0);
      });
    } else {
      // 如果没有趋势数据，生成空数据
      const now = new Date();
      for (let i = 29; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        dates.push(date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }));
        distributionData.push(0);
      }
    }

    return {
      title: {
        text: '代币分发趋势',
        left: 'center',
        textStyle: {
          color: '#374151',
          fontSize: 16,
          fontWeight: 'bold'
        }
      },
      tooltip: {
        trigger: 'axis'
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        top: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: dates,
        axisLabel: {
          color: '#6B7280'
        },
        axisLine: {
          lineStyle: {
            color: '#E5E7EB'
          }
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          color: '#6B7280'
        },
        axisLine: {
          lineStyle: {
            color: '#E5E7EB'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#F3F4F6'
          }
        }
      },
      series: [
        {
          name: '分发数量',
          type: 'line',
          smooth: true,
          data: distributionData,
          itemStyle: {
            color: '#8B5CF6'
          },
          areaStyle: {
            color: {
              type: 'linear',
              x: 0,
              y: 0,
              x2: 0,
              y2: 1,
              colorStops: [
                {
                  offset: 0,
                  color: 'rgba(139, 92, 246, 0.3)'
                },
                {
                  offset: 1,
                  color: 'rgba(139, 92, 246, 0.1)'
                }
              ]
            }
          }
        }
      ],
      backgroundColor: 'transparent'
    };
  };

  /**
   * 计算总体统计数据
   */
  const calculateOverallStats = () => {
    const totalTokens = tokens.length;
    const totalSupply = tokens.reduce((sum, token) => sum + token.totalSupply, 0);
    const totalDistributed = tokens.reduce((sum, token) => sum + token.distributedSupply, 0);
    const averageDistributionRate = totalSupply > 0 ? (totalDistributed / totalSupply) * 100 : 0;

    return {
      totalTokens,
      totalSupply,
      totalDistributed,
      averageDistributionRate
    };
  };

  const overallStats = calculateOverallStats();

  if (tokens.length === 0) {
    return (
      <GlassCard className="p-12 text-center">
        <ChartBarIcon className="h-16 w-16 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
          暂无统计数据
        </h3>
        <p className="text-gray-500 dark:text-gray-400">
          创建代币后即可查看统计分析
        </p>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-6">
      {/* 统计概览卡片 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                代币总数
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overallStats.totalTokens}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500/10">
              <CurrencyDollarIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                总供应量
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overallStats.totalSupply.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500/10">
              <ArrowTrendingUpIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                已分发量
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overallStats.totalDistributed.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500/10">
              <UsersIcon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                平均分发率
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {overallStats.averageDistributionRate.toFixed(1)}%
              </p>
            </div>
            <div className="p-3 rounded-lg bg-orange-500/10">
              <ChartBarIcon className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
        </GlassCard>
      </div>

      {/* 图表区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 分发分布饼图 */}
        <GlassCard className="p-6">
          <ReactECharts
            option={getDistributionChartOption()}
            style={{ height: '400px' }}
            opts={{ renderer: 'svg' }}
          />
        </GlassCard>

        {/* 供应量对比柱状图 */}
        <GlassCard className="p-6">
          <ReactECharts
            option={getSupplyComparisonOption()}
            style={{ height: '400px' }}
            opts={{ renderer: 'svg' }}
          />
        </GlassCard>
      </div>

      {/* 分发趋势图 */}
      <GlassCard className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            分发趋势分析
          </h3>
          <div className="flex gap-2">
            {[
              { key: '7d', label: '7天' },
              { key: '30d', label: '30天' },
              { key: '90d', label: '90天' }
            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setSelectedTimeRange(key as any)}
                className={`
                  px-3 py-1 rounded-lg text-sm transition-colors
                  ${selectedTimeRange === key 
                    ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400' 
                    : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-black/10'
                  }
                `}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
        
        <ReactECharts
          option={getDistributionTrendOption()}
          style={{ height: '300px' }}
          opts={{ renderer: 'svg' }}
        />
      </GlassCard>

      {/* 代币详细统计表格 */}
      <GlassCard className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          代币详细统计
        </h3>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10 dark:border-white/5">
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  代币名称
                </th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  符号
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  总供应量
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  已分发
                </th>
                <th className="text-right py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  分发率
                </th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 dark:text-gray-300">
                  状态
                </th>
              </tr>
            </thead>
            <tbody>
              {tokens.map((token) => {
                const distributionRate = (token.distributedSupply / token.totalSupply) * 100;
                
                return (
                  <tr key={token.id} className="border-b border-white/5 dark:border-white/5">
                    <td className="py-3 px-4 text-gray-900 dark:text-white font-medium">
                      {token.name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-600 dark:text-blue-400">
                        {token.symbol}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                      {token.totalSupply.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right text-gray-900 dark:text-white">
                      {token.distributedSupply.toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <span className="text-gray-900 dark:text-white">
                          {distributionRate.toFixed(1)}%
                        </span>
                        <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                          <div 
                            className="bg-blue-500 h-1.5 rounded-full"
                            style={{ width: `${Math.min(distributionRate, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`
                        px-2 py-1 rounded-full text-xs font-medium
                        ${token.status === 'active' 
                          ? 'bg-green-500/20 text-green-600 dark:text-green-400' 
                          : 'bg-yellow-500/20 text-yellow-600 dark:text-yellow-400'
                        }
                      `}>
                        {token.status === 'active' ? '活跃' : '暂停'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </GlassCard>
    </div>
  );
}