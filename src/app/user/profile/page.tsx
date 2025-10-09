'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';
import { AuthGuard } from '@/components/auth/AuthGuard';
import {
  UserIcon,
  CalendarIcon,
  MapPinIcon,
  LinkIcon,
  PencilIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
  DocumentTextIcon,
  StarIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';

export default function UserProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [contributions, setContributions] = useState<any[]>([]);
  const [tokenTransactions, setTokenTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
      fetchUserData(JSON.parse(userData));
    }
  }, []);

  const fetchUserData = async (userData: any) => {
    try {
      const token = localStorage.getItem('userToken');
      
      // 获取贡献记录
      const contribResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/contributions?userId=${userData.id}&limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (contribResponse.ok) {
        const result = await contribResponse.json();
        if (result.success && result.data) {
          setContributions(result.data.contributions);
        }
      }

      // 获取代币交易记录
      const tokenResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tokens/transactions/${userData.id}?limit=10`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (tokenResponse.ok) {
        const result = await tokenResponse.json();
        if (result.success && result.data) {
          setTokenTransactions(result.data.transactions);
        }
      }
    } catch (error) {
      console.error('获取用户数据失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'overview', name: '概览', icon: ChartBarIcon },
    { id: 'contributions', name: '贡献记录', icon: DocumentTextIcon },
    { id: 'tokens', name: '代币记录', icon: CurrencyDollarIcon },
    { id: 'achievements', name: '成就徽章', icon: TrophyIcon },
  ];

  // 使用真实数据，如果没有则显示空状态
  const displayContributions = contributions.length > 0 ? contributions : [];
  const displayTokenTransactions = tokenTransactions.length > 0 ? tokenTransactions : [];

  // TODO: 成就系统需要后端 API 支持，暂时使用静态数据
  const achievements = [
    {
      id: 1,
      name: '知识分享者',
      description: '发布了第一篇知识内容',
      icon: '📚',
      earned: true,
      date: '2024-01-10',
    },
    {
      id: 2,
      name: '活跃贡献者',
      description: '累计获得100贡献值',
      icon: '⭐',
      earned: true,
      date: '2024-01-15',
    },
    {
      id: 3,
      name: '社区导师',
      description: '帮助10位新用户',
      icon: '🎓',
      earned: false,
      progress: 7,
      total: 10,
    },
    {
      id: 4,
      name: '代币收集者',
      description: '累计获得1000个代币',
      icon: '💰',
      earned: true,
      date: '2024-01-16',
    },
  ];

  return (
    <AuthGuard>
      <div className="space-y-6">
      {/* 用户信息卡片 */}
      <GlassCard className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center space-y-4 md:space-y-0 md:space-x-6">
          {/* 头像和基本信息 */}
          <div className="flex items-center space-x-4">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-3xl font-bold">
                {user?.username?.charAt(0)?.toUpperCase() || '用'}
              </span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                {user?.username || '用户名'}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {user?.email || 'user@example.com'}
              </p>
              {user?.activityScore && (
                <div className="flex items-center mt-2">
                  {[...Array(5)].map((_, i) => (
                    <StarIcon
                      key={i}
                      className={`h-4 w-4 ${i < Math.floor(user.activityScore) ? 'text-yellow-400 fill-current' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                  ))}
                  <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                    {user.activityScore.toFixed(1)} 活跃度评分
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* 统计信息 */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                {user?.tokenBalance || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">激励代币</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                {contributions.length || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">贡献记录</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                {user?.contentCount || 0}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">发布内容</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
                {achievements.filter(a => a.earned).length}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">获得徽章</p>
            </div>
          </div>

          {/* 操作按钮 */}
          <div className="flex space-x-2">
            <Link href="/user/settings">
              <button className="glass-button p-2 rounded-full">
                <PencilIcon className="h-5 w-5" />
              </button>
            </Link>
          </div>
        </div>

        {/* 个人简介 */}
        <div className="mt-6 pt-6 border-t border-white/10 dark:border-white/5">
          <p className="text-gray-700 dark:text-gray-300">
            {user?.bio || '这个用户很懒，还没有填写个人简介...'}
          </p>
          <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center space-x-1">
              <CalendarIcon className="h-4 w-4" />
              <span>
                加入于 {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('zh-CN') : '未知'}
              </span>
            </div>
            {user?.location && (
              <div className="flex items-center space-x-1">
                <MapPinIcon className="h-4 w-4" />
                <span>{user.location}</span>
              </div>
            )}
            {user?.website && (
              <div className="flex items-center space-x-1">
                <LinkIcon className="h-4 w-4" />
                <a href={user.website} className="text-blue-600 dark:text-blue-400 hover:underline">
                  个人网站
                </a>
              </div>
            )}
          </div>
        </div>
      </GlassCard>

      {/* 标签页导航 */}
      <div className="border-b border-white/10 dark:border-white/5">
        <nav className="flex space-x-8 overflow-x-auto scrollbar-glass">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                }`}
              >
                <Icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* 标签页内容 */}
      <div className="space-y-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* 最近贡献 */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                最近贡献
              </h3>
              <div className="space-y-3">
                {displayContributions.slice(0, 3).map((contribution) => (
                  <div key={contribution.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-white/10 dark:hover:bg-black/10 transition-colors">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      contribution.type === 'content_create' ? 'bg-blue-500' :
                      contribution.type === 'content_review' ? 'bg-green-500' :
                      'bg-purple-500'
                    }`} />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {contribution.title}
                      </p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          +{contribution.contributionValue || contribution.value} 贡献值
                        </span>
                        <span className="text-xs text-gray-500">•</span>
                        <span className="text-xs text-gray-600 dark:text-gray-400">
                          {new Date(contribution.createdAt || contribution.date).toLocaleDateString('zh-CN')}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <Link href="/user/contributions">
                <button className="w-full mt-4 glass-button p-2 text-sm text-blue-600 dark:text-blue-400">
                  查看全部贡献记录
                </button>
              </Link>
            </GlassCard>

            {/* 最新成就 */}
            <GlassCard className="p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
                最新成就
              </h3>
              <div className="space-y-3">
                {achievements.filter(a => a.earned).slice(0, 3).map((achievement) => (
                  <div key={achievement.id} className="flex items-center space-x-3 p-3 rounded-lg bg-gradient-to-r from-yellow-500/10 to-orange-500/10">
                    <div className="text-2xl">{achievement.icon}</div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-800 dark:text-white">
                        {achievement.name}
                      </p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {achievement.description}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        获得于 {achievement.date}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('achievements')}
                className="w-full mt-4 glass-button p-2 text-sm text-blue-600 dark:text-blue-400"
              >
                查看全部成就
              </button>
            </GlassCard>
          </div>
        )}

        {activeTab === 'contributions' && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              贡献记录
            </h3>
            <div className="space-y-4">
              {displayContributions.map((contribution) => (
                <div key={contribution.id} className="flex items-start space-x-4 p-4 rounded-lg border border-white/10 dark:border-white/5">
                  <div className={`w-3 h-3 rounded-full mt-1 ${
                    contribution.type === 'content_create' ? 'bg-blue-500' :
                    contribution.type === 'content_review' ? 'bg-green-500' :
                    'bg-purple-500'
                  }`} />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800 dark:text-white">
                      {contribution.title || contribution.metadata?.title || '贡献记录'}
                    </h4>
                    <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                      <span>+{contribution.contributionValue || contribution.value} 贡献值</span>
                      <span>{new Date(contribution.createdAt || contribution.date).toLocaleDateString('zh-CN')}</span>
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        contribution.status === 'confirmed' 
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                      }`}>
                        {contribution.status === 'confirmed' ? '已确认' : '待确认'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {activeTab === 'tokens' && (
          <GlassCard className="p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">
              代币交易记录
            </h3>
            <div className="space-y-4">
              {displayTokenTransactions.map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 rounded-lg border border-white/10 dark:border-white/5">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
                      <CurrencyDollarIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">
                        {transaction.reason || '代币奖励'}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {new Date(transaction.createdAt || transaction.date).toLocaleDateString('zh-CN')}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 dark:text-green-400">
                      +{transaction.amount || 0}
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      代币
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {activeTab === 'achievements' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement) => (
              <GlassCard key={achievement.id} className={`p-6 ${
                achievement.earned 
                  ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10' 
                  : 'opacity-60'
              }`}>
                <div className="flex items-start space-x-4">
                  <div className="text-4xl">{achievement.icon}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 dark:text-white">
                      {achievement.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {achievement.description}
                    </p>
                    {achievement.earned ? (
                      <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                        ✓ 已获得 - {achievement.date}
                      </p>
                    ) : (
                      <div className="mt-2">
                        <div className="flex items-center justify-between text-xs text-gray-600 dark:text-gray-400 mb-1">
                          <span>进度</span>
                          <span>{achievement.progress}/{achievement.total}</span>
                        </div>
                        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(achievement.progress! / achievement.total!) * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        )}
      </div>
    </div>
    </AuthGuard>
  );
}