'use client';

import { useState } from 'react';
import { 
  QuestionMarkCircleIcon,
  BookOpenIcon,
  CogIcon,
  UserIcon,
  CurrencyDollarIcon,
  ChartBarIcon,
  ChatBubbleLeftRightIcon,
  ShieldCheckIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline';
import { GlassCard } from '@/components/ui/GlassCard';

interface FAQItem {
  question: string;
  answer: string;
  category: string;
}

interface GuideSection {
  title: string;
  icon: React.ComponentType<any>;
  items: string[];
}

export default function HelpPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const categories = [
    { id: 'all', name: '全部', icon: QuestionMarkCircleIcon },
    { id: 'account', name: '账户管理', icon: UserIcon },
    { id: 'content', name: '内容发布', icon: BookOpenIcon },
    { id: 'tokens', name: '代币系统', icon: CurrencyDollarIcon },
    { id: 'blockchain', name: '区块链', icon: ShieldCheckIcon },
    { id: 'chat', name: '聊天功能', icon: ChatBubbleLeftRightIcon },
  ];

  const faqData: FAQItem[] = [
    {
      question: '如何注册EduChain账户？',
      answer: '点击首页的"进入用户端"，然后选择"立即注册"。填写邮箱、用户名和密码，完成人机验证后即可注册成功。',
      category: 'account'
    },
    {
      question: '忘记密码怎么办？',
      answer: '在登录页面点击"忘记密码"，输入注册邮箱，系统会发送重置密码的链接到您的邮箱。',
      category: 'account'
    },
    {
      question: '如何发布知识内容？',
      answer: '登录后进入用户端，点击"知识内容"页面的"发布内容"按钮。填写标题、选择分类、添加标签，编写内容后提交审核。',
      category: 'content'
    },
    {
      question: '内容审核需要多长时间？',
      answer: '通常在24小时内完成审核。高质量的原创内容会优先审核，审核通过后您将获得相应的代币奖励。',
      category: 'content'
    },
    {
      question: '什么是EduChain代币？',
      answer: 'EduChain代币是平台的激励代币，用户通过发布优质内容、参与社区互动等方式获得。代币记录在区块链上，确保透明可信。',
      category: 'tokens'
    },
    {
      question: '如何获得代币奖励？',
      answer: '发布原创内容、内容被点赞收藏、参与社区讨论、帮助其他用户等行为都可以获得代币奖励。奖励数量根据贡献质量和影响力计算。',
      category: 'tokens'
    },
    {
      question: '代币可以用来做什么？',
      answer: '代币可以用于解锁高级功能、参与社区治理投票、兑换平台特权等。未来还将支持更多应用场景。',
      category: 'tokens'
    },
    {
      question: '什么是区块链记录？',
      answer: '您的所有贡献记录都会上链存储，包括发布内容、获得奖励、参与互动等。这确保了记录的不可篡改和永久保存。',
      category: 'blockchain'
    },
    {
      question: '如何查看我的区块链记录？',
      answer: '访问"区块链浏览器"页面，可以查看实时的区块链状态和您的贡献记录上链情况。',
      category: 'blockchain'
    },
    {
      question: '聊天功能如何使用？',
      answer: '在用户端点击"社区聊天"，可以加入不同的聊天室与其他用户实时交流。支持文字、图片等多种消息类型。',
      category: 'chat'
    }
  ];

  const guideData: GuideSection[] = [
    {
      title: '快速开始',
      icon: BookOpenIcon,
      items: [
        '注册账户并完成邮箱验证',
        '完善个人资料信息',
        '浏览平台内容，了解社区规则',
        '发布第一篇知识内容',
        '参与社区互动，获得代币奖励'
      ]
    },
    {
      title: '内容创作指南',
      icon: CogIcon,
      items: [
        '选择合适的内容分类',
        '撰写清晰的标题和摘要',
        '使用富文本编辑器格式化内容',
        '添加相关标签提高可发现性',
        '上传支持文档和图片',
        '提交审核并等待结果'
      ]
    },
    {
      title: '代币系统',
      icon: CurrencyDollarIcon,
      items: [
        '了解代币获取方式',
        '查看代币余额和交易记录',
        '参与贡献排行榜',
        '使用代币解锁功能',
        '参与社区治理投票'
      ]
    },
    {
      title: '区块链功能',
      icon: ShieldCheckIcon,
      items: [
        '理解去中心化记录的意义',
        '查看贡献记录上链状态',
        '验证区块链数据完整性',
        '了解共识机制和安全性'
      ]
    }
  ];

  const filteredFAQ = activeCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container-responsive py-8">
        {/* 页面标题 */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
            帮助中心
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            EduChain平台使用指南与常见问题解答
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 左侧导航 */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-8">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-6">
                帮助分类
              </h2>
              <nav className="space-y-2">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center px-4 py-3 rounded-lg transition-all ${
                        activeCategory === category.id
                          ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border border-blue-400/50'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-white/10 dark:hover:bg-white/5'
                      }`}
                    >
                      <Icon className="h-5 w-5 mr-3" />
                      {category.name}
                    </button>
                  );
                })}
              </nav>
            </GlassCard>
          </div>

          {/* 右侧内容 */}
          <div className="lg:col-span-2 space-y-8">
            {/* 快速指南 */}
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <BookOpenIcon className="h-6 w-6 mr-3" />
                使用指南
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {guideData.map((guide, index) => {
                  const Icon = guide.icon;
                  return (
                    <div key={index} className="space-y-4">
                      <h3 className="text-lg font-semibold text-gray-800 dark:text-white flex items-center">
                        <Icon className="h-5 w-5 mr-2" />
                        {guide.title}
                      </h3>
                      <ul className="space-y-2">
                        {guide.items.map((item, itemIndex) => (
                          <li key={itemIndex} className="flex items-start">
                            <span className="inline-block w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                            <span className="text-gray-600 dark:text-gray-400 text-sm">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </GlassCard>

            {/* 常见问题 */}
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-6 flex items-center">
                <QuestionMarkCircleIcon className="h-6 w-6 mr-3" />
                常见问题
              </h2>
              <div className="space-y-4">
                {filteredFAQ.map((faq, index) => (
                  <div key={index} className="border border-white/20 dark:border-white/10 rounded-lg overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-white/5 dark:hover:bg-white/5 transition-colors"
                    >
                      <span className="font-medium text-gray-800 dark:text-white">
                        {faq.question}
                      </span>
                      {expandedFAQ === index ? (
                        <ChevronDownIcon className="h-5 w-5 text-gray-500" />
                      ) : (
                        <ChevronRightIcon className="h-5 w-5 text-gray-500" />
                      )}
                    </button>
                    {expandedFAQ === index && (
                      <div className="px-4 pb-4 text-gray-600 dark:text-gray-400">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </GlassCard>

            {/* 联系支持 */}
            <GlassCard className="p-8 text-center">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
                需要更多帮助？
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                如果您没有找到问题的答案，可以通过以下方式联系我们
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="glass-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-3">
                  在线客服
                </button>
                <button className="glass-button border border-blue-500 text-blue-600 dark:text-blue-400 px-6 py-3">
                  提交反馈
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
}