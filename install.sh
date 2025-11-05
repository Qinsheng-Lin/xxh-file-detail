#!/bin/bash

# File Info Decorator 快速安装脚本

echo "🚀 开始安装 File Info Decorator v1.8.0..."
echo ""

# 检查是否存在vsix文件
if [ ! -f "file-info-decorator-1.8.0.vsix" ]; then
    echo "❌ 错误：找不到 file-info-decorator-1.8.0.vsix 文件"
    exit 1
fi

# 卸载旧版本
echo "🗑️  卸载旧版本..."
cursor --uninstall-extension xiaohong-xin-qinsheng-lin.file-info-decorator 2>/dev/null

echo ""
echo "📦 安装新版本..."
cursor --install-extension file-info-decorator-1.8.0.vsix

echo ""
echo "✨ 安装完成！"
echo ""
echo "🔍 主要功能："
echo "  • 树形结构搜索"
echo "  • 极速索引系统"
echo "  • 一键复制路径"
echo "  • 完整快捷键支持"
echo ""
echo "🎯 下一步："
echo "  Command+Shift+P → 'Reload Window'"
echo ""
