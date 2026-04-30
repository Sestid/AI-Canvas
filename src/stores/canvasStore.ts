import { makeAutoObservable } from 'mobx';
import { CustomNode, CustomEdge, NodeType, CustomNodeData } from '@/types/nodes';
import { Edge, EdgeChange, NodeChange, applyNodeChanges, applyEdgeChanges, addEdge } from '@xyflow/react';

class CanvasStore {
  nodes: CustomNode[] = [];
  edges: CustomEdge[] = [];
  selectedNodeId: string | null = null;
  isSaving = false;
  lastSaved: number | null = null;

  constructor() {
    makeAutoObservable(this);
    this.loadFromStorage();

    (window as any).canvasStore = this;
  }

  // 节点操作
  addNode(type: NodeType, position: { x: number; y: number }) {
    const newNode: CustomNode = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: this.getDefaultNodeData(type),
    };
    this.nodes.push(newNode);
    this.selectedNodeId = newNode.id;
  }

  deleteNode(nodeId: string) {
    this.nodes = this.nodes.filter((node) => node.id !== nodeId);
    this.edges = this.edges.filter(
      (edge) => edge.source !== nodeId && edge.target !== nodeId
    );
    if (this.selectedNodeId === nodeId) {
      this.selectedNodeId = null;
    }
  }

  updateNode(nodeId: string, data: Partial<CustomNodeData>) {
    const node = this.nodes.find((n) => n.id === nodeId);
    if (node) {
      node.data = { ...node.data, ...data, updatedAt: Date.now() };
    }
  }

  selectNode(nodeId: string | null) {
    this.selectedNodeId = nodeId;
  }

  getSelectedNode(): CustomNode | null {
    return this.nodes.find((node) => node.id === this.selectedNodeId) || null;
  }

  // React Flow 变更处理
  onNodesChange(changes: NodeChange[]) {
    this.nodes = applyNodeChanges(changes, this.nodes) as CustomNode[];
  }

  onEdgesChange(changes: EdgeChange[]) {
    this.edges = applyEdgeChanges(changes, this.edges);
  }

  onConnect(connection: Edge | CustomEdge) {
    // 使用 addEdge 正确添加边，并转换为普通数组
    const newEdges = addEdge(connection, this.edges.slice());
    this.edges = newEdges as CustomEdge[];
  }

  // 存储相关
  async saveToStorage() {
    this.isSaving = true;
    try {
      const state = {
        nodes: this.nodes,
        edges: this.edges,
        selectedNodeId: this.selectedNodeId,
      };
      localStorage.setItem('ai-canvas-state', JSON.stringify(state));
      this.lastSaved = Date.now();
    } catch (error) {
      console.error('Save failed:', error);
    } finally {
      this.isSaving = false;
    }
  }

  loadFromStorage() {
    try {
      const saved = localStorage.getItem('ai-canvas-state');
      if (saved) {
        const state = JSON.parse(saved);
        this.nodes = state.nodes || [];
        this.edges = state.edges || [];
        this.selectedNodeId = state.selectedNodeId || null;
      }
    } catch (error) {
      console.error('Load failed:', error);
    }
  }

  clearCanvas() {
    this.nodes = [];
    this.edges = [];
    this.selectedNodeId = null;
  }

  // 默认节点数据
  private getDefaultNodeData(type: NodeType): CustomNodeData {
    const base = {
      label: this.getNodeLabel(type),
      status: 'idle' as const,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    switch (type) {
      case 'text':
        return { ...base, type, activeTab: 'generate' };
      case 'image':
        return {
          ...base,
          type,
          aspectRatio: '16:9',
          resolution: '1024x1024',
          horizontalRotation: 0,
          verticalAngle: 0,
          focalLength: 50
        };
      case 'video':
        return {
          ...base,
          type,
          mode: 'text-to-video',
          aspectRatio: '16:9',
          duration: 5,
          enableAudio: false
        };
      case 'audio':
        return { ...base, type, pauseMarkers: [], intonations: [] };
      case 'script':
        return { ...base, type, model: 'gpt-4' };
      case 'tool':
        return { ...base, type, toolType: 'character-turnaround' };
      default:
        return base as any;
    }
  }

  private getNodeLabel(type: NodeType): string {
    const labels: Record<NodeType, string> = {
      text: '文本节点',
      image: '图片生成',
      video: '视频生成',
      audio: '音频生成',
      script: '脚本生成',
      tool: '工具箱',
    };
    return labels[type];
  }
}

export const canvasStore = new CanvasStore();
