#!/bin/bash

# File Info Decorator v1.7.5 快速安装脚本

echo "🚀 开始安装 File Info Decorator v1.7.5..."
echo ""
echo "📝 v1.7.5 重大改进："
echo "  ✨ 启动时自动建立索引（后台进行）"
echo "  ✅ 搜索递归显示所有子文件夹的结果"
echo "  ✅ 文件变化时自动更新索引"
echo "  ✅ 搜索文件和文件夹"
echo "  ✅ 极速搜索（毫秒级）"
echo ""

# 检查是否存在vsix文件
if [ ! -f "file-info-decorator-1.7.5.vsix" ]; then
    echo "❌ 错误：找不到 file-info-decorator-1.7.5.vsix 文件"
    exit 1
fi

# 卸载旧版本
echo "🗑️  卸载旧版本..."
cursor --uninstall-extension xiaohong-xin-qinsheng-lin.file-info-decorator 2>/dev/null

echo ""
echo "📦 安装新版本..."
cursor --install-extension file-info-decorator-1.7.5.vsix

echo ""
echo "✨ 安装完成！"
echo ""
echo "🔍 搜索功能（已完美实现）："
echo ""
echo "  特点："
echo "    ✅ 递归搜索所有子文件夹"
echo "    ✅ 搜索文件和文件夹"
echo "    ✅ 结果展平显示在根级别"
echo "    ✅ 毫秒级响应（有索引后）"
echo ""
echo "  示例："
echo "    搜索 'test' 会找到："
echo "      📄 test.ts"
echo "      📁 tests/"
echo "      📄 src/utils/test.ts"
echo "      📄 components/test.tsx"
echo "      📁 src/tests/"
echo "      所有匹配的文件和文件夹！"
echo ""
echo "🚀 自动索引："
echo "  • Cursor启动时自动建立索引"
echo "  • 新建文件 → 自动添加"
echo "  • 修改文件 → 自动更新"
echo "  • 删除文件 → 自动移除"
echo ""
echo "📋 其他功能："
echo "  • 点击📋复制路径"
echo "  • Command+Shift+C快捷键"
echo "  • 全部展开/折叠"
echo "  • 多选支持"
echo ""
echo "🎯 重要提示："
echo "  安装后请重新加载窗口："
echo "  Command+Shift+P → 'Reload Window'"
echo ""
echo "💡 查看索引状态："
echo "  Help → Toggle Developer Tools → Console"
echo "  看到：'文件索引建立完成！共索引 XXX 个文件，XXX 个文件夹'"
echo ""
echo "🎉 享受完美的递归搜索！"
echo ""
