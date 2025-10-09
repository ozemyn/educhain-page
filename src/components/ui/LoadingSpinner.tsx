// LoadingSpinner.tsx
import { GlassCard } from '@/components/ui/GlassCard';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  inline?: boolean;
}

export function LoadingSpinner({ message, size = 'md', inline = false }: LoadingSpinnerProps) {
  // 根据size设置spinner大小
  const spinnerSizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-16 h-16'
  };

  const spinnerSize = spinnerSizes[size];

  // 如果是inline模式，只显示spinner
  if (inline) {
    return (
      <div className={`${spinnerSize} border-2 border-blue-500 border-t-transparent rounded-full animate-spin`}></div>
    );
  }

  // 如果有message或者是大尺寸，显示完整的加载卡片
  if (message || size === 'lg') {
    return (
      <div className="space-y-8">
        <GlassCard className="p-6 md:p-8 text-center">
          <div className="flex justify-center mb-6">
            <div className={`${spinnerSize} border-4 border-blue-500 border-t-transparent rounded-full animate-spin`}></div>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
            {message || '正在加载数据...'}
          </h1>
          <p className="text-base text-gray-600 dark:text-gray-300">
            正在从后端服务器获取数据，请稍候...
          </p>
        </GlassCard>
      </div>
    );
  }

  // 默认情况，只显示spinner
  return (
    <div className={`${spinnerSize} border-2 border-blue-500 border-t-transparent rounded-full animate-spin`}></div>
  );
}