# 安装说明

## 方法一：开发模式运行

这是最简单的测试方式：

1. **安装依赖**
```bash
cd /Users/felix/Desktop/xxhFD
npm install
```

2. **编译代码**
```bash
npm run compile
```

3. **在VSCode中打开此项目**
```bash
code .
```

4. **按 F5 键**
   - 这会启动一个新的VSCode扩展开发窗口
   - 在新窗口中打开任意项目，就能看到文件树中的文件信息了

## 方法二：打包安装

1. **安装打包工具**
```bash
npm install -g @vscode/vsce
```

2. **打包扩展**
```bash
cd /Users/felix/Desktop/xxhFD
npm install
npm run compile
vsce package
```

3. **安装生成的 .vsix 文件**
   - 在VSCode中按 `Cmd+Shift+P` (Mac) 或 `Ctrl+Shift+P` (Windows/Linux)
   - 输入 "Extensions: Install from VSIX..."
   - 选择生成的 `file-info-decorator-1.0.0.vsix` 文件

4. **重启VSCode**

## 验证安装

1. 打开任意项目文件夹
2. 查看左侧文件树
3. 每个文件后面应该显示时间和大小信息，格式如：`2025/11/3 20:59, 6.33 kB`

## 自定义配置

按 `Cmd+,` (Mac) 或 `Ctrl+,` (Windows/Linux) 打开设置，搜索 "File Info Decorator"，可以配置：
- 是否显示大小
- 是否显示日期
- 日期格式
- 是否在文件夹上显示信息

## 故障排除

如果安装后没有显示信息：

1. **检查是否启用**
   - 打开命令面板，输入 "Developer: Show Running Extensions"
   - 确认 "File Info Decorator" 在列表中且状态为运行

2. **查看日志**
   - 打开命令面板，输入 "Developer: Toggle Developer Tools"
   - 在Console标签查看是否有错误信息

3. **重新加载窗口**
   - 打开命令面板，输入 "Developer: Reload Window"

4. **检查设置**
   - 确保 `fileInfoDecorator.showSize` 或 `fileInfoDecorator.showDate` 至少有一个为 `true`




