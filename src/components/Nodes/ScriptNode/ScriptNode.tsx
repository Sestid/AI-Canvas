import { motion } from 'framer-motion';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { FileText, Sparkles } from 'lucide-react';
import { ScriptNodeData } from '@/types/nodes';
import { observer } from 'mobx-react-lite';
import { canvasStore } from '@/stores/canvasStore';

const ScriptNode = observer(({ id, data, selected }: NodeProps<ScriptNodeData>) => {
  const updateNodeData = (updates: Partial<ScriptNodeData>) => {
    canvasStore.updateNode(id, updates);
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`min-w-[340px] bg-dark-800/90 backdrop-blur-xl rounded-2xl border-2 transition-all shadow-elevated ${
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
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-blue-500/20 flex items-center justify-center">
          <FileText className="w-4 h-4 text-primary-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm truncate">
            {data.label}
          </h3>
          <p className="text-dark-400 text-xs">脚本生成节点</p>
        </div>
        <StatusIndicator status={data.status || 'idle'} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <div>
          <label className="text-xs text-dark-400 mb-1.5 block">Prompt</label>
          <textarea
            value={data.prompt || ''}
            onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateNodeData({ prompt: e.target.value })}
            placeholder="描述你想要生成的脚本..."
            className="w-full px-3 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none nodrag"
            rows={4}
          />
        </div>

        <div>
          <label className="text-xs text-dark-400 mb-1.5 block">模型</label>
          <select
            value={data.model || 'gpt-4'}
            onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateNodeData({ model: e.target.value })}
            className="w-full px-3 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 nodrag"
          >
            <option value="gpt-4">GPT-4</option>
            <option value="gpt-3.5">GPT-3.5 Turbo</option>
            <option value="claude">Claude 3</option>
          </select>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-500 to-blue-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg nodrag"
        >
          <Sparkles className="w-4 h-4" />
          生成脚本
        </motion.button>

        {data.output && (
          <div className="p-3 bg-dark-900/50 border border-dark-700/30 rounded-lg text-sm text-dark-200 max-h-48 overflow-y-auto space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs text-dark-400 font-medium">生成结果</span>
              <button className="text-xs text-primary-400 hover:text-primary-300 nodrag">
                复制
              </button>
            </div>
            <div className="whitespace-pre-wrap">{data.output}</div>
          </div>
        )}
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

export default ScriptNode;
