'use client';

import { useTheme } from '@/hooks/useTheme';
import { SunIcon, MoonIcon } from '@heroicons/react/24/outline';
import { useEffect, useState } from 'react';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <button className="glass-button p-2 rounded-full" aria-label="切换主题">
        <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      </button>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="glass-button p-2 rounded-full"
      aria-label="切换主题"
    >
      {theme === 'dark' ? (
        <SunIcon className="h-5 w-5 text-yellow-500" />
      ) : (
        <MoonIcon className="h-5 w-5 text-gray-700 dark:text-gray-300" />
      )}
    </button>
  );
}