'use client';

import Link from 'next/link';
import { GlassCard } from '@/components/ui/GlassCard';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900">
      <div className="container-responsive py-8">
        <div className="max-w-4xl mx-auto">
          <GlassCard className="p-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-4">
                服务条款
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                最后更新时间: 2024年1月1日
              </p>
            </div>

            <div className="prose prose-gray dark:prose-invert max-w-none">
              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  1. 服务接受条款
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  欢迎使用EduChain知识分享平台（以下简称"平台"）。通过访问或使用我们的服务，您同意受本服务条款的约束。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  2. 服务描述
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  EduChain是一个基于区块链的知识分享与贡献激励社区系统，用户可以通过发布有价值的内容获得代币奖励。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  3. 用户账户
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  用户需要注册账户才能使用平台服务。用户有责任维护账户信息的准确性和安全性，并对账户下的所有活动负责。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  4. 用户内容
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  用户在平台上发布的内容必须遵守相关法律法规，不得包含违法、侵权或不适当的内容。平台保留对用户内容进行审核和删除的权利。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  5. 代币系统
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  平台通过代币系统激励用户贡献有价值的内容。代币的获取和使用需遵守平台规则，平台保留调整代币政策的权利。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  6. 区块链记录
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  用户的贡献记录将被记录在区块链上，确保透明性和不可篡改性。用户应理解区块链技术的特点和局限性。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  7. 隐私政策
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  我们重视您的隐私。请查看我们的
                  <Link href="/privacy" className="text-blue-600 dark:text-blue-400 hover:underline">
                    隐私政策
                  </Link>
                  了解我们如何收集、使用和保护您的个人信息。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  8. 服务变更和终止
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  我们保留随时修改或终止服务的权利，无需事先通知。我们不对任何服务变更、暂停或终止对用户造成的损失负责。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  9. 免责声明
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  平台按"现状"提供，不保证服务的连续性、安全性或无错误。用户使用服务的风险由用户自行承担。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  10. 适用法律
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  本条款受中华人民共和国法律管辖。因本条款引起的任何争议，应提交至有管辖权的人民法院解决。
                </p>
              </section>

              <section className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-4">
                  11. 联系我们
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  如果您对本服务条款有任何疑问，请通过以下方式联系我们：
                </p>
                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
                  <li>邮箱: support@educhain.cc</li>
                  <li>客服: 在线客服系统</li>
                </ul>
              </section>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700 text-center">
              <Link 
                href="/" 
                className="glass-button bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 inline-flex items-center"
              >
                返回首页
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}