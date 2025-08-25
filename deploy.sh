#!/bin/bash

# 派派座位表 - 快速部署脚本
# Copyright © 2025 派派座位表 - 版权所有

echo "🚀 派派座位表 - 部署脚本"
echo "=========================="
echo ""

# 检查是否为官方仓库
if [ ! -d ".git" ]; then
    echo "❌ 错误: 当前目录不是Git仓库"
    exit 1
fi

# 构建保护版本
echo "📦 正在构建保护版本..."
node build.js

if [ $? -ne 0 ]; then
    echo "❌ 构建失败"
    exit 1
fi

# 检查dist目录
if [ ! -d "dist" ]; then
    echo "❌ 错误: dist目录不存在"
    exit 1
fi

echo ""
echo "✅ 构建完成！"
echo ""
echo "📋 部署检查清单:"
echo "  □ 检查dist/目录中的文件"
echo "  □ 测试保护机制是否正常工作"
echo "  □ 验证域名限制功能"
echo "  □ 确认版权信息显示正确"
echo ""

# 可选: 自动提交到Git
read -p "是否要提交更改到Git仓库？(y/N) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "📝 提交更改到Git..."
    git add .
    git commit -m "Add code protection and build system

- 添加域名验证保护
- 实现代码混淆和压缩
- 加强版权信息显示
- 创建自动化构建流程
- 添加反调试和防复制机制

部署版本已生成在dist/目录"
    
    echo "✅ Git提交完成"
    echo ""
    echo "🔄 推送到远程仓库 (可选):"
    echo "   git push origin main"
fi

echo ""
echo "🎉 部署准备完成！"
echo ""
echo "📁 部署文件位置: ./dist/"
echo "🌐 官方部署地址: https://paizuobao.asia/"
echo "⚠️  请确保只在授权域名部署此代码"
echo ""
echo "© 2025 派派座位表 - 版权所有"