import { observer } from 'mobx-react-lite';
import { canvasStore } from '@/stores/canvasStore';
import { App } from 'antd';
import {
  Save,
  Undo2,
  Redo2,
  Play,
  Download,
  Settings,
  User,
  Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';
import SaveStatus from './SaveStatus';

const Header = observer(() => {
  const { message } = App.useApp();

  const handleSave = async () => {
    try {
      await canvasStore.saveToStorage();
      message.success('保存成功！');
    } catch (error) {
      message.error('保存失败，请重试');
    }
  };

  const handleExport = () => {
    try {
      // 导出为 JSON 文件
      const state = {
        nodes: canvasStore.nodes,
        edges: canvasStore.edges,
        selectedNodeId: canvasStore.selectedNodeId,
        exportedAt: new Date().toISOString(),
      };

      const dataStr = JSON.stringify(state, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `ai-canvas-${Date.now()}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      message.success('导出成功！');
    } catch (error) {
      message.error('导出失败，请重试');
    }
  };

  const handleRun = () => {
    // TODO: 实现运行功能
    message.info('运行功能开发中...');
  };

  return (
    <header className="h-16 bg-dark-900/80 backdrop-blur-xl border-b border-dark-700/50 flex items-center justify-between px-6 relative z-50">
      {/* 左侧：Logo & 项目名称 */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <span className="text-xl font-semibold text-white">AI Canvas</span>
        </div>

        <div className="h-6 w-px bg-dark-700" />

        <input
          type="text"
          defaultValue="未命名项目"
          className="bg-transparent text-dark-200 text-sm px-2 py-1 rounded hover:bg-dark-800/50 focus:bg-dark-800 focus:outline-none focus:ring-1 focus:ring-primary-500/50 transition-all"
        />
      </div>

      {/* 中间：操作按钮 */}
      <div className="flex items-center gap-2">
        <SaveStatus />

        <div className="h-6 w-px bg-dark-700 mx-2" />

        {/* 保存按钮 */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="px-4 py-2 rounded-lg bg-dark-800/50 text-white text-sm font-medium flex items-center gap-2 hover:bg-dark-700/50 transition-all border border-dark-700/50 hover:border-primary-500/50"
        >
          <Save className="w-4 h-4" />
          保存
        </motion.button>

        <ActionButton
          icon={<Undo2 className="w-4 h-4" />}
          tooltip="撤销 (⌘Z)"
          onClick={() => {}}
          disabled={true}
        />

        <ActionButton
          icon={<Redo2 className="w-4 h-4" />}
          tooltip="重做 (⌘⇧Z)"
          onClick={() => {}}
          disabled={true}
        />

        <div className="h-6 w-px bg-dark-700 mx-2" />

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleRun}
          className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary-500 to-primary-600 text-white text-sm font-medium flex items-center gap-2 hover:from-primary-600 hover:to-primary-700 transition-all shadow-lg shadow-primary-500/20"
        >
          <Play className="w-4 h-4" />
          运行
        </motion.button>

        <ActionButton
          icon={<Download className="w-4 h-4" />}
          tooltip="导出"
          onClick={handleExport}
        />
      </div>

      {/* 右侧：用户 & 设置 */}
      <div className="flex items-center gap-2">
        <ActionButton
          icon={<Settings className="w-4 h-4" />}
          tooltip="设置"
          onClick={() => {}}
        />

        <div className="h-6 w-px bg-dark-700 mx-2" />

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-8 h-8 rounded-full bg-gradient-to-br from-accent-purple to-accent-pink flex items-center justify-center text-white text-sm font-medium shadow-lg"
        >
          <User className="w-4 h-4" />
        </motion.button>
      </div>
    </header>
  );
});

interface ActionButtonProps {
  icon: React.ReactNode;
  tooltip: string;
  onClick: () => void;
  disabled?: boolean;
}

const ActionButton: React.FC<ActionButtonProps> = ({ icon, tooltip, onClick, disabled }) => {
  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.05, backgroundColor: 'rgba(58, 58, 69, 0.5)' } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      onClick={onClick}
      disabled={disabled}
      title={tooltip}
      className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${
        disabled
          ? 'text-dark-600 cursor-not-allowed'
          : 'text-dark-300 hover:text-white hover:bg-dark-800/50'
      }`}
    >
      {icon}
    </motion.button>
  );
};

export default Header;
