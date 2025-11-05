#!/bin/bash

# 构建脚本
echo "开始编译..."
npm run compile

echo ""
echo "开始打包..."
vsce package --allow-missing-repository

echo ""
echo "完成！查看生成的 .vsix 文件："
ls -lh *.vsix | tail -1

echo ""
echo "安装命令："
echo "code --install-extension file-info-decorator-1.6.0.vsix"

echo ""
echo "重新加载窗口："
echo "按 Cmd+Shift+P → 输入 reload window"


