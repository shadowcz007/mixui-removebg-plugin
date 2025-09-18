# MixUI Remove Background Plugin

一个为 Flowcraft 设计的背景移除插件，使用 `@imgly/background-removal` 库实现高质量的图像背景移除功能。

## 功能特性

- 🎯 **高质量背景移除**: 基于 AI 模型的智能背景分割
- 🖼️ **多格式支持**: 支持 PNG 和 JPEG 输出格式
- ⚙️ **可配置参数**: 调试模式、输出格式、JPEG 质量等
- 🔄 **实时参数同步**: 与 Flowcraft 节点系统完美集成
- 📦 **独立打包**: 所有依赖内置，无需额外安装

## 插件结构

```
mixui-removebg-plugin/
├── frontend/
│   ├── nodeComponent.js    # 前端组件源码
│   └── icon.svg           # 插件图标
├── backend/
│   └── executor.js        # 后端执行器源码
├── dist/                  # 构建产物
│   ├── frontend.js        # 前端组件包
│   ├── backend.js         # 后端执行器包
│   └── background-removal.runtime.js  # 背景移除库
├── scripts/
│   └── build.js          # 构建脚本
├── plugin.json           # 插件清单
├── schema.json           # 参数模式定义
└── package.json          # 项目配置
```

## 构建和开发

### 安装依赖

```bash
npm install
```

### 构建插件

```bash
npm run build
```

构建完成后，`dist/` 目录将包含：
- `frontend.js`: 前端组件，暴露为全局变量 `RemoveBGNode`
- `backend.js`: 后端执行器，暴露为全局变量 `RemoveBGExecutor`
- `background-removal.runtime.js`: 背景移除库，暴露为全局变量 `ImglyBackgroundRemoval`

### 清理构建产物

```bash
npm run clean
```

## 在 Flowcraft 中使用

### 方法一：使用打包脚本（推荐）

```bash
# 一键构建并打包
npm run package
# 或者
npm run dist
```

这将生成 `mixui-removebg-plugin.zip` 文件，直接上传到 Flowcraft 即可。

### 方法二：手动打包

```bash
# 1. 构建插件
npm run build

# 2. 手动将 dist/ 目录打包为 ZIP 文件
# 注意：只打包 dist/ 目录的内容，不是整个插件目录
```

### 上传和使用

1. **上传插件**: 在 Flowcraft 中通过插件管理器上传 `mixui-removebg-plugin.zip` 文件
2. **使用节点**: 在节点编辑器中拖拽 "Remove Background" 节点到画布

## 参数配置

插件支持以下参数：

- **Output Format**: 输出格式（PNG/JPEG）
- **JPEG Quality**: JPEG 质量（10-100，仅当选择 JPEG 时显示）
- **Debug**: 调试模式开关

## 输入输出

- **输入**: `image_base64` (string[]) - Base64 编码的图像数组
- **输出**: `image_base64` (string[]) - 处理后的 Base64 编码图像数组

## 技术实现

### 前端组件
- 使用 React 创建节点 UI
- 实时同步参数到 Flowcraft 节点系统
- 支持多种导出方式以确保兼容性

### 后端执行器
- 使用 `@imgly/background-removal` 进行背景移除
- 支持多种 Canvas API 回退方案
- 处理不同输出格式的转换

### 构建系统
- 使用 esbuild 进行快速打包
- 将所有依赖内联到构建产物中
- 生成全局变量以便动态加载

## 兼容性

- **浏览器**: 支持现代浏览器（ES2020+）
- **Flowcraft**: 兼容 Flowcraft 插件系统
- **Canvas API**: 自动回退到 DOM Canvas（当 OffscreenCanvas 不可用时）

## 许可证

MIT License

## 更新日志

### v1.0.0
- 初始版本
- 支持 PNG/JPEG 输出格式
- 集成到 Flowcraft 插件系统
- 独立打包所有依赖
