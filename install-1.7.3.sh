#!/bin/bash

# File Info Decorator v1.7.3 快速安装脚本

echo "🚀 开始安装 File Info Decorator v1.7.3..."
echo ""
echo "📝 v1.7.3 改进："
echo "  ✨ 搜索功能递归遍历所有子文件夹（重大改进！）"
echo "  ✅ 搜索现在能找到任何深度的文件"
echo "  ✅ 保持全部展开、复制按钮等所有功能"
echo ""

# 检查是否存在vsix文件
if [ ! -f "file-info-decorator-1.7.3.vsix" ]; then
    echo "❌ 错误：找不到 file-info-decorator-1.7.3.vsix 文件"
    exit 1
fi

# 卸载旧版本
echo "🗑️  卸载旧版本..."
cursor --uninstall-extension xiaohong-xin-qinsheng-lin.file-info-decorator 2>/dev/null

echo ""
echo "📦 安装新版本..."
cursor --install-extension file-info-decorator-1.7.3.vsix

echo ""
echo "✨ 安装完成！"
echo ""
echo "🔍 搜索功能升级（重点）："
echo ""
echo "  现在搜索会递归查找所有子文件夹！"
echo ""
echo "  使用方法："
echo "    1. 点击🔍搜索按钮"
echo "    2. 输入文件名关键词（例如：'config'）"
echo "    3. 看到所有匹配的文件（包括子文件夹中的）"
echo "    4. 点击🗑️清除搜索"
echo ""
echo "  示例："
echo "    搜索'test' → 找到："
echo "      • src/utils/test.ts"
echo "      • components/Button/test.tsx"
echo "      • config/test.json"
echo "      • docs/testing.md"
echo ""
echo "📋 其他功能："
echo "  • 点击文件旁边的📋复制绝对路径"
echo "  • Command+Shift+C 快捷键复制"
echo "  • Command+点击 多选文件"
echo "  • 全部展开/折叠按钮"
echo ""
echo "🎯 重要提示："
echo "  安装后请重新加载窗口："
echo "  Command+Shift+P → 'Reload Window'"
echo ""
echo "🎉 现在试试新的搜索功能吧！"
echo ""

