# Flowcraft 插件开发指南

## 概述

本指南介绍如何为 Flowcraft 开发插件，包括前端组件和后端执行器的开发规范。

## 插件结构

一个标准的 Flowcraft 插件包含以下文件：

```
my-plugin/
├── plugin.json          # 插件清单文件
├── schema.json          # 节点参数模式定义
├── frontend/
│   ├── nodeComponent.js # 前端组件代码
│   └── icon.svg         # 插件图标（可选）
└── backend/
    └── executor.js      # 后端执行器代码（可选）
```

## 前端组件开发

### 导出标准

**重要：插件系统支持多种导出方式，推荐使用标准导出**

#### 推荐方式（标准导出）

```javascript
// 方式 1: 默认导出函数组件
export default function MyPluginNode({ data }) {
  return React.createElement('div', null, 'My Plugin');
}

// 方式 2: 默认导出箭头函数组件
const MyPluginNode = ({ data }) => {
  return React.createElement('div', null, 'My Plugin');
};
export default MyPluginNode;
```

#### 兼容方式

```javascript
// CommonJS 导出（兼容旧版本）
function MyPluginNode({ data }) {
  return React.createElement('div', null, 'My Plugin');
}
module.exports = { default: MyPluginNode };

// 命名导出（自动检测）
function MyPluginNode({ data }) {
  return React.createElement('div', null, 'My Plugin');
}
// 系统会自动检测并使用此函数（优先级：*Node > *Component > 大写开头）

// IIFE/UMD 导出（打包工具生成）
var MyPluginNode = (() => {
  // 组件实现
  return function MyPluginNode({ data }) {
    return React.createElement('div', null, 'My Plugin');
  };
})();
// 系统会从全局变量中自动检测
```

#### 导出优先级

插件加载器按以下优先级检测组件：

1. **ESM 默认导出**: `export default Component`
2. **CommonJS 导出**: `module.exports = { default: Component }`
3. **直接函数返回**: IIFE 直接返回函数
4. **全局变量检测**: 按命名优先级查找全局新增的函数
   - `RemoveBGNode` (特定匹配)
   - `*Node` 结尾的函数
   - `*Component` 结尾的函数
   - 大写字母开头的函数

### 组件开发规范

1. **函数命名**：使用 PascalCase，建议以 "Node" 结尾
2. **参数接收**：组件接收 `{ data }` 参数
3. **依赖使用**：React 和 ReactFlow 组件通过全局变量提供
4. **样式定义**：使用内联样式或 CSS-in-JS

### 可用依赖

插件组件可以访问以下全局变量：

- `React` - React 库（包含所有 Hooks）
- `Handle` - ReactFlow 连接点组件
- `Position` - ReactFlow 位置枚举
- `ReactFlow` - ReactFlow 库（完整对象）

**注意**: 插件系统会自动注入这些依赖，无需手动导入。

### 示例组件

```javascript
function ImageResizerNode({ data }) {
  const [width, setWidth] = React.useState(data.params?.width || 800);
  const [height, setHeight] = React.useState(data.params?.height || 600);

  return React.createElement(
    'div',
    {
      style: {
        padding: '12px',
        background: 'linear-gradient(145deg, hsl(220, 15%, 14%), hsl(220, 15%, 16%))',
        border: '2px solid hsl(270, 50%, 40%)',
        borderRadius: '12px',
        width: '200px',
        color: 'hsl(220, 8%, 92%)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.6)',
      }
    },
    // 输入连接点
    React.createElement(Handle, {
      type: 'target',
      position: Position.Left,
      id: 'image',
      style: { background: 'hsl(270, 50%, 40%)', border: '2px solid hsl(270, 50%, 40%)' }
    }),
    // 组件内容
    React.createElement('div', null, 'Image Resizer'),
    // 输出连接点
    React.createElement(Handle, {
      type: 'source',
      position: Position.Right,
      id: 'image',
      style: { background: 'hsl(270, 50%, 40%)', border: '2px solid hsl(270, 50%, 40%)' }
    })
  );
}

// 标准导出
export default ImageResizerNode;
```

## 插件清单 (plugin.json)

```json
{
  "$schema": "https://flowcraft.dev/schema/plugin.json",
  "name": "image-resizer",
  "id": "flowcraft.image-resizer",
  "label": "Image Resizer",
  "version": "1.0.0",
  "description": "Resize images to specified dimensions",
  "author": "Flowcraft Team",
  "license": "MIT",
  "type": "node",
  "category": "Image",
  "keywords": ["image", "resize", "transform"],
  "icon": "frontend/icon.svg",
  "frontend": {
    "entry": "frontend/nodeComponent.js"
  },
  "backend": {
    "entry": "backend/executor.js",
    "runtime": "node"
  },
  "schema": "schema.json",
  "inputs": ["image"],
  "outputs": ["image"]
}
```

## 参数模式 (schema.json)

```json
{
  "type": "object",
  "properties": {
    "width": {
      "type": "integer",
      "title": "Width",
      "description": "Target width in pixels",
      "default": 800,
      "minimum": 1,
      "maximum": 4096
    },
    "height": {
      "type": "integer", 
      "title": "Height",
      "description": "Target height in pixels",
      "default": 600,
      "minimum": 1,
      "maximum": 4096
    }
  },
  "required": ["width", "height"]
}
```

## 后端执行器开发

后端执行器用于处理节点的实际业务逻辑：

```javascript
class ImageResizerExecutor {
  async execute(inputs, parameters, context) {
    const { image } = inputs;
    const { width, height } = parameters;
    
    // 处理图像调整大小逻辑
    const resizedImage = await this.resizeImage(image, width, height);
    
    return {
      image: resizedImage
    };
  }
  
  async resizeImage(image, width, height) {
    // 实现图像调整大小逻辑
    // 这里可以使用 Canvas API 或其他图像处理库
    return image;
  }
}

module.exports = ImageResizerExecutor;
```

## 插件打包和分发

1. 将所有文件打包为 ZIP 格式
2. 确保 `plugin.json` 在根目录
3. 通过 Flowcraft 的插件管理器上传

## 最佳实践

### 导出规范
- ✅ 使用 `export default` 导出组件（推荐）
- ✅ 函数名使用 PascalCase，建议以 "Node" 结尾
- ✅ 添加适当的注释和文档
- ✅ 支持多种导出方式（ESM、CommonJS、IIFE）
- ❌ 避免使用小写开头的函数名
- ❌ 避免没有导出的函数
- ❌ 避免使用 `import` 语句（依赖会自动注入）

### 组件设计
- 保持组件简洁，专注于单一功能
- 使用一致的样式和交互模式
- 提供清晰的输入输出连接点
- 添加适当的错误处理

### 性能优化
- 避免在组件中进行重计算
- 合理使用 React 状态管理
- 优化图像和资源加载

## 常见问题

### Q: 为什么我的插件加载失败？
A: 检查以下几点：
1. **导出问题**: 确保使用了正确的导出方式（推荐 `export default`）
2. **函数命名**: 函数名使用 PascalCase，建议以 "Node" 结尾
3. **依赖问题**: 不要使用 `import` 语句，依赖会自动注入
4. **打包问题**: 确保打包工具正确生成了组件导出

### Q: 如何调试插件？
A: 在浏览器开发者工具中查看控制台输出：
- 插件加载器会提供详细的错误信息
- 成功加载时会显示警告信息（如使用命名导出）
- 兜底加载时会显示从全局变量加载的提示

### Q: 支持哪些 React 特性？
A: 支持基本的 React 功能，包括：
- 函数组件
- Hooks (useState, useEffect, useCallback 等)
- 事件处理
- 条件渲染
- 列表渲染

### Q: 我的 IIFE/UMD 打包插件无法加载？
A: 确保：
1. 源文件包含 `export default Component`
2. 打包工具正确生成了组件导出
3. 全局变量命名符合规范（如 `RemoveBGNode`）

### Q: 如何优化插件性能？
A: 建议：
1. 使用 `React.useCallback` 优化事件处理函数
2. 避免在渲染函数中进行重计算
3. 合理使用 `React.useMemo` 缓存计算结果
4. 避免不必要的状态更新

## 更新日志

- **v1.2.0**: 增强插件导出兼容性
  - 支持 IIFE/UMD 打包格式
  - 添加全局变量兜底检测
  - 优化 CommonJS 导出支持
  - 改进错误提示和调试信息
- **v1.1.0**: 添加了插件导出验证系统
- **v1.0.0**: 初始版本，支持基本的插件开发
