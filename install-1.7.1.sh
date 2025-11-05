#!/bin/bash

# File Info Decorator v1.7.1 快速安装脚本

echo "🚀 开始安装 File Info Decorator v1.7.1..."
echo ""
echo "📝 v1.7.1 改进："
echo "  ✨ 每个文件旁边有复制按钮（点击复制绝对路径）"
echo "  ✅ 移除双击复制（影响正常选中）"
echo "  ✅ 修复选中效果（蓝色高亮）"
echo "  ✅ 所有快捷键正常工作"
echo ""

# 检查是否存在vsix文件
if [ ! -f "file-info-decorator-1.7.1.vsix" ]; then
    echo "❌ 错误：找不到 file-info-decorator-1.7.1.vsix 文件"
    exit 1
fi

# 卸载旧版本
echo "🗑️  卸载旧版本..."
cursor --uninstall-extension xiaohong-xin-qinsheng-lin.file-info-decorator 2>/dev/null

echo ""
echo "📦 安装新版本..."
cursor --install-extension file-info-decorator-1.7.1.vsix

echo ""
echo "✨ 安装完成！"
echo ""
echo "📋 新功能：一键复制按钮 ✨"
echo ""
echo "  使用方法："
echo "    1. 鼠标悬停到文件上"
echo "    2. 看到文件名右边出现复制图标 📋"
echo "    3. 点击复制图标"
echo "    4. 看到提示：✅ 已复制绝对路径"
echo "    5. 在Chat中按 Cmd+V 粘贴"
echo ""
echo "  超简单："
echo "    悬停 → 点击图标 → 完成！"
echo ""
echo "📋 其他方式："
echo ""
echo "  方法2：右键菜单"
echo "    右键文件 → '复制路径到Chat' → Cmd+V"
echo ""
echo "  方法3：快捷键"
echo "    选中文件 → Command+Shift+C → Cmd+V"
echo ""
echo "🎯 快捷键列表："
echo "  Command+Backspace - 删除"
echo "  Enter - 重命名"
echo "  Command+C - 复制文件"
echo "  Command+X - 剪切"
echo "  Command+V - 粘贴"
echo "  Command+Shift+C - 复制绝对路径"
echo "  Command+Option+C - 复制相对路径"
echo ""
echo "🎯 重要提示："
echo "  安装后请重新加载窗口："
echo "  Command+Shift+P → 'Reload Window'"
echo ""
echo "🎉 现在试试新的复制按钮吧！"
echo ""

