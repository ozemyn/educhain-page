'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { RegisterRequest } from '@/types/user';
import { ErrorCodes } from '@/types/api';
import { ErrorModal } from '@/components/ui/ErrorModal';
import { PasswordValidator } from '@/utils/password';
import { UsernameValidator } from '@/utils/username';
import turnstileManager from '@/utils/turnstileManager';

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
  username?: string;
  email?: string;
  emailCode?: string;
  password?: string;
  confirmPassword?: string;
  turnstileToken?: string;
  general?: string;
}

export function UserRegisterForm() {
  const router = useRouter();
  const turnstileRef = useRef<HTMLDivElement>(null);
  const [widgetId, setWidgetId] = useState<string>('');

  // 表单状态
  const [formData, setFormData] = useState<RegisterRequest & { confirmPassword: string; emailCode: string }>({
    username: '',
    email: '',
    emailCode: '',
    password: '',
    confirmPassword: '',
    turnstileToken: ''
  });

  // UI状态
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [passwordStrength, setPasswordStrength] = useState<'weak' | 'medium' | 'strong' | null>(null);
  const [usernameValidation, setUsernameValidation] = useState<{ isValid: boolean; errors: string[] } | null>(null);

  // 邮箱验证相关状态
  const [emailVerified, setEmailVerified] = useState(false);
  const [emailCodeSent, setEmailCodeSent] = useState(false);
  const [sendingCode, setSendingCode] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [codeCountdown, setCodeCountdown] = useState(0);
  const [verificationHash, setVerificationHash] = useState('');
  const [verificationTimestamp, setVerificationTimestamp] = useState(0);

  // 初始化Turnstile
  useEffect(() => {
    const initTurnstile = async () => {
      if (turnstileRef.current) {
        try {
          // 设置更长的超时时间
          turnstileManager.setRenderTimeout(20000);
          
          const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || '1x00000000000000000000AA';

          const id = await turnstileManager.render(turnstileRef.current, {
            sitekey: siteKey,
            callback: (token: string) => {
              setFormData(prev => ({ ...prev, turnstileToken: token }));
              setErrors(prev => ({ ...prev, turnstileToken: undefined }));
            },
            'error-callback': () => {
              console.warn('Turnstile verification error occurred');
              // 不立即显示错误，可能只是暂时的问题
            },
            theme: document.documentElement.classList.contains('dark') ? 'dark' : 'light',
            size: window.innerWidth < 768 ? 'compact' : 'normal',
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

    // 监听窗口大小变化，在移动端旋转时重新渲染
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

    // 用户名验证
    if (!formData.username.trim()) {
      newErrors.username = '请输入用户名';
    } else {
      const usernameCheck = UsernameValidator.validateUsername(formData.username);
      if (!usernameCheck.isValid) {
        newErrors.username = usernameCheck.errors[0];
      }
    }

    // 邮箱验证
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱地址';
    } else if (!UsernameValidator.validateEmail(formData.email)) {
      newErrors.email = '邮箱格式不正确';
    }

    // 密码验证
    if (!formData.password) {
      newErrors.password = '请输入密码';
    } else {
      const passwordCheck = PasswordValidator.validatePassword(formData.password);
      if (!passwordCheck.isValid) {
        newErrors.password = passwordCheck.errors[0];
      }
    }

    // 确认密码验证
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = '请确认密码';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = '两次输入的密码不一致';
    }

    // 邮箱验证码验证
    if (!emailVerified) {
      newErrors.emailCode = '请先验证邮箱';
    }

    // Turnstile验证
    if (!formData.turnstileToken) {
      newErrors.turnstileToken = '请完成人机验证';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 发送邮箱验证码
  const sendEmailCode = async () => {
    if (!formData.email || !UsernameValidator.validateEmail(formData.email)) {
      setErrors(prev => ({ ...prev, email: '请输入正确的邮箱地址' }));
      return;
    }

    setSendingCode(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/send-verification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          type: 'register',
          expiresIn: 15
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setEmailCodeSent(true);
        setCodeCountdown(60); // 60秒倒计时

        // 保存验证信息（生产环境也需要）
        if (result.verificationData) {
          setVerificationHash(result.verificationData.hash);
          setVerificationTimestamp(result.verificationData.timestamp);
        }
        // 兼容开发环境的旧格式
        else if (result.debug) {
          setVerificationHash(result.debug.hash);
          setVerificationTimestamp(result.debug.expiresAt);
        }

        // 开始倒计时
        const timer = setInterval(() => {
          setCodeCountdown(prev => {
            if (prev <= 1) {
              clearInterval(timer);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);

        alert('验证码已发送到您的邮箱，请查收');
      } else {
        // 安全的错误处理：不直接显示后端错误信息
        const safeErrorMessage = getSafeEmailErrorMessage(response.status, result.error);
        showError(safeErrorMessage);
      }
    } catch (error) {
      console.error('发送验证码失败:', error);
      showError('网络连接异常，请检查网络设置后重试');
    } finally {
      setSendingCode(false);
    }
  };

  // 验证邮箱验证码
  const verifyEmailCode = async () => {
    if (!formData.emailCode || formData.emailCode.length !== 8) {
      setErrors(prev => ({ ...prev, emailCode: '请输入8位验证码' }));
      return;
    }

    setVerifyingCode(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/email/verify-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: formData.emailCode,
          hash: verificationHash,
          timestamp: verificationTimestamp
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        setEmailVerified(true);
        setErrors(prev => ({ ...prev, emailCode: undefined }));
        alert('邮箱验证成功！');
      } else {
        // 安全的错误处理：不直接显示后端错误消息
        const safeErrorMessage = getSafeVerificationErrorMessage(response.status);
        setErrors(prev => ({ ...prev, emailCode: safeErrorMessage }));
      }
    } catch (error) {
      console.error('验证邮箱验证码失败:', error);
      setErrors(prev => ({ ...prev, emailCode: '网络连接异常，请重试' }));
    } finally {
      setVerifyingCode(false);
    }
  };

  // 处理输入变化
  const handleInputChange = (field: keyof (RegisterRequest & { confirmPassword: string; emailCode: string }), value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    // 清除对应字段的错误
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }

    // 邮箱变化时重置验证状态
    if (field === 'email') {
      setEmailVerified(false);
      setEmailCodeSent(false);
      setCodeCountdown(0);
      setVerificationHash('');
      setVerificationTimestamp(0);
    }

    // 实时验证
    if (field === 'username' && value) {
      const validation = UsernameValidator.validateUsername(value);
      setUsernameValidation(validation);
    } else if (field === 'username' && !value) {
      setUsernameValidation(null);
    }

    if (field === 'password' && value) {
      const validation = PasswordValidator.validatePassword(value);
      setPasswordStrength(validation.strength);
    } else if (field === 'password' && !value) {
      setPasswordStrength(null);
    }

    // 确认密码实时验证
    if (field === 'confirmPassword' && value && formData.password) {
      if (value !== formData.password) {
        setErrors(prev => ({ ...prev, confirmPassword: '两次输入的密码不一致' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: undefined }));
      }
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
      const registerData: RegisterRequest = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        turnstileToken: formData.turnstileToken
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registerData),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // 注册成功，显示成功消息并跳转到登录页面
        alert('注册成功！请使用您的邮箱和密码登录。');
        router.push('/user/login');
      } else {
        // 安全的错误处理：优先使用错误代码，避免直接暴露后端错误消息
        const errorMsg = getErrorMessage(result.error?.code, undefined);
        showError(errorMsg);

        // 重置Turnstile
        if (widgetId) {
          turnstileManager.reset(widgetId);
          setFormData(prev => ({ ...prev, turnstileToken: '' }));
        }
      }
    } catch (error) {
      console.error('注册请求失败:', error);
      showError('网络连接异常，请检查网络设置后重试');

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
      [ErrorCodes.USER_ALREADY_EXISTS]: '该邮箱或用户名已被注册，请使用其他邮箱或用户名',
      [ErrorCodes.INVALID_USER_DATA]: '输入信息格式不正确，请检查后重试',
      [ErrorCodes.EXTERNAL_SERVICE_ERROR]: '人机验证失败，请刷新页面重试',
      [ErrorCodes.RATE_LIMIT_EXCEEDED]: '注册尝试过于频繁，请稍后再试',
      [ErrorCodes.DATABASE_ERROR]: '系统暂时不可用，请稍后重试'
    };

    return errorCode && errorMessages[errorCode]
      ? errorMessages[errorCode]
      : originalMessage || '注册失败，请稍后重试';
  };

  // 获取安全的邮件发送错误消息（不暴露后端详细错误）
  const getSafeEmailErrorMessage = (statusCode: number, backendError?: string): string => {
    // 根据HTTP状态码返回用户友好的错误消息
    switch (statusCode) {
      case 400:
        return '邮箱格式不正确，请检查后重试';
      case 403:
        return '邮件服务暂时不可用，请稍后重试';
      case 429:
        return '发送过于频繁，请稍后再试';
      case 500:
        return '服务器暂时不可用，请稍后重试';
      default:
        // 对于其他错误，返回通用消息，不暴露具体的后端错误
        return '发送验证码失败，请稍后重试';
    }
  };

  // 获取安全的验证码验证错误消息
  const getSafeVerificationErrorMessage = (statusCode: number): string => {
    switch (statusCode) {
      case 400:
        return '验证码错误或已过期，请重新获取';
      case 429:
        return '验证尝试过于频繁，请稍后再试';
      case 500:
        return '验证服务暂时不可用，请稍后重试';
      default:
        return '验证码验证失败，请重新获取验证码';
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* 用户名输入 */}
        <div>
          <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            用户名
          </label>
          <input
            id="username"
            type="text"
            value={formData.username}
            onChange={(e) => handleInputChange('username', e.target.value)}
            className={`glass-input w-full text-gray-900 dark:text-white ${errors.username ? 'border-red-500 focus:border-red-500' : ''
              }`}
            placeholder="请输入用户名（3-20个字符）"
            disabled={isLoading}
          />
          {errors.username && (
            <p className="mt-1 text-sm text-red-500">{errors.username}</p>
          )}
          {usernameValidation && !usernameValidation.isValid && formData.username && (
            <div className="mt-1">
              {usernameValidation.errors.map((error, index) => (
                <p key={index} className="text-xs text-red-500">{error}</p>
              ))}
            </div>
          )}
          {usernameValidation && usernameValidation.isValid && formData.username && (
            <p className="mt-1 text-xs text-green-500">用户名格式正确</p>
          )}
        </div>

        {/* 邮箱输入 */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            邮箱地址
          </label>
          <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
            <input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className={`glass-input w-full sm:flex-1 text-gray-900 dark:text-white ${errors.email ? 'border-red-500 focus:border-red-500' : ''
                } ${emailVerified ? 'border-green-500' : ''}`}
              placeholder="请输入邮箱地址"
              disabled={isLoading || emailVerified}
            />
            <button
              type="button"
              onClick={sendEmailCode}
              disabled={
                isLoading ||
                sendingCode ||
                !formData.email ||
                !UsernameValidator.validateEmail(formData.email) ||
                codeCountdown > 0 ||
                emailVerified
              }
              className={`w-full sm:w-auto px-4 py-2 text-sm font-medium rounded-lg transition-all whitespace-nowrap ${emailVerified
                ? 'bg-green-500 text-white cursor-not-allowed'
                : codeCountdown > 0
                  ? 'bg-gray-400 text-white cursor-not-allowed'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
            >
              {emailVerified ? '已验证' :
                sendingCode ? '发送中...' :
                  codeCountdown > 0 ? `${codeCountdown}s` :
                    emailCodeSent ? '重新发送' : '发送验证码'}
            </button>
          </div>
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
          {emailVerified && (
            <p className="mt-1 text-sm text-green-500">✓ 邮箱验证成功</p>
          )}
        </div>

        {/* 邮箱验证码输入 */}
        {emailCodeSent && !emailVerified && (
          <div>
            <label htmlFor="emailCode" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              邮箱验证码
            </label>
            <div className="flex flex-col sm:flex-row sm:space-x-2 space-y-2 sm:space-y-0">
              <input
                id="emailCode"
                type="text"
                value={formData.emailCode}
                onChange={(e) => handleInputChange('emailCode', e.target.value.toUpperCase())}
                className={`glass-input w-full sm:flex-1 text-gray-900 dark:text-white ${errors.emailCode ? 'border-red-500 focus:border-red-500' : ''
                  }`}
                placeholder="请输入8位验证码"
                maxLength={8}
                disabled={isLoading || verifyingCode}
              />
              <button
                type="button"
                onClick={verifyEmailCode}
                disabled={
                  isLoading ||
                  verifyingCode ||
                  !formData.emailCode ||
                  formData.emailCode.length !== 8
                }
                className="w-full sm:w-auto px-4 py-2 text-sm font-medium bg-green-500 hover:bg-green-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              >
                {verifyingCode ? '验证中...' : '验证'}
              </button>
            </div>
            {errors.emailCode && (
              <p className="mt-1 text-sm text-red-500">{errors.emailCode}</p>
            )}
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              验证码已发送到您的邮箱，请查收（有效期15分钟）
            </p>
          </div>
        )}

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
              className={`glass-input w-full pr-10 text-gray-900 dark:text-white ${errors.password ? 'border-red-500 focus:border-red-500' : ''
                }`}
              placeholder="请输入密码（至少8个字符）"
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
                  className={`h-1 rounded-full transition-all duration-300 ${passwordStrength === 'weak' ? 'w-1/3 bg-red-500' :
                    passwordStrength === 'medium' ? 'w-2/3 bg-yellow-500' :
                      'w-full bg-green-500'
                    }`}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* 确认密码输入 */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            确认密码
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
              className={`glass-input w-full pr-10 text-gray-900 dark:text-white ${errors.confirmPassword ? 'border-red-500 focus:border-red-500' : ''
                }`}
              placeholder="请再次输入密码"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="h-5 w-5 text-gray-400" />
              ) : (
                <EyeIcon className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">{errors.confirmPassword}</p>
          )}
          {formData.confirmPassword && formData.password === formData.confirmPassword && (
            <p className="mt-1 text-xs text-green-500">密码确认正确</p>
          )}
        </div>

        {/* Turnstile验证 */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            人机验证
          </label>
          <div className="w-full flex justify-center items-center min-h-[65px] overflow-hidden">
            <div ref={turnstileRef} className="flex justify-center items-center"></div>
          </div>
          {errors.turnstileToken && (
            <p className="mt-1 text-sm text-red-500">{errors.turnstileToken}</p>
          )}
        </div>

        {/* 提交按钮 */}
        <button
          type="submit"
          disabled={isLoading || !formData.turnstileToken || !emailVerified}
          className={`w-full glass-button py-3 px-4 text-white font-medium rounded-lg transition-all duration-200 ${isLoading || !formData.turnstileToken || !emailVerified
            ? 'opacity-50 cursor-not-allowed'
            : 'bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700'
            }`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              注册中...
            </div>
          ) : (
            '注册账户'
          )}
        </button>
      </form>

      {/* 错误提示弹窗 */}
      <ErrorModal
        isOpen={showErrorModal}
        onClose={() => setShowErrorModal(false)}
        title="注册失败"
        message={errorMessage}
        actionText="确定"
      />
    </>
  );
}