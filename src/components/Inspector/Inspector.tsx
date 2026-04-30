import { observer } from 'mobx-react-lite';
import { canvasStore } from '@/stores/canvasStore';
import { motion } from 'framer-motion';
import { X, Info, Clock, Activity } from 'lucide-react';
import { CustomNodeData } from '@/types/nodes';

const Inspector = observer(() => {
  const selectedNode = canvasStore.getSelectedNode();

  if (!selectedNode) {
    return (
      <aside className="w-80 bg-dark-900/60 backdrop-blur-xl border-l border-dark-700/50 flex flex-col relative z-40">
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-center text-dark-500">
            <Info className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-sm">选择一个节点查看属性</p>
          </div>
        </div>
      </aside>
    );
  }

  return (
    <aside className="w-80 bg-dark-900/60 backdrop-blur-xl border-l border-dark-700/50 flex flex-col relative z-40">
      {/* Header */}
      <div className="p-4 border-b border-dark-700/50 flex items-center justify-between">
        <h3 className="text-white font-semibold">节点属性</h3>
        <button
          onClick={() => canvasStore.selectNode(null)}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-dark-400 hover:text-white hover:bg-dark-800 transition-all"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* 节点信息 */}
      <div className="p-4 border-b border-dark-700/50 space-y-3">
        <div>
          <label className="text-xs text-dark-400 mb-1 block">节点名称</label>
          <input
            type="text"
            value={selectedNode.data.label}
            onChange={(e) => canvasStore.updateNode(selectedNode.id, { label: e.target.value })}
            className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500"
          />
        </div>

        <div className="flex gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-dark-400">
            <Clock className="w-3.5 h-3.5" />
            <span>{new Date(selectedNode.data.createdAt).toLocaleString('zh-CN')}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Activity className="w-3.5 h-3.5 text-dark-400" />
          <span className="text-xs text-dark-400">状态:</span>
          <StatusBadge status={selectedNode.data.status || 'idle'} />
        </div>
      </div>

      {/* 节点特定属性 */}
      <div className="flex-1 overflow-y-auto p-4">
        <NodeSpecificProperties data={selectedNode.data} nodeId={selectedNode.id} />
      </div>
    </aside>
  );
});

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const statusConfig = {
    idle: { label: '待处理', className: 'bg-dark-700 text-dark-300' },
    processing: { label: '处理中', className: 'bg-primary-500/20 text-primary-400' },
    completed: { label: '已完成', className: 'bg-green-500/20 text-green-400' },
    error: { label: '错误', className: 'bg-red-500/20 text-red-400' },
  };

  const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.idle;

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.className}`}>
      {config.label}
    </span>
  );
};

const NodeSpecificProperties: React.FC<{ data: CustomNodeData; nodeId: string }> = ({
  data,
  nodeId,
}) => {
  const updateData = (updates: Partial<CustomNodeData>) => {
    canvasStore.updateNode(nodeId, updates);
  };

  switch (data.type) {
    case 'text':
      return (
        <div className="space-y-4">
          <FormField label="Prompt">
            <textarea
              value={data.prompt || ''}
              onChange={(e) => updateData({ prompt: e.target.value })}
              placeholder="输入生成文本的提示词..."
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
              rows={4}
            />
          </FormField>

          <FormField label="模型">
            <select
              value={data.model || 'gpt-4'}
              onChange={(e) => updateData({ model: e.target.value })}
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5">GPT-3.5</option>
              <option value="claude">Claude</option>
            </select>
          </FormField>

          {data.output && (
            <FormField label="输出结果">
              <div className="p-3 bg-dark-800/30 border border-dark-700 rounded-lg text-sm text-dark-200">
                {data.output}
              </div>
            </FormField>
          )}
        </div>
      );

    case 'image':
      return (
        <div className="space-y-4">
          <FormField label="Prompt">
            <textarea
              value={data.prompt || ''}
              onChange={(e) => updateData({ prompt: e.target.value })}
              placeholder="描述你想要生成的图片..."
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
              rows={3}
            />
          </FormField>

          <FormField label="风格">
            <select
              value={data.style || 'realistic'}
              onChange={(e) => updateData({ style: e.target.value })}
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="realistic">写实</option>
              <option value="anime">动漫</option>
              <option value="oil-painting">油画</option>
              <option value="watercolor">水彩</option>
              <option value="3d">3D渲染</option>
            </select>
          </FormField>

          <FormField label="比例">
            <select
              value={data.aspectRatio || '16:9'}
              onChange={(e) => updateData({ aspectRatio: e.target.value })}
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="1:1">1:1 正方形</option>
              <option value="16:9">16:9 宽屏</option>
              <option value="9:16">9:16 竖屏</option>
              <option value="4:3">4:3 标准</option>
            </select>
          </FormField>

          <FormField label="分辨率">
            <select
              value={data.resolution || '1024x1024'}
              onChange={(e) => updateData({ resolution: e.target.value })}
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="512x512">512x512</option>
              <option value="1024x1024">1024x1024</option>
              <option value="1920x1080">1920x1080</option>
              <option value="2048x2048">2048x2048</option>
            </select>
          </FormField>

          <div className="space-y-3">
            <FormField label={`水平旋转: ${data.horizontalRotation}°`}>
              <input
                type="range"
                min="-180"
                max="180"
                value={data.horizontalRotation || 0}
                onChange={(e) => updateData({ horizontalRotation: Number(e.target.value) })}
                className="w-full"
              />
            </FormField>

            <FormField label={`垂直角度: ${data.verticalAngle}°`}>
              <input
                type="range"
                min="-90"
                max="90"
                value={data.verticalAngle || 0}
                onChange={(e) => updateData({ verticalAngle: Number(e.target.value) })}
                className="w-full"
              />
            </FormField>

            <FormField label={`焦距: ${data.focalLength}mm`}>
              <input
                type="range"
                min="14"
                max="200"
                value={data.focalLength || 50}
                onChange={(e) => updateData({ focalLength: Number(e.target.value) })}
                className="w-full"
              />
            </FormField>
          </div>
        </div>
      );

    case 'video':
      return (
        <div className="space-y-4">
          <FormField label="模式">
            <select
              value={data.mode || 'text-to-video'}
              onChange={(e) => updateData({ mode: e.target.value as any })}
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="text-to-video">文生视频</option>
              <option value="frame-to-video">帧生视频</option>
            </select>
          </FormField>

          <FormField label="Prompt">
            <textarea
              value={data.prompt || ''}
              onChange={(e) => updateData({ prompt: e.target.value })}
              placeholder="描述视频内容..."
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
              rows={3}
            />
          </FormField>

          <FormField label="时长(秒)">
            <input
              type="number"
              value={data.duration || 5}
              onChange={(e) => updateData({ duration: Number(e.target.value) })}
              min="1"
              max="60"
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            />
          </FormField>

          <FormField label="启用音效">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={data.enableAudio || false}
                onChange={(e) => updateData({ enableAudio: e.target.checked })}
                className="w-4 h-4 rounded border-dark-600 bg-dark-800 text-primary-500 focus:ring-primary-500"
              />
              <span className="text-sm text-dark-300">自动生成背景音</span>
            </label>
          </FormField>
        </div>
      );

    case 'audio':
      return (
        <div className="space-y-4">
          <FormField label="台词">
            <textarea
              value={data.script || ''}
              onChange={(e) => updateData({ script: e.target.value })}
              placeholder="输入台词内容..."
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
              rows={6}
            />
          </FormField>

          <div className="p-3 bg-dark-800/30 border border-dark-700 rounded-lg">
            <div className="h-20 bg-dark-900/50 rounded flex items-center justify-center text-dark-500 text-xs">
              音频波形预览区域
            </div>
          </div>
        </div>
      );

    case 'script':
      return (
        <div className="space-y-4">
          <FormField label="Prompt">
            <textarea
              value={data.prompt || ''}
              onChange={(e) => updateData({ prompt: e.target.value })}
              placeholder="输入脚本生成提示词..."
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50 resize-none"
              rows={4}
            />
          </FormField>

          <FormField label="模型">
            <select
              value={data.model || 'gpt-4'}
              onChange={(e) => updateData({ model: e.target.value })}
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="gpt-4">GPT-4</option>
              <option value="gpt-3.5">GPT-3.5</option>
              <option value="claude">Claude</option>
            </select>
          </FormField>
        </div>
      );

    case 'tool':
      return (
        <div className="space-y-4">
          <FormField label="工具类型">
            <select
              value={data.toolType || 'character-turnaround'}
              onChange={(e) => updateData({ toolType: e.target.value as any })}
              className="w-full px-3 py-2 bg-dark-800/50 border border-dark-700 rounded-lg text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/50"
            >
              <option value="character-turnaround">角色三视图</option>
              <option value="multi-angle-grid">多机位九宫格</option>
              <option value="story-grid">剧情推演四宫格</option>
            </select>
          </FormField>
        </div>
      );

    default:
      return <div className="text-sm text-dark-500">暂无配置项</div>;
  }
};

const FormField: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => {
  return (
    <div>
      <label className="text-xs text-dark-400 mb-2 block font-medium">{label}</label>
      {children}
    </div>
  );
};

export default Inspector;
