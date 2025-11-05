#!/bin/bash

# File Info Decorator v1.6.2 快速安装脚本

echo "🚀 开始安装 File Info Decorator v1.6.2..."
echo ""

# 检查是否存在vsix文件
if [ ! -f "file-info-decorator-1.6.2.vsix" ]; then
    echo "❌ 错误：找不到 file-info-decorator-1.6.2.vsix 文件"
    echo "请先运行: npm run compile && npx vsce package"
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
    code --install-extension file-info-decorator-1.6.2.vsix
    echo "  ✅ VSCode 安装完成"
fi

# 尝试为Cursor安装
if command -v cursor &> /dev/null; then
    echo "  → 为 Cursor 安装..."
    cursor --install-extension file-info-decorator-1.6.2.vsix
    echo "  ✅ Cursor 安装完成"
fi

echo ""
echo "✨ 安装完成！"
echo ""
echo "📋 接下来："
echo "  1. 重新加载窗口：Command+Shift+P → 'Reload Window'"
echo "  2. 打开文件信息浏览器（侧边栏）"
echo "  3. 测试新功能："
echo "     • 按 Command+Backspace 删除文件"
echo "     • 按 Enter 重命名文件"
echo "     • 右键 → '复制路径到Chat'"
echo "     • 拖放文件到 Cursor Chat"
echo ""
echo "📖 查看详细说明：cat v1.6.2更新说明.md"
echo ""





