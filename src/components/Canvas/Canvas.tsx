import { useCallback, useRef, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { App } from 'antd';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  NodeTypes,
  Connection,
  addEdge,
  useReactFlow,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { canvasStore } from '@/stores/canvasStore';
import { uiStore } from '@/stores/uiStore';
import { NodeType } from '@/types/nodes';
import TextNode from '@/components/Nodes/TextNode/TextNode';
import ImageNode from '@/components/Nodes/ImageNode/ImageNode';
import VideoNode from '@/components/Nodes/VideoNode/VideoNode';
import AudioNode from '@/components/Nodes/AudioNode/AudioNode';
import ScriptNode from '@/components/Nodes/ScriptNode/ScriptNode';
import ToolNode from '@/components/Nodes/ToolNode/ToolNode';

const nodeTypes: NodeTypes = {
  text: TextNode,
  image: ImageNode,
  video: VideoNode,
  audio: AudioNode,
  script: ScriptNode,
  tool: ToolNode,
};

const Canvas = observer(() => {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const { screenToFlowPosition, fitView } = useReactFlow();

  // 直接使用 toJS 转换，observer 会自动追踪 MobX 的变化并重新渲染
  // 每次 nodes 或 edges 变化时都会重新转换，这样可以确保数据同步
  const nodes = toJS(canvasStore.nodes);
  const edges = toJS(canvasStore.edges);
  const prevNodeCountRef = useRef(nodes.length);

  const onNodesChange = useCallback((changes: any) => {
    canvasStore.onNodesChange(changes);
  }, []);

  const onEdgesChange = useCallback((changes: any) => {
    canvasStore.onEdgesChange(changes);
  }, []);

  const onConnect = useCallback((connection: Connection) => {
    const newEdge = {
      ...connection,
      id: `edge-${Date.now()}`,
      type: 'smoothstep',
      animated: true,
      style: { stroke: '#0ea5e9', strokeWidth: 2 },
    };
    canvasStore.onConnect(newEdge as any);
  }, []);

  const onNodeClick = useCallback((_: any, node: any) => {
    canvasStore.selectNode(node.id);
  }, []);

  const onPaneClick = useCallback(() => {
    canvasStore.selectNode(null);
    uiStore.hideContextMenu();
  }, []);

  const onNodeContextMenu = useCallback((event: React.MouseEvent, node: any) => {
    event.preventDefault();
    uiStore.showContextMenu(event.clientX, event.clientY, node.id);
  }, []);

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback((event: React.DragEvent) => {
    event.preventDefault();

    const type = event.dataTransfer.getData('application/reactflow') as NodeType;

    if (!type) {
      return;
    }

    const position = screenToFlowPosition({
      x: event.clientX,
      y: event.clientY,
    });

    canvasStore.addNode(type, position);

    // 添加节点后，延迟调整视图以确保节点渲染完成
    setTimeout(() => {
      fitView({
        padding: 0.2,
        duration: 400,
        nodes: [{ id: canvasStore.nodes[canvasStore.nodes.length - 1].id }]
      });
    }, 50);
  }, [screenToFlowPosition, fitView]);

  // 监听节点数量变化，自动调整视图
  useEffect(() => {
    if (nodes.length > prevNodeCountRef.current && nodes.length > 0) {
      // 新增节点时，平滑过渡到显示所有节点
      setTimeout(() => {
        fitView({
          padding: 0.2,
          duration: 400,
          maxZoom: 1.5
        });
      }, 100);
    }
    prevNodeCountRef.current = nodes.length;
  }, [nodes.length, fitView]);

  return (
    <div ref={reactFlowWrapper} className="flex-1 relative bg-dark-950">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        onNodeContextMenu={onNodeContextMenu}
        onDragOver={onDragOver}
        onDrop={onDrop}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2, maxZoom: 1.5 }}
        attributionPosition="bottom-right"
        proOptions={{ hideAttribution: true }}
        className="react-flow-dark"
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color="rgba(255, 255, 255, 0.05)"
          className="bg-dark-950"
        />

        <Controls
          className="!bg-dark-800/90 !backdrop-blur-xl !border !border-dark-700/50 !rounded-xl !shadow-elevated overflow-hidden"
          showInteractive={false}
        />

        <MiniMap
          className="!bg-dark-800/90 !backdrop-blur-xl !border !border-dark-700/50 !rounded-xl !shadow-elevated"
          nodeColor={(node) => {
            const colors: Record<string, string> = {
              text: '#0ea5e9',
              image: '#a78bfa',
              video: '#fb923c',
              audio: '#34d399',
              script: '#3b82f6',
              tool: '#facc15',
            };
            return colors[node.type || 'text'] || '#0ea5e9';
          }}
          maskColor="rgba(10, 10, 12, 0.8)"
        />
      </ReactFlow>

      {/* Context Menu */}
      {uiStore.contextMenu && (
        <ContextMenu
          x={uiStore.contextMenu.x}
          y={uiStore.contextMenu.y}
          nodeId={uiStore.contextMenu.nodeId}
          onClose={() => uiStore.hideContextMenu()}
        />
      )}
    </div>
  );
});

interface ContextMenuProps {
  x: number;
  y: number;
  nodeId?: string;
  onClose: () => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({ x, y, nodeId, onClose }) => {
  const { message } = App.useApp();

  const handleDelete = () => {
    if (nodeId) {
      canvasStore.deleteNode(nodeId);
      message.success('节点已删除');
    }
    onClose();
  };

  const handleDuplicate = () => {
    // TODO: 实现复制节点
    message.info('复制功能开发中...');
    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-40" onClick={onClose} />
      <div
        className="fixed z-50 min-w-[160px] bg-dark-800/95 backdrop-blur-xl border border-dark-700/50 rounded-xl shadow-elevated overflow-hidden"
        style={{ left: x, top: y }}
      >
        <button
          onClick={handleDuplicate}
          className="w-full px-4 py-2.5 text-left text-sm text-white hover:bg-dark-700/50 transition-all flex items-center gap-2"
        >
          复制节点
        </button>
        <div className="h-px bg-dark-700/50" />
        <button
          onClick={handleDelete}
          className="w-full px-4 py-2.5 text-left text-sm text-red-400 hover:bg-red-500/10 transition-all flex items-center gap-2"
        >
          删除节点
        </button>
      </div>
    </>
  );
};

export default Canvas;
