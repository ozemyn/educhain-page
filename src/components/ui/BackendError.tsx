// BackendError.tsx
import { GlassCard } from '@/components/ui/GlassCard';

interface BackendErrorProps {
  message?: string;
  onRetry?: () => void;
}

export function BackendError({ message, onRetry }: BackendErrorProps) {
  return (
    <div className="space-y-8">
      <GlassCard className="p-6 md:p-8 text-center">
        <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
          <svg className="w-8 h-8 text-red-500 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-4">
          无法连接到后端服务
        </h1>
        <p className="text-base text-gray-600 dark:text-gray-300 mb-6">
          {message || '无法与后端服务器建立连接，请检查网络连接或稍后重试。'}
        </p>
        {onRetry && (
          <button 
            onClick={onRetry}
            className="glass-button px-6 py-3 text-white font-semibold bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 transition-all"
          >
            重新连接
          </button>
        )}
        <div className="mt-6 text-sm text-gray-500 dark:text-gray-400">
          <p>如果您是网站访问者：</p>
          <p className="mt-1">请稍后重试或联系网站管理员。</p>
          <p className="mt-3">如果您是网站管理员：</p>
          <p className="mt-1">请检查后端服务是否正常运行。</p>
        </div>
      </GlassCard>
    </div>
  );
}