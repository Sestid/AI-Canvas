# AI Canvas 架构设计文档

## 📐 整体架构

### 技术栈

```
┌─────────────────────────────────────────┐
│           React 18 + TypeScript         │
├─────────────────────────────────────────┤
│  UI Layer                               │
│  ├─ Components (React Components)       │
│  ├─ Framer Motion (Animations)          │
│  └─ TailwindCSS (Styling)               │
├─────────────────────────────────────────┤
│  State Management                       │
│  └─ MobX (Reactive State)               │
├─────────────────────────────────────────┤
│  Canvas Engine                          │
│  └─ React Flow (Infinite Canvas)        │
├─────────────────────────────────────────┤
│  Build Tool                             │
│  └─ Vite (Fast HMR)                     │
└─────────────────────────────────────────┘
```

---

## 🏗️ 分层架构

### 1. 表现层 (Presentation Layer)

**职责**：UI 渲染和用户交互

**组件结构**：

```
App
├── Header (顶部栏)
│   ├── Logo
│   ├── SaveStatus
│   └── ActionButtons
├── Sidebar (左侧工具栏)
│   └── SidebarItem[]
├── Canvas (画布核心)
│   ├── ReactFlow
│   ├── Background
│   ├── Controls
│   ├── MiniMap
│   └── CustomNodes[]
├── Inspector (右侧属性面板)
│   └── NodeInspector
└── CommandPalette (命令面板)
```

**设计模式**：
- **容器/展示组件分离**：逻辑组件 vs 纯展示组件
- **组合模式**：通过组合构建复杂 UI
- **观察者模式**：MobX 自动订阅状态变化

---

### 2. 状态管理层 (State Management Layer)

**职责**：应用状态管理和业务逻辑

#### CanvasStore

```typescript
class CanvasStore {
  // 状态
  nodes: Node[]           // 所有节点
  edges: Edge[]           // 所有连线
  selectedNodeId: string  // 选中的节点

  // 计算属性
  get selectedNode()      // 获取选中节点

  // 动作
  addNode()               // 添加节点
  updateNode()            // 更新节点
  deleteNode()            // 删除节点
  selectNode()            // 选择节点
  onNodesChange()         // 节点变化处理
  onEdgesChange()         // 连线变化处理
  onConnect()             // 连接处理
}
```

**特点**：
- 使用 MobX `makeAutoObservable` 自动追踪
- 所有修改通过 action 方法
- 自动触发组件重渲染

#### HistoryStore

```typescript
class HistoryStore {
  // 状态
  history: HistoryEntry[] // 历史记录栈
  currentIndex: number    // 当前位置

  // 计算属性
  get canUndo()           // 是否可撤销
  get canRedo()           // 是否可重做

  // 动作
  push()                  // 推入新状态
  undo()                  // 撤销
  redo()                  // 重做
  clear()                 // 清空历史
}
```

**实现原理**：
- 深拷贝状态快照
- 限制历史记录数量（默认 50）
- 时间戳记录

#### UIStore

```typescript
class UIStore {
  // 状态
  sidebarCollapsed: boolean
  commandPaletteOpen: boolean
  contextMenu: ContextMenuState | null

  // 动作
  toggleSidebar()
  openCommandPalette()
  closeCommandPalette()
  showContextMenu()
  hideContextMenu()
}
```

---

### 3. 数据层 (Data Layer)

**职责**：数据持久化和 API 交互

#### 本地存储

```typescript
// utils/storage.ts
export const storage = {
  save(key: string, data: any): void
  load(key: string): any
  remove(key: string): void
  clear(): void
}
```

**实现**：
- 使用 `localStorage` 存储
- JSON 序列化/反序列化
- 自动保存（防抖 30 秒）

#### API 层（预留）

```typescript
// 未来扩展
export const api = {
  // 节点操作
  generateText(prompt: string): Promise<string>
  generateImage(params: ImageParams): Promise<string>
  generateVideo(params: VideoParams): Promise<string>

  // 用户操作
  saveProject(project: Project): Promise<void>
  loadProject(id: string): Promise<Project>
}
```

---

## 🎨 节点系统设计

### 节点类型定义

```typescript
// 基础节点数据
interface BaseNodeData {
  label: string
  type: NodeType
  status: 'idle' | 'processing' | 'completed' | 'error'
  createdAt: number
  updatedAt: number
}

// 扩展节点数据
interface TextNodeData extends BaseNodeData {
  type: 'text'
  prompt?: string
  model?: string
  output?: string
  customText?: string
  activeTab?: 'generate' | 'custom'
}

// ... 其他节点类型
```

### 节点工厂模式

```typescript
// utils/nodeFactory.ts
export const createNode = (
  type: NodeType,
  position: { x: number; y: number }
): Node => {
  const baseData = {
    label: getDefaultLabel(type),
    type,
    status: 'idle',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  }

  return {
    id: generateId(),
    type,
    position,
    data: { ...baseData, ...getTypeSpecificData(type) },
  }
}
```

**优势**：
- 统一创建逻辑
- 类型安全
- 易于扩展

---

## 🔄 数据流设计

### 单向数据流

```
用户操作
    ↓
Store Action
    ↓
State 更新
    ↓
MobX 通知
    ↓
组件重渲染
```

### 示例：添加节点流程

```typescript
// 1. 用户点击侧边栏按钮
<button onClick={() => handleAddNode('text')}>

// 2. 调用 Store 方法
const handleAddNode = (type: NodeType) => {
  canvasStore.addNode(type, position)
}

// 3. Store 更新状态
addNode(type: NodeType, position: Position) {
  const newNode = createNode(type, position)
  this.nodes.push(newNode)  // MobX 自动追踪
}

// 4. 组件自动重渲染
const Canvas = observer(() => {
  const { nodes } = canvasStore  // 自动订阅
  return <ReactFlow nodes={nodes} />
})
```

---

## ⚡ 性能优化策略

### 1. React 层面

**组件优化**：
```typescript
// 使用 React.memo 避免不必要的重渲染
export default React.memo(TextNode)

// 使用 useCallback 缓存回调
const handleClick = useCallback(() => {
  // ...
}, [deps])
```

**虚拟化**：
- React Flow 内置虚拟化
- 只渲染可见区域的节点

### 2. MobX 层面

**细粒度响应**：
```typescript
// 只订阅需要的属性
const selectedNode = canvasStore.getSelectedNode()

// 而不是
const { nodes, edges, ... } = canvasStore
```

**计算属性缓存**：
```typescript
@computed
get selectedNode() {
  return this.nodes.find(n => n.id === this.selectedNodeId)
}
```

### 3. 渲染优化

**防抖保存**：
```typescript
const debouncedSave = debounce(() => {
  storage.save('canvas', canvasStore.serialize())
}, 30000)
```

**懒加载**：
```typescript
const CommandPalette = lazy(() => import('./CommandPalette'))
```

---

## 🔌 扩展性设计

### 1. 插件系统（规划）

```typescript
interface Plugin {
  name: string
  version: string
  install(app: App): void
}

// 使用
app.use(customNodePlugin)
```

### 2. 自定义节点类型

```typescript
// 1. 定义数据类型
interface CustomNodeData extends BaseNodeData {
  type: 'custom'
  customField: string
}

// 2. 创建组件
const CustomNode: React.FC<NodeProps<CustomNodeData>> = (props) => {
  // ...
}

// 3. 注册节点类型
const nodeTypes = {
  ...defaultNodeTypes,
  custom: CustomNode,
}
```

### 3. 主题系统（规划）

```typescript
interface Theme {
  colors: ColorPalette
  spacing: SpacingScale
  typography: TypographyScale
}

// 使用
<ThemeProvider theme={darkTheme}>
  <App />
</ThemeProvider>
```

---

## 🔒 安全性考虑

### 1. XSS 防护

- React 自动转义
- 避免 `dangerouslySetInnerHTML`
- 用户输入验证

### 2. 数据验证

```typescript
// 类型守卫
function isValidNode(data: any): data is Node {
  return (
    typeof data.id === 'string' &&
    typeof data.type === 'string' &&
    // ...
  )
}
```

### 3. 本地存储限制

- 限制存储大小（< 5MB）
- 定期清理过期数据
- 错误处理和降级

---

## 📊 监控和调试

### 1. MobX DevTools

```typescript
import { configure } from 'mobx'

configure({
  enforceActions: 'always',
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
})
```

### 2. React DevTools

- 组件树查看
- Props 和 State 检查
- 性能分析

### 3. 自定义日志

```typescript
// utils/logger.ts
export const logger = {
  info: (msg: string, data?: any) => console.log(`[INFO] ${msg}`, data),
  warn: (msg: string, data?: any) => console.warn(`[WARN] ${msg}`, data),
  error: (msg: string, data?: any) => console.error(`[ERROR] ${msg}`, data),
}
```

---

## 🚀 部署架构

### 开发环境

```
Vite Dev Server (HMR)
    ↓
http://localhost:3000
```

### 生产环境

```
Vite Build
    ↓
Static Files (dist/)
    ↓
CDN / Static Hosting
    ↓
https://your-domain.com
```

**推荐部署平台**：
- Vercel
- Netlify
- Cloudflare Pages
- AWS S3 + CloudFront

---

## 📈 未来架构演进

### Phase 1: 当前（MVP）
- ✅ 基础节点系统
- ✅ 画布操作
- ✅ 本地存储

### Phase 2: 增强功能
- ⏳ Undo/Redo 完整实现
- ⏳ 节点模板系统
- ⏳ 导出功能

### Phase 3: 云端协作
- 📋 后端 API
- 📋 用户系统
- 📋 实时协作（WebSocket）

### Phase 4: AI 集成
- 📋 真实 AI 模型调用
- 📋 智能推荐
- 📋 自动化工作流

---

## 🎯 设计原则

1. **单一职责**：每个模块只做一件事
2. **开闭原则**：对扩展开放，对修改关闭
3. **依赖倒置**：依赖抽象而非具体实现
4. **组合优于继承**：通过组合构建功能
5. **保持简单**：避免过度设计

---

**架构是演进的，而非一蹴而就** 🏗️
