import { motion } from 'framer-motion';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Wrench, Grid3x3, Image, Film } from 'lucide-react';
import { ToolNodeData } from '@/types/nodes';
import { observer } from 'mobx-react-lite';
import { canvasStore } from '@/stores/canvasStore';

const ToolNode = observer(({ id, data, selected }: NodeProps<ToolNodeData>) => {
  const updateNodeData = (updates: Partial<ToolNodeData>) => {
    canvasStore.updateNode(id, updates);
  };

  const renderToolContent = () => {
    switch (data.toolType) {
      case 'character-turnaround':
        return (
          <div className="space-y-3">
            <p className="text-xs text-dark-400">生成角色的正、侧、背三视图</p>
            <div className="grid grid-cols-3 gap-2">
              {['正面', '侧面', '背面'].map((view) => (
                <div
                  key={view}
                  className="aspect-square bg-dark-900/50 border border-dark-700/30 rounded-lg flex items-center justify-center text-xs text-dark-500"
                >
                  {view}
                </div>
              ))}
            </div>
          </div>
        );

      case 'multi-angle-grid':
        return (
          <div className="space-y-3">
            <p className="text-xs text-dark-400">生成多个机位角度的九宫格</p>
            <div className="grid grid-cols-3 gap-1.5">
              {Array.from({ length: 9 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-dark-900/50 border border-dark-700/30 rounded flex items-center justify-center text-xs text-dark-500"
                >
                  {i + 1}
                </div>
              ))}
            </div>
          </div>
        );

      case 'story-grid':
        return (
          <div className="space-y-3">
            <p className="text-xs text-dark-400">生成剧情分镜四宫格</p>
            <div className="grid grid-cols-2 gap-2">
              {['起', '承', '转', '合'].map((stage) => (
                <div
                  key={stage}
                  className="aspect-square bg-dark-900/50 border border-dark-700/30 rounded-lg flex items-center justify-center text-sm text-dark-500 font-medium"
                >
                  {stage}
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`min-w-[320px] bg-dark-800/90 backdrop-blur-xl rounded-2xl border-2 transition-all shadow-elevated ${
        selected ? 'border-primary-500 shadow-hover' : 'border-dark-700/50'
      }`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!bg-primary-500 !w-3 !h-3 !border-2 !border-dark-900 hover:!w-4 hover:!h-4 transition-all"
      />

      {/* Header */}
      <div className="px-4 py-3 border-b border-dark-700/50 flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-yellow-500/20 to-orange-500/20 flex items-center justify-center">
          <Wrench className="w-4 h-4 text-yellow-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm truncate">
            {data.label}
          </h3>
          <p className="text-dark-400 text-xs">工具箱节点</p>
        </div>
        <StatusIndicator status={data.status || 'idle'} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <label className="text-xs text-dark-400 mb-1.5 block">工具类型</label>
          <select
            value={data.toolType || 'character-turnaround'}
            onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateNodeData({ toolType: e.target.value as any })}
            className="w-full px-3 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 nodrag"
          >
            <option value="character-turnaround">角色三视图</option>
            <option value="multi-angle-grid">多机位九宫格</option>
            <option value="story-grid">剧情推演四宫格</option>
          </select>
        </div>

        {renderToolContent()}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg nodrag"
        >
          <Wrench className="w-4 h-4" />
          生成
        </motion.button>
      </div>

      <Handle
        type="source"
        position={Position.Right}
        className="!bg-primary-500 !w-3 !h-3 !border-2 !border-dark-900 hover:!w-4 hover:!h-4 transition-all"
      />
    </motion.div>
  );
});

const StatusIndicator: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    idle: { color: 'bg-dark-600' },
    processing: { color: 'bg-primary-500 animate-pulse' },
    completed: { color: 'bg-green-500' },
    error: { color: 'bg-red-500' },
  };
  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.idle;
  return <div className={`w-2 h-2 rounded-full ${config.color}`} />;
};

export default ToolNode;
