import { motion } from 'framer-motion';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Mic, Sparkles, Pause, Volume2 } from 'lucide-react';
import { AudioNodeData } from '@/types/nodes';
import { observer } from 'mobx-react-lite';
import { canvasStore } from '@/stores/canvasStore';

const AudioNode = observer(({ id, data, selected }: NodeProps<AudioNodeData>) => {
  const updateNodeData = (updates: Partial<AudioNodeData>) => {
    canvasStore.updateNode(id, updates);
  };

  const insertPause = () => {
    const textarea = document.querySelector(`#script-${id}`) as HTMLTextAreaElement;
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const textBefore = data.script?.substring(0, cursorPos) || '';
      const textAfter = data.script?.substring(cursorPos) || '';
      updateNodeData({ script: textBefore + '[停顿]' + textAfter });
    }
  };

  const insertIntonation = (type: string) => {
    const textarea = document.querySelector(`#script-${id}`) as HTMLTextAreaElement;
    if (textarea) {
      const cursorPos = textarea.selectionStart;
      const textBefore = data.script?.substring(0, cursorPos) || '';
      const textAfter = data.script?.substring(cursorPos) || '';
      updateNodeData({ script: textBefore + `[${type}]` + textAfter });
    }
  };

  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`min-w-[360px] bg-dark-800/90 backdrop-blur-xl rounded-2xl border-2 transition-all shadow-elevated ${
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
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-green/20 to-green-500/20 flex items-center justify-center">
          <Mic className="w-4 h-4 text-accent-green" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm truncate">
            {data.label}
          </h3>
          <p className="text-dark-400 text-xs">音频生成节点</p>
        </div>
        <StatusIndicator status={data.status || 'idle'} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Script Input */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs text-dark-400">台词</label>
            <div className="flex gap-1">
              <button
                onClick={insertPause}
                className="px-2 py-0.5 bg-dark-700/50 hover:bg-dark-700 rounded text-xs text-dark-300 hover:text-white transition-all flex items-center gap-1 nodrag"
                title="插入停顿"
              >
                <Pause className="w-3 h-3" />
              </button>
              <button
                onClick={() => insertIntonation('疑问')}
                className="px-2 py-0.5 bg-dark-700/50 hover:bg-dark-700 rounded text-xs text-dark-300 hover:text-white transition-all nodrag"
                title="插入疑问语气"
              >
                ?
              </button>
              <button
                onClick={() => insertIntonation('感叹')}
                className="px-2 py-0.5 bg-dark-700/50 hover:bg-dark-700 rounded text-xs text-dark-300 hover:text-white transition-all nodrag"
                title="插入感叹语气"
              >
                !
              </button>
            </div>
          </div>
          <textarea
            id={`script-${id}`}
            value={data.script || ''}
            onMouseDown={(e) => e.stopPropagation()}
              onChange={(e) => updateNodeData({ script: e.target.value })}
            placeholder="输入台词内容... 使用上方按钮插入停顿和语气词"
            className="w-full px-3 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none nodrag"
            rows={6}
          />
        </div>

        {/* Waveform Preview */}
        <div className="p-4 bg-dark-900/50 border border-dark-700/30 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Volume2 className="w-4 h-4 text-dark-500" />
            <span className="text-xs text-dark-400">音频波形</span>
          </div>
          <div className="h-24 bg-dark-900/50 rounded flex items-center justify-center gap-1 overflow-hidden">
            {/* Waveform Placeholder */}
            {data.audioUrl ? (
              Array.from({ length: 50 }).map((_, i) => (
                <div
                  key={i}
                  className="w-1 bg-accent-green/50 rounded-full"
                  style={{ height: `${Math.random() * 100}%` }}
                />
              ))
            ) : (
              <p className="text-xs text-dark-500">生成后显示音频波形</p>
            )}
          </div>
        </div>

        {/* Voice Settings */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-dark-400 mb-1.5 block">音色</label>
            <select
              className="w-full px-2.5 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 nodrag"
            >
              <option value="male-1">男声 1</option>
              <option value="male-2">男声 2</option>
              <option value="female-1">女声 1</option>
              <option value="female-2">女声 2</option>
              <option value="child">童声</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1.5 block">语速</label>
            <select
              className="w-full px-2.5 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 nodrag"
            >
              <option value="0.75">较慢</option>
              <option value="1.0">正常</option>
              <option value="1.25">较快</option>
              <option value="1.5">很快</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-accent-green to-green-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg nodrag"
        >
          <Sparkles className="w-4 h-4" />
          生成音频
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

export default AudioNode;
