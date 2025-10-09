'use client';

import React, { useEffect, useRef } from 'react';
import * as echarts from 'echarts';
import { useTheme } from '@/hooks/useTheme';

interface BaseChartProps {
  option: echarts.EChartsOption;
  height?: string | number;
  width?: string | number;
  className?: string;
  loading?: boolean;
  onChartReady?: (chart: echarts.ECharts) => void;
}

/**
 * 基础图表组件
 * 
 * 提供ECharts的React封装，支持：
 * - 深浅色主题自动切换
 * - 响应式布局
 * - 玻璃液态效果
 * - 加载状态
 */
export default function BaseChart({
  option,
  height = '400px',
  width = '100%',
  className = '',
  loading = false,
  onChartReady
}: BaseChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);
  const chartInstance = useRef<echarts.ECharts | null>(null);
  const { theme } = useTheme();

  // 初始化图表
  useEffect(() => {
    if (!chartRef.current) return;

    // 创建图表实例
    chartInstance.current = echarts.init(chartRef.current, theme === 'dark' ? 'dark' : 'light');
    
    // 设置图表配置
    chartInstance.current.setOption(option);
    
    // 调用回调函数
    if (onChartReady) {
      onChartReady(chartInstance.current);
    }

    // 监听窗口大小变化
    const handleResize = () => {
      chartInstance.current?.resize();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      chartInstance.current?.dispose();
    };
  }, []);

  // 更新图表配置
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.setOption(option, true);
    }
  }, [option]);

  // 主题切换
  useEffect(() => {
    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = echarts.init(chartRef.current!, theme === 'dark' ? 'dark' : 'light');
      chartInstance.current.setOption(option);
      
      if (onChartReady) {
        onChartReady(chartInstance.current);
      }
    }
  }, [theme]);

  // 加载状态
  useEffect(() => {
    if (chartInstance.current) {
      if (loading) {
        chartInstance.current.showLoading('default', {
          text: '加载中...',
          color: theme === 'dark' ? '#60a5fa' : '#3b82f6',
          textColor: theme === 'dark' ? '#e5e7eb' : '#374151',
          maskColor: theme === 'dark' ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)'
        });
      } else {
        chartInstance.current.hideLoading();
      }
    }
  }, [loading, theme]);

  return (
    <div 
      className={`
        relative overflow-hidden rounded-xl
        backdrop-blur-md bg-white/10 dark:bg-gray-800/10
        border border-white/20 dark:border-gray-700/20
        shadow-lg
        ${className}
      `}
      style={{ height, width }}
    >
      {/* 玻璃液态效果背景 */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent dark:from-gray-800/5" />
      
      {/* 图表容器 */}
      <div 
        ref={chartRef}
        className="relative z-10 w-full h-full"
        style={{ height, width }}
      />
      
      {/* 装饰性边框效果 */}
      <div className="absolute inset-0 rounded-xl border border-gradient-to-r from-blue-500/20 to-purple-500/20 pointer-events-none" />
    </div>
  );
}