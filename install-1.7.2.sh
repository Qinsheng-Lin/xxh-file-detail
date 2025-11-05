#!/bin/bash

# File Info Decorator v1.7.2 快速安装脚本

echo "🚀 开始安装 File Info Decorator v1.7.2..."
echo ""
echo "📝 v1.7.2 改进："
echo "  ✨ 新增'全部展开'按钮（对应全部折叠）"
echo "  ✅ 移除拖动复制路径功能"
echo "  ✅ 每个文件旁边有复制按钮"
echo "  ✅ 支持多选：Command+点击、Shift+点击"
echo ""

# 检查是否存在vsix文件
if [ ! -f "file-info-decorator-1.7.2.vsix" ]; then
    echo "❌ 错误：找不到 file-info-decorator-1.7.2.vsix 文件"
    exit 1
fi

# 卸载旧版本
echo "🗑️  卸载旧版本..."
cursor --uninstall-extension xiaohong-xin-qinsheng-lin.file-info-decorator 2>/dev/null

echo ""
echo "📦 安装新版本..."
cursor --install-extension file-info-decorator-1.7.2.vsix

echo ""
echo "✨ 安装完成！"
echo ""
echo "📋 工具栏按钮（从左到右）："
echo "  🔍 搜索文件"
echo "  🗑️  清除搜索"
echo "  📝 按名称排序"
echo "  ⏰ 按时间排序"
echo "  📊 按大小排序"
echo "  📂 全部展开 ← 新功能！"
echo "  🔄 刷新"
echo "  📄 新建文件"
echo "  📁 新建文件夹"
echo ""
echo "📋 复制路径方式："
echo "  • 悬停文件 → 点击📋图标"
echo "  • 右键 → '复制路径到Chat'"
echo "  • Command+Shift+C快捷键"
echo ""
echo "📋 多选文件："
echo "  • Command+点击 - 多选/取消"
echo "  • Shift+点击 - 范围选择"
echo "  • Command+A - 全选"
echo ""
echo "📋 快捷键："
echo "  • Command+Backspace - 删除"
echo "  • Enter - 重命名"
echo "  • Command+C/X/V - 复制/剪切/粘贴"
echo ""
echo "🎯 重要提示："
echo "  安装后请重新加载窗口："
echo "  Command+Shift+P → 'Reload Window'"
echo ""
echo "🎉 现在试试'全部展开'按钮吧！"
echo ""

