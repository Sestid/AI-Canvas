# AI Canvas - 智能创作工作台

<div align="center">

![AI Canvas Logo](https://img.shields.io/badge/AI-Canvas-0ea5e9?style=for-the-badge&logo=react&logoColor=white)

**一个现代化的 AI 创作工作台，灵感来自 LibTV Canvas**

[![React](https://img.shields.io/badge/React-18.x-61dafb?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646cff?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-06b6d4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

[English](README.md) · [简体中文](README_CN.md)

</div>

---

## 📖 简介

AI Canvas 是一个专业级的 AI 创作工作台，提供可视化的节点编辑器，让你可以像搭积木一样组织 AI 创作流程。

### 为什么选择 AI Canvas？

- 🎯 **可视化工作流** - 直观的节点连线，清晰展示创作流程
- 🚀 **开箱即用** - 无需配置，克隆即可运行
- 🎨 **专业设计** - 对标 Figma、Linear 的高级 UI 设计
- 💪 **类型安全** - 完整的 TypeScript 支持
- 🔧 **易于扩展** - 清晰的架构，方便添加新节点

---

## ✨ 核心特性

### 🎨 六大节点类型

| 节点类型 | 功能描述 | 主要特性 |
|---------|---------|---------|
| 📝 **文本节点** | AI 文本生成 | 支持多模型、自定义输入 |
| 🖼️ **图片节点** | AI 图片生成 | 风格选择、机位控制、高级参数 |
| 🎬 **视频节点** | AI 视频生成 | 文/图生视频、运镜控制 |
| 🎵 **音频节点** | AI 音频生成 | 台词编辑、语气控制 |
| 📄 **脚本节点** | AI 脚本生成 | Prompt 驱动、多模型 |
| 🛠️ **工具箱节点** | 专业工具 | 三视图、九宫格、四宫格 |

### 🎯 画布功能

- ✅ **无限画布** - 自由缩放、平移
- ✅ **拖拽创建** - 从侧边栏拖拽节点到画布
- ✅ **智能连线** - 左右连接点，清晰的数据流向
- ✅ **右键菜单** - 快速操作节点
- ✅ **MiniMap** - 画布缩略图导航
- ✅ **网格背景** - 专业的网格背景

### 💾 数据管理

- ✅ **自动保存** - 实时保存到 localStorage
- ✅ **手动保存** - 一键保存当前状态
- ✅ **导出功能** - 导出为 JSON 文件
- ✅ **状态持久化** - 刷新页面不丢失数据

---

## 🚀 快速开始

### 前置要求

- Node.js >= 18.0.0
- npm / pnpm / yarn

### 安装步骤

```bash
# 1. 克隆项目
git clone https://github.com/yourusername/ai-canvas.git
cd ai-canvas

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 打开浏览器访问
# http://localhost:5173
```

### 构建生产版本

```bash
# 构建
npm run build

# 预览构建结果
npm run preview
```

---

## 📸 界面预览

### 主界面
> 深色主题 + 毛玻璃效果 + 流畅动画

*提示：运行项目后截图并保存到 `docs/images/main-interface.png`*

### 节点展示

<table>
  <tr>
    <td align="center" width="50%">
      <b>文本节点</b><br/>
      <sub>AI 生成 / 自定义输入</sub>
    </td>
    <td align="center" width="50%">
      <b>图片节点</b><br/>
      <sub>风格选择 / 机位控制</sub>
    </td>
  </tr>
  <tr>
    <td align="center" width="50%">
      <b>视频节点</b><br/>
      <sub>文图生视频 / 运镜控制</sub>
    </td>
    <td align="center" width="50%">
      <b>音频节点</b><br/>
      <sub>台词编辑 / 语气控制</sub>
    </td>
  </tr>
</table>

---

## ⌨️ 快捷键

| 快捷键 | 功能 |
|--------|------|
| `⌘/Ctrl + K` | 打开命令面板 |
| `⌘/Ctrl + S` | 保存画布 |
| `Delete` / `Backspace` | 删除选中节点 |
| `ESC` | 取消选择 |

---

## 🎯 技术栈

### 前端框架
- **React 18** - 用户界面库
- **TypeScript** - 类型安全的 JavaScript
- **Vite** - 极速的构建工具

### UI 框架
- **TailwindCSS** - 实用优先的 CSS 框架
- **Framer Motion** - 强大的动画库
- **Ant Design** - 企业级 UI 组件
- **Lucide React** - 精美的图标库

### 核心库
- **React Flow** - 专业的流程图库
- **MobX** - 简单高效的状态管理

---

## 📁 项目结构

```
ai-canvas/
├── src/
│   ├── components/          # 组件目录
│   │   ├── Header/         # 顶部导航栏
│   │   ├── Sidebar/        # 左侧工具栏
│   │   ├── Canvas/         # 画布组件
│   │   ├── Nodes/          # 节点组件
│   │   │   ├── TextNode/   # 文本节点
│   │   │   ├── ImageNode/  # 图片节点
│   │   │   ├── VideoNode/  # 视频节点
│   │   │   ├── AudioNode/  # 音频节点
│   │   │   ├── ScriptNode/ # 脚本节点
│   │   │   └── ToolNode/   # 工具箱节点
│   │   └── CommandPalette/ # 命令面板
│   ├── stores/             # 状态管理
│   │   ├── canvasStore.ts  # 画布状态
│   │   ├── historyStore.ts # 历史记录
│   │   └── uiStore.ts      # UI 状态
│   ├── hooks/              # 自定义 Hooks
│   ├── types/              # TypeScript 类型
│   ├── utils/              # 工具函数
│   └── App.tsx             # 根组件
├── docs/                   # 文档
│   ├── images/            # 截图
│   └── SCREENSHOTS.md     # 截图说明
├── public/                 # 静态资源
└── README.md              # 项目文档
```

---

## 🏗️ 核心架构

### 状态管理 (MobX)

```typescript
// Canvas Store - 画布状态
class CanvasStore {
  nodes: CustomNode[]           // 节点列表
  edges: CustomEdge[]           // 连线列表
  selectedNodeId: string | null // 选中节点

  addNode(type, position)       // 添加节点
  deleteNode(id)                // 删除节点
  updateNode(id, data)          // 更新节点
  saveToStorage()               // 保存到本地
}
```

### 节点系统

所有节点都基于统一的数据结构：

```typescript
interface CustomNodeData {
  label: string                 // 节点标题
  status: 'idle' | 'processing' | 'completed' | 'error'
  createdAt: number            // 创建时间
  updatedAt: number            // 更新时间
}
```

### 数据流

```
用户操作 → Store 更新 → 组件重渲染 → UI 更新
         ↓
    localStorage 持久化
```

---

## 🎨 设计规范

### 配色方案

```css
/* 主色 */
--primary: #0ea5e9       /* 天蓝色 */
--accent-purple: #a78bfa /* 紫色 */
--accent-pink: #f472b6   /* 粉色 */
--accent-green: #34d399  /* 绿色 */
--accent-orange: #fb923c /* 橙色 */

/* 深色背景 */
--dark-950: #0a0a0c      /* 最深 */
--dark-900: #111113
--dark-800: #1a1a1d
--dark-700: #27272a      /* 最浅 */
```

### 设计原则

1. **专业感** - 对标一线产品的 UI 质量
2. **层次感** - 使用毛玻璃和阴影营造深度
3. **流畅性** - 微动效提升交互体验
4. **一致性** - 统一的视觉语言

---

## 📝 开发指南

### 添加新节点类型

1. **创建节点组件**

```typescript
// src/components/Nodes/MyNode/MyNode.tsx
import { observer } from 'mobx-react-lite';
import { NodeProps } from '@xyflow/react';

const MyNode = observer(({ id, data, selected }: NodeProps<MyNodeData>) => {
  const updateNodeData = (updates: Partial<MyNodeData>) => {
    canvasStore.updateNode(id, updates);
  };

  return (
    <motion.div className="...">
      {/* 节点内容 */}
    </motion.div>
  );
});

export default MyNode;
```

2. **定义类型**

```typescript
// src/types/nodes.ts
export interface MyNodeData extends CustomNodeData {
  type: 'my-node';
  // 自定义字段
  customField: string;
}
```

3. **注册节点**

```typescript
// src/components/Canvas/Canvas.tsx
const nodeTypes: NodeTypes = {
  'my-node': MyNode,
  // ...其他节点
};
```

4. **添加到侧边栏**

```typescript
// src/components/Sidebar/Sidebar.tsx
const tools = [
  { type: 'my-node', icon: MyIcon, label: '我的节点' },
  // ...
];
```

### 开发规范

- ✅ 使用 TypeScript 确保类型安全
- ✅ 使用 `observer` 包裹响应式组件
- ✅ 交互元素添加事件阻止冒泡
- ✅ 使用 `nodrag` 类名防止拖拽冲突
- ✅ 遵循 ESLint 和 Prettier 规范

---

## 🚧 开发路线图

### ✅ 已完成

- [x] 基础画布系统
- [x] 六大节点类型
- [x] 拖拽创建节点
- [x] 节点连线
- [x] 自动保存
- [x] 导出功能
- [x] 右键菜单
- [x] Toast 提示

### 🔄 进行中

- [ ] Undo/Redo 系统
- [ ] 节点模板库
- [ ] 快捷键自定义

### 📅 计划中

- [ ] 自动布局算法
- [ ] 协同编辑
- [ ] AI 自动生成工作流
- [ ] 插件系统
- [ ] 云端保存
- [ ] 移动端适配
- [ ] 多语言支持

---

## 🤝 参与贡献

欢迎提交 Issue 和 Pull Request！

### 贡献步骤

1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交 Pull Request

### 提交规范

使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
feat: 添加新功能
fix: 修复 bug
docs: 文档更新
style: 代码格式调整
refactor: 代码重构
test: 测试相关
chore: 构建/工具链相关
```

---

## 📄 开源协议

本项目基于 [MIT License](LICENSE) 开源。

---

## 🙏 鸣谢

感谢以下开源项目：

- [React Flow](https://reactflow.dev/) - 强大的流程图库
- [TailwindCSS](https://tailwindcss.com/) - 优秀的 CSS 框架
- [Framer Motion](https://www.framer.com/motion/) - 流畅的动画库
- [MobX](https://mobx.js.org/) - 简单的状态管理
- [LibTV Canvas](https://libtv.com/) - 设计灵感来源

---

## 📮 联系方式

如有问题或建议，欢迎通过以下方式联系：

- **GitHub Issues**: [提交问题](https://github.com/yourusername/ai-canvas/issues)
- **Email**: your.email@example.com

---

<div align="center">

**⭐ 如果觉得不错，请给个 Star 支持一下！⭐**

Made with ❤️ by [Your Name]

[⬆ 回到顶部](#ai-canvas---智能创作工作台)

</div>
