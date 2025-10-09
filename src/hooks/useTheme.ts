'use client';

import { useThemeContext } from '@/components/providers/ThemeProvider';

export function useTheme() {
  try {
    return useThemeContext();
  } catch (error) {
    // 在服务端渲染或主题提供者不可用时返回默认值
    return {
      theme: 'light' as const,
      setTheme: () => {},
      toggleTheme: () => {},
    };
  }
}