#!/bin/bash

# File Info Decorator v1.6.3 快速安装脚本

echo "🚀 开始安装 File Info Decorator v1.6.3..."
echo ""
echo "📝 v1.6.3 更新内容："
echo "  ✅ 默认使用绝对路径（不再是相对路径）"
echo "  ✅ 修复'立即打开Chat'按钮（尝试多个命令）"
echo "  ✅ 修复拖放警告信息"
echo "  ✅ 更友好的提示信息"
echo ""

# 检查是否存在vsix文件
if [ ! -f "file-info-decorator-1.6.3.vsix" ]; then
    echo "❌ 错误：找不到 file-info-decorator-1.6.3.vsix 文件"
    echo "请先运行: npm run compile && npx vsce package --allow-missing-repository"
    exit 1
fi

# 卸载旧版本（可选）
echo "🗑️  卸载旧版本..."
code --uninstall-extension xiaohong-xin-qinsheng-lin.file-info-decorator 2>/dev/null
cursor --uninstall-extension xiaohong-xin-qinsheng-lin.file-info-decorator 2>/dev/null

echo ""
echo "📦 安装新版本..."

# 尝试为VSCode安装
if command -v code &> /dev/null; then
    echo "  → 为 VSCode 安装..."
    code --install-extension file-info-decorator-1.6.3.vsix
    echo "  ✅ VSCode 安装完成"
fi

# 尝试为Cursor安装
if command -v cursor &> /dev/null; then
    echo "  → 为 Cursor 安装..."
    cursor --install-extension file-info-decorator-1.6.3.vsix
    echo "  ✅ Cursor 安装完成"
fi

echo ""
echo "✨ 安装完成！"
echo ""
echo "📋 接下来："
echo "  1. 重新加载窗口：Command+Shift+P → 'Reload Window'"
echo "  2. 测试新功能："
echo "     • 右键文件 → '复制路径到Chat'"
echo "     • 查看提示信息，应该显示绝对路径"
echo "     • 点击'立即打开Chat'按钮"
echo "     • 在Chat中按 Cmd+V 粘贴"
echo ""
echo "📖 查看详细说明："
echo "  cat v1.6.3-重要更新.md"
echo ""
echo "🎯 重点改进："
echo "  现在拖动或复制文件到Cursor Chat时，"
echo "  都会自动使用绝对路径！"
echo "  例如：/Users/felix/Desktop/宝宝/xxhFD/src/extension.ts"
echo ""




