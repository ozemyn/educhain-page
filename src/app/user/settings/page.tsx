'use client';

import { useState, useEffect } from 'react';
import { GlassCard } from '@/components/ui/GlassCard';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { AuthGuard } from '@/components/auth/AuthGuard';
import {
  UserIcon,
  BellIcon,
  ShieldCheckIcon,
  LanguageIcon,
  PaintBrushIcon,
  DevicePhoneMobileIcon,
} from '@heroicons/react/24/outline';

export default function UserSettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [settings, setSettings] = useState({
    notifications: {
      email: true,
      push: true,
      tokenRewards: true,
      contentUpdates: true,
      communityMessages: false,
    },
    privacy: {
      profileVisible: true,
      contributionsVisible: true,
      tokenBalanceVisible: false,
    },
    preferences: {
      language: 'zh-CN',
      autoSave: true,
      compactMode: false,
    },
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      fetchUserSettings(JSON.parse(userData).id);
    }
  }, []);

  const fetchUserSettings = async (userId: string) => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}/settings`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data) {
          setSettings(result.data);
        }
      }
    } catch (error) {
      console.error('获取用户设置失败:', error);
    }
  };

  const handleSettingChange = async (category: string, key: string, value: any) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category as keyof typeof settings],
        [key]: value,
      },
    };
    setSettings(newSettings);

    // 保存到后端
    try {
      const token = localStorage.getItem('userToken');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user?.id}/settings`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newSettings)
      });
    } catch (error) {
      console.error('保存设置失败:', error);
    }
  };

  const handleSaveProfile = async () => {
    try {
      const token = localStorage.getItem('userToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users/${user?.id}/profile`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          localStorage.setItem('user', JSON.stringify(result.data));
          alert('保存成功');
        }
      }
    } catch (error) {
      console.error('保存用户资料失败:', error);
      alert('保存失败');
    }
  };

  return (
    <AuthGuard>
      <div className="space-y-6">
        {/* 页面标题 */}
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center">
            <UserIcon className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
              个人设置
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              管理您的账户设置和偏好
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 个人资料 */}
          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <UserIcon className="h-6 w-6 text-blue-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  个人资料
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-2xl font-bold">
                      {user?.username?.charAt(0)?.toUpperCase() || '用'}
                    </span>
                  </div>
                  <div className="flex-1">
                    <button className="glass-button px-4 py-2 text-sm">
                      更换头像
                    </button>
                    <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                      支持 JPG、PNG 格式，最大 2MB
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      用户名
                    </label>
                    <input
                      type="text"
                      defaultValue={user?.username || ''}
                      className="glass-input w-full"
                      placeholder="请输入用户名"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      邮箱地址
                    </label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      className="glass-input w-full"
                      placeholder="请输入邮箱地址"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    个人简介
                  </label>
                  <textarea
                    rows={3}
                    className="glass-input w-full resize-none"
                    placeholder="介绍一下自己..."
                    defaultValue={user?.bio || ''}
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={handleSaveProfile}
                    className="glass-button px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700"
                  >
                    保存更改
                  </button>
                </div>
              </div>
            </GlassCard>

            {/* 通知设置 */}
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <BellIcon className="h-6 w-6 text-green-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  通知设置
                </h2>
              </div>

              <div className="space-y-4">
                {Object.entries(settings.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {key === 'email' && '邮件通知'}
                        {key === 'push' && '推送通知'}
                        {key === 'tokenRewards' && '代币奖励通知'}
                        {key === 'contentUpdates' && '内容更新通知'}
                        {key === 'communityMessages' && '社区消息通知'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {key === 'email' && '通过邮件接收重要通知'}
                        {key === 'push' && '浏览器推送通知'}
                        {key === 'tokenRewards' && '获得代币奖励时通知'}
                        {key === 'contentUpdates' && '关注的内容有更新时通知'}
                        {key === 'communityMessages' && '社区聊天消息通知'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* 隐私设置 */}
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-6">
                <ShieldCheckIcon className="h-6 w-6 text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
                  隐私设置
                </h2>
              </div>

              <div className="space-y-4">
                {Object.entries(settings.privacy).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {key === 'profileVisible' && '公开个人资料'}
                        {key === 'contributionsVisible' && '公开贡献记录'}
                        {key === 'tokenBalanceVisible' && '公开代币余额'}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {key === 'profileVisible' && '其他用户可以查看您的个人资料'}
                        {key === 'contributionsVisible' && '在排行榜中显示您的贡献'}
                        {key === 'tokenBalanceVisible' && '在个人资料中显示代币余额'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleSettingChange('privacy', key, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>

          {/* 右侧设置面板 */}
          <div className="space-y-6">
            {/* 主题设置 */}
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <PaintBrushIcon className="h-6 w-6 text-orange-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  主题设置
                </h3>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-800 dark:text-white">
                  深浅色主题切换
                </span>
                <ThemeToggle />
              </div>
            </GlassCard>

            {/* 语言设置 */}
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <LanguageIcon className="h-6 w-6 text-indigo-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  语言设置
                </h3>
              </div>
              <select
                value={settings.preferences.language}
                onChange={(e) => handleSettingChange('preferences', 'language', e.target.value)}
                className="glass-select w-full"
              >
                <option value="zh-CN">简体中文</option>
                <option value="zh-TW">繁體中文</option>
                <option value="en-US">English</option>
              </select>
            </GlassCard>

            {/* 其他偏好设置 */}
            <GlassCard className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <DevicePhoneMobileIcon className="h-6 w-6 text-pink-500" />
                <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
                  使用偏好
                </h3>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      自动保存草稿
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      编辑内容时自动保存
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.preferences.autoSave}
                      onChange={(e) => handleSettingChange('preferences', 'autoSave', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-800 dark:text-white">
                      紧凑模式
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      减少界面间距，显示更多内容
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={settings.preferences.compactMode}
                      onChange={(e) => handleSettingChange('preferences', 'compactMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            </GlassCard>

            {/* 账户操作 */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                账户操作
              </h3>
              <div className="space-y-3">
                <button className="w-full glass-button p-3 text-left text-blue-600 dark:text-blue-400 hover:bg-blue-500/10">
                  修改密码
                </button>
                <button className="w-full glass-button p-3 text-left text-orange-600 dark:text-orange-400 hover:bg-orange-500/10">
                  导出数据
                </button>
                <button className="w-full glass-button p-3 text-left text-red-600 dark:text-red-400 hover:bg-red-500/10">
                  注销账户
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </AuthGuard>
  );
}