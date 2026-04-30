import { motion } from 'framer-motion';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Type, Sparkles } from 'lucide-react';
import { TextNodeData } from '@/types/nodes';
import { observer } from 'mobx-react-lite';
import { canvasStore } from '@/stores/canvasStore';
import { useState } from 'react';

const TextNode = observer(({ id, data, selected }: NodeProps<TextNodeData>) => {
  const [activeTab, setActiveTab] = useState<'generate' | 'custom'>(data.activeTab || 'generate');

  const updateNodeData = (updates: Partial<TextNodeData>) => {
    canvasStore.updateNode(id, updates);
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
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500/20 to-accent-purple/20 flex items-center justify-center">
          <Type className="w-4 h-4 text-primary-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm truncate">
            {data.label}
          </h3>
          <p className="text-dark-400 text-xs">文本生成节点</p>
        </div>
        <StatusIndicator status={data.status || 'idle'} />
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 flex gap-1 border-b border-dark-700/30">
        <TabButton
          active={activeTab === 'generate'}
          onClick={() => {
            setActiveTab('generate');
            updateNodeData({ activeTab: 'generate' });
          }}
        >
          AI 生成
        </TabButton>
        <TabButton
          active={activeTab === 'custom'}
          onClick={() => {
            setActiveTab('custom');
            updateNodeData({ activeTab: 'custom' });
          }}
        >
          自定义输入
        </TabButton>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {activeTab === 'generate' ? (
          <>
            <div>
              <label className="text-xs text-dark-400 mb-1.5 block">Prompt</label>
              <textarea
                value={data.prompt || ''}
                onChange={(e) => updateNodeData({ prompt: e.target.value })}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                placeholder="输入生成文本的提示词..."
                className="w-full px-3 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none nodrag"
                rows={3}
              />
            </div>

            <div>
              <label className="text-xs text-dark-400 mb-1.5 block">模型</label>
              <select
                value={data.model || 'gpt-4'}
                onChange={(e) => updateNodeData({ model: e.target.value })}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="w-full px-3 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 nodrag"
              >
                <option value="gpt-4">GPT-4</option>
                <option value="gpt-3.5">GPT-3.5 Turbo</option>
                <option value="claude">Claude 3</option>
              </select>
            </div>

            <motion.button
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg nodrag"
            >
              <Sparkles className="w-4 h-4" />
              生成文本
            </motion.button>

            {data.output && (
              <div className="p-3 bg-dark-900/50 border border-dark-700/30 rounded-lg text-sm text-dark-200 max-h-32 overflow-y-auto">
                {data.output}
              </div>
            )}
          </>
        ) : (
          <div>
            <label className="text-xs text-dark-400 mb-1.5 block">自定义文本</label>
            <textarea
              value={data.customText || ''}
              onChange={(e) => updateNodeData({ customText: e.target.value })}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              placeholder="输入自定义文本..."
              className="w-full px-3 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none nodrag"
              rows={5}
            />
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
    idle: { color: 'bg-dark-600', label: '待处理' },
    processing: { color: 'bg-primary-500 animate-pulse', label: '处理中' },
    completed: { color: 'bg-green-500', label: '已完成' },
    error: { color: 'bg-red-500', label: '错误' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.idle;

  return (
    <div className="flex items-center gap-1.5">
      <div className={`w-2 h-2 rounded-full ${config.color}`} />
    </div>
  );
};

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
      onMouseDown={(e) => e.stopPropagation()}
      onPointerDown={(e) => e.stopPropagation()}
      className={`px-3 py-1.5 text-xs font-medium rounded-t-lg transition-all nodrag ${
        active
          ? 'bg-dark-900/50 text-white border-t border-x border-dark-700/50'
          : 'text-dark-400 hover:text-white hover:bg-dark-700/30'
      }`}
    >
      {children}
    </button>
  );
};

export default TextNode;
