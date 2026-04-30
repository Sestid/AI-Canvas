import { CustomNode, CustomEdge } from './nodes';

export interface CanvasState {
  nodes: CustomNode[];
  edges: CustomEdge[];
  selectedNodeId: string | null;
  viewport: {
    x: number;
    y: number;
    zoom: number;
  };
}

export interface Project {
  id: string;
  name: string;
  canvasState: CanvasState;
  createdAt: number;
  updatedAt: number;
}

export interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  nodeType?: string;
  category: 'node' | 'utility';
}
