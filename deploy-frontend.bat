@echo off
chcp 65001 >nul
echo ========================================
echo   EduChain 前端部署到GitHub (ozemyn账号)
echo ========================================
echo.

echo [1/8] 检查当前目录...
cd /d "%~dp0"
echo 当前目录: %CD%
echo.

echo [2/8] 设置SSH密钥路径...
set SSH_KEY_PATH=%USERPROFILE%\.ssh\id_rsa_ozemyn
echo SSH密钥路径: %SSH_KEY_PATH%
echo.

echo [3/8] 检查SSH密钥...
if not exist "%SSH_KEY_PATH%" (
    echo ❌ SSH密钥不存在！请先运行后端的SSH设置脚本
    pause
    exit /b 1
)
echo ✓ SSH密钥存在
echo.

echo [4/8] 清理旧的Git配置...
if exist ".git" (
    rmdir /s /q ".git"
    echo ✓ 清理完成
) else (
    echo ✓ 无需清理
)
echo.

echo [5/8] 初始化Git仓库...
git init
git config user.name "ozemyn"
git config user.email "ozemyn@gmail.com"
echo ✓ Git初始化完成
echo.

echo [6/8] 添加文件并提交...
git add .
git commit -m "Initial commit: EduChain frontend - Next.js app for Cloudflare Pages"
if %ERRORLEVEL% NEQ 0 (
    echo ❌ 提交失败
    git status
    pause
    exit /b 1
)
echo ✓ 提交完成
echo.

echo [7/8] 添加远程仓库...
git remote add origin git@github.com-ozemyn:ozemyn/educhain-page.git
git branch -M main
echo ✓ 远程仓库配置完成
echo.

echo [8/8] 推送到GitHub...
echo 正在推送到GitHub（强制推送覆盖远程）...
git push -f origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo           🎉 前端部署成功！
    echo ========================================
    echo.
    echo ✅ 前端代码已上传到GitHub
    echo 📍 仓库地址: https://github.com/ozemyn/educhain-page
    echo 🚀 现在可以连接到Cloudflare Pages
    echo.
    echo 下一步：
    echo 1. 访问 Cloudflare Pages 控制台
    echo 2. 连接 GitHub 仓库: ozemyn/educhain-page
    echo 3. 构建命令: npm run build
    echo 4. 输出目录: out
    echo 5. 绑定域名: educhain.cc
    echo.
) else (
    echo.
    echo ❌ 推送失败
    echo 请检查SSH配置或网络连接
    echo.
)

echo 按任意键退出...
pause >nul