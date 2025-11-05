#!/bin/bash

# File Info Decorator v1.6.4 快速安装脚本

echo "🚀 开始安装 File Info Decorator v1.6.4..."
echo ""
echo "📝 v1.6.4 关键改进："
echo "  ✅ 拖动文件时自动复制路径到剪贴板"
echo "  ✅ 拖到Chat后直接Cmd+V粘贴即可"
echo "  ✅ 显示友好提示：已复制路径"
echo ""

# 检查是否存在vsix文件
if [ ! -f "file-info-decorator-1.6.4.vsix" ]; then
    echo "❌ 错误：找不到 file-info-decorator-1.6.4.vsix 文件"
    exit 1
fi

# 卸载旧版本
echo "🗑️  卸载旧版本..."
cursor --uninstall-extension xiaohong-xin-qinsheng-lin.file-info-decorator 2>/dev/null

echo ""
echo "📦 安装新版本..."
cursor --install-extension file-info-decorator-1.6.4.vsix

echo ""
echo "✨ 安装完成！"
echo ""
echo "📋 使用方法："
echo ""
echo "  方法1：拖放（推荐）✨"
echo "    1. 拖动文件到Cursor Chat输入框"
echo "    2. 看到提示：📋 已复制路径..."
echo "    3. 在Chat输入框按 Cmd+V 粘贴"
echo "    4. 看到绝对路径：/Users/felix/..."
echo ""
echo "  方法2：右键菜单"
echo "    1. 右键文件 → '复制路径到Chat'"
echo "    2. 点击'立即打开Chat'"  
echo "    3. 在Chat中按 Cmd+V 粘贴"
echo ""
echo "  方法3：快捷键"
echo "    1. 选中文件"
echo "    2. 按 Command+Shift+C"
echo "    3. 在Chat中按 Cmd+V 粘贴"
echo ""
echo "🎯 重要提示："
echo "  安装后请重新加载窗口："
echo "  Command+Shift+P → 'Reload Window'"
echo ""



