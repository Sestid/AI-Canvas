import { Node, Edge } from '@xyflow/react';

export type NodeType = 'text' | 'image' | 'video' | 'audio' | 'script' | 'tool';

export interface BaseNodeData {
  label: string;
  status?: 'idle' | 'processing' | 'completed' | 'error';
  createdAt: number;
  updatedAt: number;
}

export interface TextNodeData extends BaseNodeData {
  type: 'text';
  prompt?: string;
  model?: string;
  output?: string;
  customText?: string;
  activeTab?: 'generate' | 'custom';
}

export interface ImageNodeData extends BaseNodeData {
  type: 'image';
  prompt?: string;
  style?: string;
  aspectRatio?: string;
  resolution?: string;
  horizontalRotation?: number;
  verticalAngle?: number;
  focalLength?: number;
  imageUrl?: string;
}

export interface VideoNodeData extends BaseNodeData {
  type: 'video';
  mode?: 'text-to-video' | 'frame-to-video';
  prompt?: string;
  imageUrl?: string;
  aspectRatio?: string;
  resolution?: string;
  duration?: number;
  enableAudio?: boolean;
  cameraMovement?: string;
  videoUrl?: string;
}

export interface AudioNodeData extends BaseNodeData {
  type: 'audio';
  script?: string;
  pauseMarkers?: number[];
  intonations?: Array<{ position: number; type: string }>;
  audioUrl?: string;
  waveform?: number[];
}

export interface ScriptNodeData extends BaseNodeData {
  type: 'script';
  prompt?: string;
  model?: string;
  output?: string;
}

export interface ToolNodeData extends BaseNodeData {
  type: 'tool';
  toolType?: 'character-turnaround' | 'multi-angle-grid' | 'story-grid';
  config?: Record<string, any>;
}

export type CustomNodeData =
  | TextNodeData
  | ImageNodeData
  | VideoNodeData
  | AudioNodeData
  | ScriptNodeData
  | ToolNodeData;

export type CustomNode = Node<CustomNodeData>;
export type CustomEdge = Edge;
