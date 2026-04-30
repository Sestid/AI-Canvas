import { motion } from 'framer-motion';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Video as VideoIcon, Sparkles, Upload } from 'lucide-react';
import { VideoNodeData } from '@/types/nodes';
import { observer } from 'mobx-react-lite';
import { canvasStore } from '@/stores/canvasStore';
import { useState } from 'react';

const VideoNode = observer(({ id, data, selected }: NodeProps<VideoNodeData>) => {
  const [activeTab, setActiveTab] = useState<'text-to-video' | 'frame-to-video'>(
    data.mode || 'text-to-video'
  );

  const updateNodeData = (updates: Partial<VideoNodeData>) => {
    canvasStore.updateNode(id, updates);
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
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-orange/20 to-red-500/20 flex items-center justify-center">
          <VideoIcon className="w-4 h-4 text-accent-orange" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm truncate">
            {data.label}
          </h3>
          <p className="text-dark-400 text-xs">视频生成节点</p>
        </div>
        <StatusIndicator status={data.status || 'idle'} />
      </div>

      {/* Tabs */}
      <div className="px-4 pt-3 flex gap-1 border-b border-dark-700/30">
        <TabButton
          active={activeTab === 'text-to-video'}
          onClick={() => {
            setActiveTab('text-to-video');
            updateNodeData({ mode: 'text-to-video' });
          }}
        >
          文/图生视频
        </TabButton>
        <TabButton
          active={activeTab === 'frame-to-video'}
          onClick={() => {
            setActiveTab('frame-to-video');
            updateNodeData({ mode: 'frame-to-video' });
          }}
        >
          首尾帧生视频
        </TabButton>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Video Preview */}
        {data.videoUrl ? (
          <div className="relative rounded-lg overflow-hidden border border-dark-700/50">
            <video src={data.videoUrl} className="w-full h-48 object-cover" controls />
          </div>
        ) : (
          <div className="border-2 border-dashed border-dark-700/50 rounded-lg p-8 text-center hover:border-dark-600 transition-all">
            <VideoIcon className="w-10 h-10 text-dark-500 mx-auto mb-2" />
            <p className="text-sm text-dark-400">视频生成后显示预览</p>
          </div>
        )}

        {/* Prompt or Image Input */}
        {activeTab === 'text-to-video' ? (
          <div>
            <label className="text-xs text-dark-400 mb-1.5 block">Prompt</label>
            <textarea
              value={data.prompt || ''}
              onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateNodeData({ prompt: e.target.value })}
              placeholder="描述视频内容..."
              className="w-full px-3 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none nodrag"
              rows={3}
            />
          </div>
        ) : (
          <div className="border-2 border-dashed border-dark-700/50 rounded-lg p-4 text-center hover:border-dark-600 transition-all cursor-pointer nodrag">
            <Upload className="w-6 h-6 text-dark-500 mx-auto mb-1" />
            <p className="text-xs text-dark-400">上传首尾帧图片</p>
          </div>
        )}

        {/* Parameters */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-dark-400 mb-1.5 block">比例</label>
            <select
              value={data.aspectRatio || '16:9'}
              onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateNodeData({ aspectRatio: e.target.value })}
              className="w-full px-2.5 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 nodrag"
            >
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="1:1">1:1</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1.5 block">时长(秒)</label>
            <input
              type="number"
              value={data.duration || 5}
              onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateNodeData({ duration: Number(e.target.value) })}
              min="1"
              max="60"
              className="w-full px-2.5 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 nodrag"
            />
          </div>
        </div>

        {/* Camera Movement */}
        <div>
          <label className="text-xs text-dark-400 mb-1.5 block">运镜</label>
          <select
            value={data.cameraMovement || 'none'}
            onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateNodeData({ cameraMovement: e.target.value })}
            className="w-full px-2.5 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 nodrag"
          >
            <option value="none">无运镜</option>
            <option value="zoom-in">推进</option>
            <option value="zoom-out">拉远</option>
            <option value="pan-left">左移</option>
            <option value="pan-right">右移</option>
            <option value="tilt-up">上移</option>
            <option value="tilt-down">下移</option>
            <option value="orbit">环绕</option>
          </select>
        </div>

        {/* Enable Audio */}
        <label className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-dark-900/30 transition-all nodrag">
          <input
            type="checkbox"
            checked={data.enableAudio || false}
            onMouseDown={(e) => e.stopPropagation()} onPointerDown={(e) => e.stopPropagation()} onClick={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => updateNodeData({ enableAudio: e.target.checked })}
            className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
          />
          <span className="text-sm text-dark-300">启用音效</span>
        </label>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-accent-orange to-red-500 text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg nodrag"
        >
          <Sparkles className="w-4 h-4" />
          生成视频
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

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({
  active,
  onClick,
  children,
}) => {
  return (
    <button
      onClick={onClick}
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

export default VideoNode;
