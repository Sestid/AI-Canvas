import { motion } from 'framer-motion';
import { Handle, Position, NodeProps } from '@xyflow/react';
import { Image as ImageIcon, Sparkles, Upload } from 'lucide-react';
import { ImageNodeData } from '@/types/nodes';
import { observer } from 'mobx-react-lite';
import { canvasStore } from '@/stores/canvasStore';

const ImageNode = observer(({ id, data, selected }: NodeProps<ImageNodeData>) => {
  const updateNodeData = (updates: Partial<ImageNodeData>) => {
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
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent-purple/20 to-accent-pink/20 flex items-center justify-center">
          <ImageIcon className="w-4 h-4 text-accent-purple" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium text-sm truncate">
            {data.label}
          </h3>
          <p className="text-dark-400 text-xs">图片生成节点</p>
        </div>
        <StatusIndicator status={data.status || 'idle'} />
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        {/* Image Preview or Upload */}
        {data.imageUrl ? (
          <div className="relative rounded-lg overflow-hidden border border-dark-700/50 group">
            <img src={data.imageUrl} alt="Generated" className="w-full h-48 object-cover" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                onClick={(e) => e.stopPropagation()}
                className="px-3 py-1.5 bg-dark-800 rounded-lg text-xs text-white hover:bg-dark-700 nodrag"
              >
                替换
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  updateNodeData({ imageUrl: undefined });
                }}
                onMouseDown={(e) => e.stopPropagation()}
                onPointerDown={(e) => e.stopPropagation()}
                className="px-3 py-1.5 bg-dark-800 rounded-lg text-xs text-white hover:bg-dark-700 nodrag"
              >
                删除
              </button>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-dark-700/50 rounded-lg p-6 text-center hover:border-dark-600 transition-all cursor-pointer nodrag">
            <Upload className="w-8 h-8 text-dark-500 mx-auto mb-2" />
            <p className="text-sm text-dark-400 mb-1">点击上传或拖拽图片</p>
            <p className="text-xs text-dark-500">支持 PNG, JPG, WebP</p>
          </div>
        )}

        {/* Prompt */}
        <div>
          <label className="text-xs text-dark-400 mb-1.5 block">Prompt</label>
          <textarea
            value={data.prompt || ''}
            onChange={(e) => updateNodeData({ prompt: e.target.value })}
            onMouseDown={(e) => e.stopPropagation()}
            onPointerDown={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
            placeholder="描述你想要生成的图片..."
            className="w-full px-3 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none nodrag"
            rows={3}
          />
        </div>

        {/* Style */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-xs text-dark-400 mb-1.5 block">风格</label>
            <select
              value={data.style || 'realistic'}
              onChange={(e) => updateNodeData({ style: e.target.value })}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-2.5 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 nodrag"
            >
              <option value="realistic">写实</option>
              <option value="anime">动漫</option>
              <option value="oil-painting">油画</option>
              <option value="watercolor">水彩</option>
              <option value="3d">3D</option>
            </select>
          </div>

          <div>
            <label className="text-xs text-dark-400 mb-1.5 block">比例</label>
            <select
              value={data.aspectRatio || '16:9'}
              onChange={(e) => updateNodeData({ aspectRatio: e.target.value })}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => e.stopPropagation()}
              className="w-full px-2.5 py-2 bg-dark-900/50 border border-dark-700/50 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 nodrag"
            >
              <option value="1:1">1:1</option>
              <option value="16:9">16:9</option>
              <option value="9:16">9:16</option>
              <option value="4:3">4:3</option>
            </select>
          </div>
        </div>

        {/* Camera Controls */}
        <div className="space-y-2 p-3 bg-dark-900/30 rounded-lg border border-dark-700/30">
          <p className="text-xs text-dark-400 font-medium mb-2">机位控制</p>

          <div>
            <div className="flex justify-between text-xs text-dark-400 mb-1">
              <span>水平旋转</span>
              <span>{data.horizontalRotation || 0}°</span>
            </div>
            <input
              type="range"
              min="-180"
              max="180"
              value={data.horizontalRotation || 0}
              onChange={(e) => updateNodeData({ horizontalRotation: Number(e.target.value) })}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-full nodrag accent-primary-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-dark-400 mb-1">
              <span>垂直角度</span>
              <span>{data.verticalAngle || 0}°</span>
            </div>
            <input
              type="range"
              min="-90"
              max="90"
              value={data.verticalAngle || 0}
              onChange={(e) => updateNodeData({ verticalAngle: Number(e.target.value) })}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-full nodrag accent-primary-500"
            />
          </div>

          <div>
            <div className="flex justify-between text-xs text-dark-400 mb-1">
              <span>焦距</span>
              <span>{data.focalLength || 50}mm</span>
            </div>
            <input
              type="range"
              min="14"
              max="200"
              value={data.focalLength || 50}
              onChange={(e) => updateNodeData({ focalLength: Number(e.target.value) })}
              onMouseDown={(e) => e.stopPropagation()}
              onPointerDown={(e) => e.stopPropagation()}
              className="w-full nodrag accent-primary-500"
            />
          </div>
        </div>

        {/* Generate Button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onMouseDown={(e) => e.stopPropagation()}
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
          className="w-full px-4 py-2.5 bg-gradient-to-r from-accent-purple to-accent-pink text-white text-sm font-medium rounded-lg flex items-center justify-center gap-2 hover:opacity-90 transition-all shadow-lg nodrag"
        >
          <Sparkles className="w-4 h-4" />
          生成图片
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

export default ImageNode;
