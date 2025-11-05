# 📊 File Info Decorator

<div align="center">

![Version](https://img.shields.io/badge/version-1.8.0-blue.svg)
![License](https://img.shields.io/badge/license-MIT-green.svg)
![Platform](https://img.shields.io/badge/platform-VSCode%20%7C%20Cursor-orange.svg)

**一个强大的VSCode/Cursor扩展，为文件树添加详细信息、快速搜索和路径复制功能**

[功能特性](#-功能特性) • [安装](#-安装) • [使用指南](#-使用指南) • [快捷键](#-快捷键列表) • [配置](#-配置选项)

</div>

---

## 🎯 功能特性

### 📁 增强的文件浏览器

- ✅ **文件信息显示** - 显示修改时间和文件大小
- ✅ **多种排序方式** - 按名称/时间/大小排序
- ✅ **智能搜索** - 递归搜索，保持树形结构
- ✅ **全部展开/折叠** - 快速查看项目结构

### 🔍 极速搜索系统

- ✅ **自动索引** - 启动时后台建立文件索引
- ✅ **毫秒级响应** - 搜索速度提升100-500倍
- ✅ **递归搜索** - 搜索所有子文件夹的文件和文件夹
- ✅ **树形显示** - 保持文件夹结构，不展平
- ✅ **实时更新** - 文件变化时自动更新索引

### 📋 快速路径复制

- ✅ **一键复制** - 点击文件旁边的📋图标复制绝对路径
- ✅ **快捷键支持** - Command+Shift+C 快速复制
- ✅ **右键菜单** - 多种路径复制选项
- ✅ **AI友好** - 默认复制绝对路径，方便与Cursor Chat配合使用

### 🛠️ 完整的文件管理

- ✅ **新建/删除/重命名** - 完整的文件操作
- ✅ **剪切/复制/粘贴** - 支持文件移动和复制
- ✅ **拖放移动** - 拖动文件到目标文件夹
- ✅ **多选支持** - Command+点击或Shift+点击多选

---

## 📦 安装

### 方法1：从发布页面下载

1. 访问 [Releases](https://github.com/Qinsheng-Lin/xxh-file-detail/releases)
2. 下载最新版本的 `.vsix` 文件
3. 在VSCode/Cursor中安装：
   ```bash
   # 命令行安装
   cursor --install-extension file-info-decorator-1.8.0.vsix
   # 或
   code --install-extension file-info-decorator-1.8.0.vsix
   ```
4. 重新加载窗口：`Command+Shift+P` → `Reload Window`

### 方法2：使用安装脚本

```bash
cd /path/to/xxh-file-detail
./install-1.8.0.sh
```

---

## 🚀 使用指南

### 🔍 极速搜索

#### 基本使用

1. 点击工具栏的 🔍 **搜索** 按钮
2. 输入关键词（例如：`config`、`test`、`.tsx`）
3. 查看搜索结果（保持树形结构）
4. 点击 🗑️ **清除搜索** 恢复正常视图

#### 搜索示例

**搜索配置文件：**
```
搜索 "config" 找到：
  📄 config.json
  📁 src/
    ├─ 📄 config.ts
    └─ 📁 config/
         └─ 📄 database.config.ts
  📄 tsconfig.json
  📄 webpack.config.js
```

**搜索测试文件：**
```
搜索 ".test" 找到：
  📁 src/
    └─ 📁 components/
         └─ 📄 Button.test.tsx
  📁 tests/
    ├─ 📄 setup.test.ts
    └─ 📄 utils.test.ts
```

#### 搜索特点

- ✨ **保持树形结构** - 不会把所有结果展平
- ✨ **只显示相关路径** - 隐藏不包含匹配项的文件夹
- ✨ **递归所有层级** - 找到任何深度的文件
- ✨ **极速响应** - 毫秒级搜索（索引建立后）

### 📋 快速复制路径

#### 方法1：inline复制按钮（推荐）

1. 鼠标悬停到文件上
2. 点击右边出现的 📋 图标
3. 路径自动复制到剪贴板
4. 在Cursor Chat中按 `Cmd+V` 粘贴

#### 方法2：右键菜单

1. 右键点击文件
2. 选择 **"复制路径到Chat"** 或 **"复制绝对路径"**
3. 在Chat中粘贴

#### 方法3：快捷键

1. 选中文件
2. 按 `Command+Shift+C` (Mac) 或 `Ctrl+Shift+C` (Win/Linux)
3. 在Chat中粘贴

#### 路径格式

默认复制**绝对路径**，例如：
```
/Users/felix/Desktop/project/src/extension.ts
```

如需相对路径，在设置中修改：
```json
{
  "fileInfoDecorator.useRelativePathForChat": true
}
```

### 📂 文件管理

#### 新建文件/文件夹

- 点击工具栏的 📄 或 📁 图标
- 或右键文件夹 → **新建文件/文件夹**

#### 删除文件

- 选中文件，按 `Command+Backspace` (Mac) 或 `Delete` (Win/Linux)
- 或右键 → **删除**

#### 重命名

- 选中文件，按 `Enter`
- 或右键 → **重命名**

#### 复制/剪切/粘贴

- `Command+C` / `Command+X` / `Command+V`
- 或使用右键菜单

#### 拖放移动

- 拖动文件到目标文件夹
- 自动移动文件

### 🔄 排序功能

点击工具栏按钮切换排序方式：

- 📝 **按名称排序** - A-Z字母顺序
- ⏰ **按时间排序** - 最新的在前
- 📊 **按大小排序** - 最大的在前

### 📂 全部展开/折叠

- 📂 **全部展开** - 展开所有文件夹，查看完整项目结构
- 🔽 **全部折叠** - 折叠所有文件夹，只显示根目录

---

## ⌨️ 快捷键列表

### Mac

| 快捷键 | 功能 |
|--------|------|
| `Command+Backspace` | 删除文件/文件夹 |
| `Enter` | 重命名 |
| `Command+C` | 复制文件 |
| `Command+X` | 剪切文件 |
| `Command+V` | 粘贴文件 |
| `Command+Shift+C` | 复制绝对路径 |
| `Command+Option+C` | 复制相对路径 |
| `Command+Option+R` | 在Finder中显示 |
| `Command+A` | 全选 |

### Windows/Linux

| 快捷键 | 功能 |
|--------|------|
| `Delete` | 删除文件/文件夹 |
| `Enter` | 重命名 |
| `Ctrl+C` | 复制文件 |
| `Ctrl+X` | 剪切文件 |
| `Ctrl+V` | 粘贴文件 |
| `Ctrl+Shift+C` | 复制绝对路径 |
| `Ctrl+Alt+C` | 复制相对路径 |
| `Ctrl+Alt+R` | 在资源管理器中显示 |
| `Ctrl+A` | 全选 |

---

## 🎨 工具栏功能

从左到右：

| 图标 | 功能 | 说明 |
|------|------|------|
| 🔍 | 搜索文件 | 递归搜索所有文件和文件夹 |
| 🗑️ | 清除搜索 | 清除搜索过滤，恢复正常视图 |
| 📝 | 按名称排序 | A-Z字母顺序排序 |
| ⏰ | 按时间排序 | 按修改时间排序，最新的在前 |
| 📊 | 按大小排序 | 按文件大小排序，最大的在前 |
| 📂 | 全部展开 | 递归展开所有文件夹 |
| 🔄 | 刷新 | 强制刷新文件列表 |
| 📄 | 新建文件 | 在当前位置创建新文件 |
| 📁 | 新建文件夹 | 在当前位置创建新文件夹 |

---

## ⚙️ 配置选项

打开VSCode/Cursor设置，搜索 `File Info Decorator`：

### 显示选项

```json
{
  // 显示文件大小
  "fileInfoDecorator.showSize": true,
  
  // 显示修改时间
  "fileInfoDecorator.showDate": true,
  
  // 日期格式
  "fileInfoDecorator.dateFormat": "YYYY/M/D HH:mm",
  
  // 在文件夹上也显示信息
  "fileInfoDecorator.showOnFolders": false
}
```

### 路径复制选项

```json
{
  // Chat路径使用相对路径（false=绝对路径）
  "fileInfoDecorator.useRelativePathForChat": false,
  
  // 拖放到编辑器时使用相对路径
  "fileInfoDecorator.useRelativePathOnDrop": true,
  
  // 拖放时同时打开文件预览
  "fileInfoDecorator.openFileOnDrop": true
}
```

### 日期格式说明

| 格式 | 说明 | 示例 |
|------|------|------|
| `YYYY` | 4位年份 | 2025 |
| `YY` | 2位年份 | 25 |
| `M` | 月份（1-12） | 1, 11 |
| `MM` | 月份（补零） | 01, 11 |
| `D` | 日期（1-31） | 3, 15 |
| `DD` | 日期（补零） | 03, 15 |
| `HH` | 小时（补零） | 09, 21 |
| `mm` | 分钟（补零） | 05, 42 |
| `ss` | 秒数（补零） | 08, 59 |

---

## 🎬 使用场景

### 场景1：向AI询问文件

```
1. 在"文件信息浏览器"找到文件
2. 点击文件旁边的 📋 复制图标
3. 打开Cursor Chat
4. 按 Cmd+V 粘贴路径
5. 输入问题："请帮我优化这个文件的代码"
6. AI能准确定位文件并给出建议
```

### 场景2：查找配置文件

```
1. 点击 🔍 搜索
2. 输入 "config"
3. 看到所有配置文件（保持树形结构）
4. 展开相关文件夹查看详情
5. 点击 🗑️ 清除搜索
```

### 场景3：快速定位文件

```
1. 搜索文件名关键词
2. 在树形结构中找到目标文件
3. 点击 📋 复制路径
4. 在其他地方使用
```

### 场景4：批量管理文件

```
1. 按住 Command 多选文件
2. 右键 → 选择操作（删除/移动等）
3. 批量处理
```

---

## 🚀 性能特点

### 极速索引搜索

| 项目规模 | 文件数 | 索引时间 | 搜索速度 | 提升 |
|---------|-------|---------|---------|------|
| 小项目 | <100 | ~100ms | ~5ms | - |
| 中项目 | 100-1000 | ~500ms | ~10ms | **200倍** |
| 大项目 | 1000-5000 | ~2s | ~20ms | **100倍** |
| 巨型项目 | >5000 | ~5s | ~50ms | **100倍** |

**特点：**
- ✅ 启动时后台自动建立索引
- ✅ 首次搜索即可享受极速体验
- ✅ 文件变化时自动更新索引
- ✅ 智能跳过大型目录（node_modules等）

---

## 📖 详细文档

### 右键菜单完整功能

**路径操作：**
- 💬 复制路径到Chat - 复制路径并提供"立即打开Chat"选项
- 📋 复制绝对路径 - 复制完整路径
- 📄 复制相对路径 - 复制相对于工作区的路径

**导航操作：**
- 在侧边打开 - 在新编辑器组中打开文件
- 在Finder中显示 - 在系统文件管理器中定位
- 在集成终端中打开 - 在终端打开文件夹

**编辑操作：**
- ✂️ 剪切 - 剪切文件/文件夹
- 📋 复制 - 复制文件/文件夹
- 📋 粘贴 - 粘贴文件/文件夹

**新建操作：**
- 📄 新建文件 - 在当前文件夹创建文件
- 📁 新建文件夹 - 在当前文件夹创建文件夹

**其他操作：**
- 🔄 重命名 - 重命名文件/文件夹
- 🗑️ 删除 - 删除文件/文件夹
- 🔍 查找引用 - 查找文件中的所有引用
- 🔀 比较文件 - 比较两个文件的差异

### 多选功能

| 操作 | 功能 |
|------|------|
| `Command+点击` (Mac) / `Ctrl+点击` (Win) | 多选/取消选择单个文件 |
| `Shift+点击` | 范围选择（从上一个选中到当前项） |
| `Command+A` / `Ctrl+A` | 全选当前文件夹所有项 |

---

## 🎯 与Cursor Chat配合使用

### 方法1：inline复制按钮（最快）

```
1. 悬停文件 → 点击 📋
2. 打开Cursor Chat
3. Cmd+V 粘贴
4. 输入问题
```

### 方法2：右键菜单

```
1. 右键文件 → "复制路径到Chat"
2. 点击提示中的"立即打开Chat"
3. Cmd+V 粘贴
4. 与AI对话
```

### 方法3：快捷键（键盘党首选）

```
1. 选中文件 → Command+Shift+C
2. 打开Chat → Cmd+V
3. 开始对话
```

---

## 🎨 自定义样式

### 选中效果优化

如果选中效果不够明显，在设置中添加：

```json
{
  "workbench.colorCustomizations": {
    "list.activeSelectionBackground": "#0078d4",
    "list.activeSelectionForeground": "#ffffff",
    "list.inactiveSelectionBackground": "#37373d",
    "list.hoverBackground": "#2a2d2e"
  }
}
```

---

## 🔧 常见问题

### Q: 搜索找不到node_modules里的文件？

**A:** 为了性能考虑，默认跳过 `node_modules`、`dist`、`build`、`out` 等大型目录。搜索时这些目录不会被索引。

### Q: 快捷键不工作？

**A:** 确保焦点在"文件信息浏览器"面板上。点击面板，然后尝试快捷键。

### Q: 为什么需要按Cmd+V粘贴？

**A:** 由于VSCode/Cursor的安全限制，扩展无法直接操作Chat输入框。但我们已经做到了：拖动/点击时自动复制路径到剪贴板，你只需粘贴即可。

### Q: 索引多久更新一次？

**A:** 索引会实时更新：
- 新建文件 → 自动添加
- 修改文件 → 自动更新
- 删除文件 → 自动移除

### Q: 如何查看索引状态？

**A:** 打开开发者工具（Help → Toggle Developer Tools → Console），可以看到：
```
File Info Decorator: 开始建立文件索引...
文件索引建立完成！共索引 XXX 个文件，XXX 个文件夹，耗时 XXXms
```

---

## 📊 版本历史

### v1.8.0 (2025-11-05) - 当前版本

- ✨ **树形结构搜索** - 保持文件夹层级，不展平
- ✅ 智能路径过滤 - 只显示包含匹配项的文件夹
- ✅ 修复Command+Backspace删除快捷键
- ✅ 修复所有右键菜单功能支持快捷键调用

### v1.7.5 (2025-11-05)

- ✨ 启动时自动建立索引
- ✅ 文件变化时自动更新索引
- ✅ 递归搜索所有子文件夹

### v1.7.4 (2025-11-05)

- ✨ 智能索引系统 - 搜索速度提升100-500倍
- ✅ 自动跳过大型目录

### v1.7.3 (2025-11-05)

- ✨ 递归搜索功能
- ✅ 全部展开按钮

### v1.6.x - v1.7.2

- 各种功能改进和bug修复

查看完整更新日志：[CHANGELOG.md](./CHANGELOG.md)

---

## 🛠️ 开发

### 本地开发

```bash
# 克隆仓库
git clone https://github.com/Qinsheng-Lin/xxh-file-detail.git
cd xxh-file-detail

# 安装依赖
npm install

# 编译
npm run compile

# 监听模式（开发时使用）
npm run watch

# 打包
npx vsce package --allow-missing-repository
```

### 调试

1. 在VSCode/Cursor中打开项目
2. 按 `F5` 启动调试
3. 在新窗口中测试扩展功能

### 项目结构

```
xxh-file-detail/
├── src/
│   └── extension.ts       # 主要源代码
├── out/
│   └── extension.js       # 编译后的代码
├── package.json           # 扩展配置
├── tsconfig.json          # TypeScript配置
├── README.md              # 本文档
└── install-*.sh           # 安装脚本
```

---

## 📄 许可证

MIT License

Copyright (c) 2025 Xiaohong Xin, Qinsheng Lin

---

## 👥 贡献者

- **Xiaohong Xin** - 核心开发
- **Qinsheng Lin** - 核心开发

---

## 🙏 致谢

感谢所有使用和反馈的用户！

---

## 📮 联系我们

- **GitHub Issues**: [提交问题](https://github.com/Qinsheng-Lin/xxh-file-detail/issues)
- **Email**: 通过GitHub联系

---

## 🌟 如果觉得有用，请给个Star！

<div align="center">

**让文件管理更高效！** 🚀

[⬆ 回到顶部](#-file-info-decorator)

</div>
