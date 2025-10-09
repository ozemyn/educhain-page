'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { LoginRequest } from '@/types/user';
import { ErrorCodes } from '@/types/api';
import { ErrorModal } from '@/components/ui/ErrorModal';
import { PasswordValidator } from '@/utils/password';
import { UsernameValidator } from '@/utils/username';
import turnstileManager from '@/utils/turnstileManager';
import { useAuth } from '@/contexts/AuthContext';

// 使用与 turnstileManager.ts 中相同的类型定义
type TurnstileCallback = (token: string) => void;
type TurnstileErrorCallback = () => void;

interface TurnstileWidgetOptions {
  sitekey: string;
  callback: TurnstileCallback;
  'error-callback'?: TurnstileErrorCallback;
  theme?: 'light' | 'dark';
  size?: 'normal' | 'compact';
  retry?: 'auto' | 'never';
  'retry-interval'?: number;
}

// Turnstile组件类型定义
declare global {
  interface Window {
    turnstile: {
      render: (element: string | HTMLElement, options: TurnstileWidgetOptions) => string;
      reset: (widgetId?: string) => void;
      remove: (widgetId?: string) => void;
    };
  }
}

interface FormErrors {
  email?: string;
  password?: string;
  turnstileToken?: string;
  general?: string;
}

export function UserLoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<string>('');
  
  // 表单状态
  const [formData, setFormData] = useState<LoginRequest>({
    email: '',
    password: '',
    turnstileToken: ''
  });
  
  // UI状态
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);

  // 初始化Turnstile
  useEffect(() => {
    const initTurnstile = async () => {
      if (turnstileRef.current) {
        try {
          // 设置更长的超时时间
          turnstileManager.setRenderTimeout(20000);
          
          const id = await turnstileManager.render(turnstileRef.current, {
            sitekey: process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA',
            callback: (token: string) => {
              setFormData(prev => ({ ...prev, turnstileToken: token }));
              setErrors(prev => ({ ...prev, turnstileToken: undefined }));
            },
            'error-callback': () => {
              console.warn('Turnstile verification error occurred');
              // 不立即显示错误，可能只是暂时的问题
            },
            theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
            size: window.innerWidth < 640 ? 'compact' : 'normal',
            retry: 'auto',
            'retry-interval': 8000
          });
          setWidgetId(id);
        } catch (error) {
          console.error('Failed to render Turnstile:', error);
          setErrors(prev => ({ ...prev, turnstileToken: '人机验证加载失败，请刷新页面重试' }));
        }
      }
    };

    initTurnstile();

    // 添加窗口大小变化监听器
    const handleResize = () => {
      if (widgetId && turnstileRef.current) {
        // 延迟重新渲染，避免频繁操作
        setTimeout(() => {
          turnstileManager.reset(widgetId);
        }, 300);
      }
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      if (widgetId) {
        turnstileManager.remove(widgetId);
      }
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  // 前端表单验证
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    // 邮箱验证
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!UsernameValidator.validateEmail(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else if (formData.password.length < 8) {
      newErrors.password = '密码长度至少需要8个字符';
    }

    // Turnstile验证
    if (!formData.turnstileToken) {
      newErrors.turnstileToken = '请完成人机验证';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 处理输入变化
  const handleInputChange = (field: keyof LoginRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // 实时密码强度检查
    if (field === 'password' && value) {
      const validation = PasswordValidator.validatePassword(value);
      setPasswordStrength(validation.strength);
    } else if (field === 'password' && !value) {
      setPasswordStrength(null);
    }
  };

  // 显示错误弹窗
  const showError = (message: string) => {
    setErrorMessage(message);
    setShowErrorModal(true);
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // 前端验证
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`;
      
      // 添加超时和重试机制
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 30000); // 30秒超时
      
      const requestBody = JSON.stringify(formData);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: requestBody,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (response.ok && result.success) {
        // 登录成功，使用认证上下文保存状态
        login(result.data.token, result.data.user);
        
        // 跳转到用户主页
        router.push('/user');
      } else {
        // 安全的错误处理：优先使用错误代码，避免直接暴露后端错误消息
        const errorMsg = getErrorMessage(result.error?.code, result.error?.message);
        showError(errorMsg);
        
        // 重置Turnstile
        if (widgetId) {
          turnstileManager.reset(widgetId);
          setFormData(prev => ({ ...prev, turnstileToken: '' }));
        }
      }
    } catch (error) {
      console.error('登录请求失败:', error);
      
      let errorMessage = '登录失败，请稍后重试';
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          errorMessage = '请求超时，请检查网络连接后重试';
        } else if (error.message.includes('Failed to fetch')) {
          errorMessage = '无法连接到服务器，请检查网络连接';
        } else if (error.message.includes('HTTP')) {
          errorMessage = '服务器响应异常，请稍后重试';
        }
      }
      
      showError(errorMessage);
      
      // 重置Turnstile
      if (widgetId) {
        turnstileManager.reset(widgetId);
        setFormData(prev => ({ ...prev, turnstileToken: '' }));
      }
    } finally {
      setIsLoading(false);
    }
  };

  // 获取用户友好的错误消息
  const getErrorMessage = (errorCode?: string, originalMessage?: string): string => {
    const errorMessages: Record<string, string> = {
      [ErrorCodes.UNAUTHORIZED]: '邮箱或密码错误，请检查后重试',
      [ErrorCodes.USER_DISABLED]: '账户已被禁用，请联系系统管理员',
      [ErrorCodes.EXTERNAL_SERVICE_ERROR]: '人机验证失败，请刷新页面重试',
      [ErrorCodes.INVALID_USER_DATA]: '输入信息格式不正确，请检查后重试',
      [ErrorCodes.RATE_LIMIT_EXCEEDED]: '登录尝试过于频繁，请稍后再试',
      [ErrorCodes.DATABASE_ERROR]: '系统暂时不可用，请稍后重试'
    };

    return errorCode && errorMessages[errorCode] 
      ? errorMessages[errorCode] 
      : originalMessage || '登录失败，请稍后重试';
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 邮箱输入 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            邮箱地址
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className={`glass-input w-full text-gray-900 dark:text-white ${
              errors.email ? 'border-red-500 focus:border-red-500' : ''
            }`}
            placeholder="请输入邮箱地址"
            disabled={isLoading}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {/* 密码输入 */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            密码
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className={`glass-input w-full pr-10 text-gray-900 dark:text-white ${
                errors.password ? 'border-red-500 focus:border-red-500' : ''
              }`}
              placeholder="请输入密码"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
            >
              {showPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-sm text-red-500">{errors.password}</p>
          )}
          {passwordStrength && formData.password && (
            <div className="mt-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500 dark:text-gray-400">密码强度:</span>
                <span className={`text-xs font-medium ${PasswordValidator.getStrengthColor(passwordStrength)}`}>
                  {PasswordValidator.getStrengthText(passwordStrength)}
                </span>
              </div>
              <div className="mt-1 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1">
                <div 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
                    passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
                    'w-full bg-green-500'
                  }`}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Turnstile验证 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            人机验证
          </label>
          <div ref={turnstileRef} className="flex justify-center"></div>
          {errors.turnstileToken && (
            <p className="mt-1 text-sm text-red-500">{errors.turnstileToken}</p>
          )}
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isLoading || !formData.turnstileToken}
          className={`w-full glass-button py-3 px-4 text-white font-medium rounded-lg transition-all duration-200 ${
            isLoading || !formData.turnstileToken
              ? 'opacity-50 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700'
          }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              登录中...
            </div>
          ) : (
            '登录'
          )}
        </button>
      </form>

      {/* 错误提示弹窗 */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="登录失败"
        message={errorMessage}
        actionText="确定"
      />
    </>
  );
}