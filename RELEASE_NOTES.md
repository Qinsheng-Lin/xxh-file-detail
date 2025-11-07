## 🎉 File Info Decorator v1.8.0

一个强大的VSCode/Cursor扩展，为文件树添加详细信息、极速搜索和智能路径复制功能。

---

## 🌟 主要特性

### 🔍 树形结构搜索

**全新的搜索体验！** 搜索时保持文件夹的层级结构，不再将结果展平显示。

**示例：搜索 "config"**
```
📁 项目/
  ├─ 📄 config.json          ← 匹配
  ├─ 📄 tsconfig.json        ← 匹配
  └─ 📁 src/
      ├─ 📄 config.ts        ← 匹配
      └─ 📁 config/          ← 文件夹匹配
          ├─ 📄 database.config.ts
          └─ 📄 api.config.ts
```

**特点：**
- ✅ 保持文件夹层级结构，清晰直观
- ✅ 只显示包含匹配项的路径
- ✅ 递归搜索所有子文件夹
- ✅ 同时搜索文件和文件夹名称

### 🚀 自动索引系统

**极速搜索，性能提升100-500倍！**

**工作机制：**
1. **启动时自动建立** - Cursor启动时后台建立文件索引（1-2秒）
2. **实时自动更新** - 新建/修改/删除文件时自动同步索引
3. **毫秒级搜索** - 从索引查找，搜索速度极快

**性能数据：**

| 项目规模 | 文件数 | 搜索速度 | 性能提升 |
|---------|-------|---------|---------|
| 中型项目 | 100-1000 | ~10ms | **200倍** |
| 大型项目 | 1000-5000 | ~20ms | **100倍** |

**智能优化：**
- 自动跳过 `node_modules`、`dist`、`build` 等大型目录
- 减少索引时间和内存占用

### 📋 一键复制路径

**最简单的路径复制方式！**

- **inline复制按钮** - 鼠标悬停到文件上，点击右边的 📋 图标即可复制
- **快捷键支持** - `Command+Shift+C` (Mac) 或 `Ctrl+Shift+C` (Win/Linux)
- **AI友好** - 默认复制绝对路径，完美配合Cursor Chat使用

**使用流程：**
```
1. 点击📋图标 → 路径已复制
2. 打开Cursor Chat
3. Cmd+V 粘贴
4. 与AI对话，AI能准确定位文件
```

---

## ✨ 完整功能列表

### 🔍 搜索功能
- [x] 递归搜索所有子文件夹
- [x] 搜索文件和文件夹
- [x] 树形结构显示结果
- [x] 智能路径过滤
- [x] 极速索引搜索（毫秒级）
- [x] 自动索引更新

### 📋 路径复制
- [x] inline复制按钮（📋图标）
- [x] 复制绝对路径
- [x] 复制相对路径
- [x] 复制路径到Chat
- [x] 快捷键支持

### 🛠️ 文件管理
- [x] 新建文件/文件夹
- [x] 删除文件/文件夹
- [x] 重命名（快捷键：Enter）
- [x] 剪切/复制/粘贴
- [x] 拖放移动文件
- [x] 多选支持（Command+点击、Shift+点击）

### 📊 排序和视图
- [x] 按名称排序
- [x] 按时间排序（最新的在前）
- [x] 按大小排序（最大的在前）
- [x] 全部展开/折叠
- [x] 显示文件大小
- [x] 显示修改时间
- [x] 自定义日期格式

### ⌨️ 完整快捷键

**Mac:**
- `Command+Backspace` - 删除
- `Enter` - 重命名
- `Command+C/X/V` - 复制/剪切/粘贴
- `Command+Shift+C` - 复制绝对路径
- `Command+Option+C` - 复制相对路径
- `Command+Option+R` - 在Finder中显示

**Windows/Linux:**
- `Delete` - 删除
- `Enter` - 重命名
- `Ctrl+C/X/V` - 复制/剪切/粘贴
- `Ctrl+Shift+C` - 复制绝对路径
- `Ctrl+Alt+C` - 复制相对路径
- `Ctrl+Alt+R` - 在资源管理器中显示

---

## 📥 安装方法

### 快速安装（推荐）

1. 下载 `file-info-decorator-1.8.0.vsix` 文件
2. 运行安装命令：
   ```bash
   cursor --install-extension file-info-decorator-1.8.0.vsix
   # 或使用VSCode
   code --install-extension file-info-decorator-1.8.0.vsix
   ```
3. 重新加载窗口：`Command+Shift+P` → `Reload Window`

### 使用安装脚本

```bash
git clone https://github.com/Qinsheng-Lin/xxh-file-detail.git
cd xxh-file-detail
./install.sh
```

---

## 🎯 使用场景

### 场景1：与AI配合使用

```
1. 在文件浏览器中找到文件
2. 点击📋复制图标
3. 打开Cursor Chat
4. Cmd+V 粘贴路径
5. 输入："请帮我优化这个文件的代码"
6. AI能准确定位文件并给出建议
```

### 场景2：快速查找文件

```
1. 点击🔍搜索
2. 输入关键词（如 "config"）
3. 在树形结果中找到文件
4. 点击打开或复制路径
```

### 场景3：查看项目结构

```
1. 点击📂全部展开
2. 查看完整项目结构
3. 按时间/大小排序
4. 分析文件组织
```

---

## 📊 性能对比

### 搜索速度（1000个文件的项目）

| 操作 | 传统方式 | v1.8.0 | 提升 |
|-----|---------|--------|------|
| 首次搜索 | ~2秒 | ~2秒 | - |
| 后续搜索 | ~2秒 | **~10ms** | **200倍** |

---

## 🔧 配置选项

在设置中搜索 `File Info Decorator` 可配置：

- 显示文件大小和修改时间
- 日期格式自定义
- 路径格式（相对/绝对）
- 拖放行为

---

## 📖 文档

- [README - 完整使用文档](https://github.com/Qinsheng-Lin/xxh-file-detail/blob/main/README.md)
- [CHANGELOG - 更新日志](https://github.com/Qinsheng-Lin/xxh-file-detail/blob/main/CHANGELOG.md)

---

## 🐛 问题反馈

遇到问题？[提交Issue](https://github.com/Qinsheng-Lin/xxh-file-detail/issues)

---

## 🌟 如果觉得有用，请给个Star！

**让文件管理更高效！** 🚀



