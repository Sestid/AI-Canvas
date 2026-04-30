import { observer } from 'mobx-react-lite';
import { uiStore } from '@/stores/uiStore';
import { motion } from 'framer-motion';
import {
  Type,
  Image,
  Video,
  Mic,
  FileText,
  Wrench,
  LayoutTemplate,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { NodeType } from '@/types/nodes';

interface SidebarItemData {
  id: string;
  label: string;
  icon: React.ReactNode;
  nodeType?: NodeType;
  category: 'node' | 'utility';
}

const sidebarItems: SidebarItemData[] = [
  { id: 'text', label: '文本', icon: <Type className="w-5 h-5" />, nodeType: 'text', category: 'node' },
  { id: 'image', label: '图片', icon: <Image className="w-5 h-5" />, nodeType: 'image', category: 'node' },
  { id: 'video', label: '视频', icon: <Video className="w-5 h-5" />, nodeType: 'video', category: 'node' },
  { id: 'audio', label: '音频', icon: <Mic className="w-5 h-5" />, nodeType: 'audio', category: 'node' },
  { id: 'script', label: '脚本', icon: <FileText className="w-5 h-5" />, nodeType: 'script', category: 'node' },
  { id: 'tool', label: '工具箱', icon: <Wrench className="w-5 h-5" />, nodeType: 'tool', category: 'node' },
  { id: 'templates', label: '模板库', icon: <LayoutTemplate className="w-5 h-5" />, category: 'utility' },
  { id: 'materials', label: '我的素材', icon: <FolderOpen className="w-5 h-5" />, category: 'utility' },
];

const Sidebar = observer(() => {
  const { sidebarCollapsed } = uiStore;

  const onDragStart = (event: React.DragEvent, nodeType: NodeType) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarCollapsed ? 72 : 240 }}
      className="bg-dark-900/60 backdrop-blur-xl border-r border-dark-700/50 flex flex-col relative z-40"
    >
      {/* 折叠按钮 */}
      <button
        onClick={() => uiStore.toggleSidebar()}
        className="absolute -right-3 top-6 w-6 h-6 bg-dark-800 border border-dark-700/50 rounded-full flex items-center justify-center text-dark-400 hover:text-white hover:bg-dark-700 transition-all z-50 shadow-lg"
      >
        {sidebarCollapsed ? (
          <ChevronRight className="w-3.5 h-3.5" />
        ) : (
          <ChevronLeft className="w-3.5 h-3.5" />
        )}
      </button>

      {/* 内容区域 */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {sidebarItems.map((item) => (
          <SidebarItem
            key={item.id}
            item={item}
            collapsed={sidebarCollapsed}
            onDragStart={onDragStart}
          />
        ))}
      </div>
    </motion.aside>
  );
});

interface SidebarItemProps {
  item: SidebarItemData;
  collapsed: boolean;
  onDragStart: (event: React.DragEvent, nodeType: NodeType) => void;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ item, collapsed, onDragStart }) => {
  const handleClick = () => {
    if (!item.nodeType) {
      // 工具类按钮的处理
      console.log(`${item.label} clicked`);
    }
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, x: collapsed ? 0 : 4 }}
      whileTap={{ scale: 0.98 }}
      onClick={handleClick}
      onDragStart={(e) => item.nodeType && onDragStart(e, item.nodeType)}
      draggable={!!item.nodeType}
      className="w-full flex items-center gap-3 px-3 py-3 rounded-xl bg-dark-800/30 hover:bg-dark-800/60 border border-dark-700/30 hover:border-dark-600/50 text-dark-300 hover:text-white transition-all group cursor-grab active:cursor-grabbing"
    >
      <div className="flex-shrink-0 text-dark-400 group-hover:text-primary-400 transition-colors">
        {item.icon}
      </div>

      <motion.span
        initial={false}
        animate={{
          opacity: collapsed ? 0 : 1,
          width: collapsed ? 0 : 'auto',
        }}
        className="text-sm font-medium whitespace-nowrap overflow-hidden"
      >
        {item.label}
      </motion.span>

      {/* Tooltip for collapsed state */}
      {collapsed && (
        <div className="absolute left-full ml-2 px-3 py-1.5 bg-dark-800 border border-dark-700 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity shadow-xl">
          {item.label}
        </div>
      )}
    </motion.div>
  );
};

export default Sidebar;
