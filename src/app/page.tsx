'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/ui/ThemeToggle';
import { 
  ArrowRightIcon, 
  LightBulbIcon, 
  CubeTransparentIcon, 
  ChatBubbleLeftRightIcon,
  UserCircleIcon
} from '@heroicons/react/24/outline';

export default function HomePage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    // 检查用户登录状态
    const token = typeof window !== 'undefined' ? localStorage.getItem('userToken') : null;
    setIsLoggedIn(!!token);
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
    }
    
    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* 顶部导航栏 */}
      <header className={`fixed w-full z-50 transition-all duration-300 ${isScrolled ? 'glass-nav py-2' : 'py-4'}`}>
        <div className="container-responsive">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <CubeTransparentIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                EduChain
              </span>
            </div>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                特性
              </Link>
              <Link href="#how-it-works" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                工作原理
              </Link>
              <Link href="#community" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                社区
              </Link>
              <Link href="/blockchain/explorer" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                区块链浏览器
              </Link>
            </nav>

            <div className="flex items-center space-x-4">
              <ThemeToggle />
              {isLoggedIn ? (
                <Link href="/user">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full flex items-center justify-center cursor-pointer">
                    <UserCircleIcon className="h-5 w-5 text-white" />
                  </div>
                </Link>
              ) : (
                <>
                  <Link href="/user/login">
                    <span className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                      登录
                    </span>
                  </Link>
                  <Link href="/user/register">
                    <button className="glass-button px-4 py-2 text-sm bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all">
                      注册
                    </button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* 英雄区域 */}
      <section className="pt-32 pb-20 px-4">
        <div className="container-responsive text-center max-w-4xl">
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-6">
            知识分享的<span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">未来</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            EduChain 是一个去中心化的知识分享与激励平台，通过区块链技术确保您的每一份贡献都被永久记录和公正奖励。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/user">
              <button className="glass-button px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all flex items-center justify-center">
                立即体验
                <ArrowRightIcon className="ml-2 h-5 w-5" />
              </button>
            </Link>
            <Link href="#features">
              <button className="glass-button px-8 py-4 text-lg text-gray-800 dark:text-white hover:bg-white/20 dark:hover:bg-black/20 transition-all">
                了解更多
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* 特性展示区域 */}
      <section id="features" className="py-20 px-4">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              为什么选择 EduChain
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              我们重新定义了知识分享的方式，让每一份贡献都有价值。
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <LightBulbIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                智能激励
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                通过先进的算法评估内容价值，确保高质量贡献获得相应回报。
              </p>
            </div>

            <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <CubeTransparentIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                区块链保障
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                所有贡献记录永久存储在区块链上，确保透明、不可篡改。
              </p>
            </div>

            <div className="glass-card p-8 text-center hover:scale-105 transition-transform duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                社区互动
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                与全球知识爱好者交流，共同构建高质量的知识社区。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 工作原理 */}
      <section id="how-it-works" className="py-20 px-4 bg-white/10 dark:bg-black/10">
        <div className="container-responsive">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              工作原理
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-blue-500/10 dark:bg-blue-400/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">1</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                分享知识
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                创建账户并发布您的知识内容，可以是文章、教程、经验分享等。
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-indigo-500/10 dark:bg-indigo-400/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">2</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                获得认可
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                社区成员对您的内容进行互动，系统智能评估内容价值。
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-cyan-500/10 dark:bg-cyan-400/10 flex items-center justify-center mx-auto mb-6">
                <span className="text-2xl font-bold text-cyan-600 dark:text-cyan-400">3</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                收获奖励
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                根据内容质量和社区反馈获得代币奖励，记录永久上链。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 社区展示 */}
      <section id="community" className="py-20 px-4">
        <div className="container-responsive text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
            加入我们的知识社区
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto">
            与全球知识爱好者一起，构建可信的知识分享生态。
          </p>
          <Link href="/user/register">
            <button className="glass-button px-8 py-4 text-lg bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:from-blue-600 hover:to-indigo-700 transition-all">
              立即加入
            </button>
          </Link>
        </div>
      </section>

      {/* 页脚 */}
      <footer className="py-12 px-4 border-t border-white/20 dark:border-white/10">
        <div className="container-responsive">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-6 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
                <CubeTransparentIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                EduChain
              </span>
            </div>
            <div className="flex space-x-6">
              <Link href="/help" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                帮助中心
              </Link>
              <Link href="/user" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                用户端
              </Link>
              <Link href="/admin/login" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                管理端
              </Link>
              <Link href="/blockchain/explorer" className="text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                区块链浏览器
              </Link>
            </div>
          </div>
          <div className="mt-8 text-center text-gray-500 dark:text-gray-400 text-sm">
            © {new Date().getFullYear()} EduChain. 保留所有权利。
          </div>
        </div>
      </footer>
    </div>
  );
}