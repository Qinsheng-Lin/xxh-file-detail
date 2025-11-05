#!/bin/bash

# File Info Decorator v1.8.0 快速安装脚本

echo "🚀 开始安装 File Info Decorator v1.8.0..."
echo ""
echo "📝 v1.8.0 重大改进："
echo "  ✨ 搜索保持树形结构（不再展平）"
echo "  ✅ 只显示包含匹配项的文件夹路径"
echo "  ✅ 可以搜索到node_modules等所有文件夹"
echo "  ✅ 递归搜索所有子文件和子文件夹"
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
echo "🔍 新的搜索体验："
echo ""
echo "  搜索 'eslint' 现在会显示："
echo ""
echo "    node_modules/               ← 文件夹（包含匹配项）"
echo "      ├─ @eslint/              ← 匹配！"
echo "      │   ├─ eslintrc/"
echo "      │   └─ js/"
echo "      ├─ eslint/               ← 匹配！"
echo "      └─ eslint-community/     ← 匹配！"
echo ""
echo "  保持树形结构，一目了然！"
echo ""
echo "🎯 搜索特点："
echo "  ✅ 保持文件夹层级结构"
echo "  ✅ 只显示相关路径"
echo "  ✅ 展开包含匹配项的文件夹"
echo "  ✅ 隐藏不相关的文件夹"
echo ""
echo "📋 其他功能："
echo "  • 点击📋复制绝对路径"
echo "  • Command+Shift+C快捷键"
echo "  • Command+Backspace删除"
echo "  • 全部展开/折叠"
echo "  • 自动索引系统"
echo ""
echo "🎯 重要提示："
echo "  安装后请重新加载窗口："
echo "  Command+Shift+P → 'Reload Window'"
echo ""
echo "🎉 享受树形结构搜索！"
echo ""

