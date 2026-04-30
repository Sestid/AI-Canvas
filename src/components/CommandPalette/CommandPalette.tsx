import { useState, useEffect, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { uiStore } from '@/stores/uiStore';
import { canvasStore } from '@/stores/canvasStore';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Type, Image, Video, Mic, FileText, Wrench } from 'lucide-react';
import { NodeType } from '@/types/nodes';

interface Command {
  id: string;
  label: string;
  description: string;
  icon: React.ReactNode;
  action: () => void;
  keywords: string[];
}

const CommandPalette = observer(() => {
  const [search, setSearch] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  const commands: Command[] = [
    {
      id: 'add-text',
      label: '添加文本节点',
      description: 'AI 生成或自定义文本',
      icon: <Type className="w-4 h-4" />,
      action: () => addNode('text'),
      keywords: ['text', 'wenben', '文本'],
    },
    {
      id: 'add-image',
      label: '添加图片节点',
      description: 'AI 图片生成',
      icon: <Image className="w-4 h-4" />,
      action: () => addNode('image'),
      keywords: ['image', 'tupian', '图片'],
    },
    {
      id: 'add-video',
      label: '添加视频节点',
      description: 'AI 视频生成',
      icon: <Video className="w-4 h-4" />,
      action: () => addNode('video'),
      keywords: ['video', 'shipin', '视频'],
    },
    {
      id: 'add-audio',
      label: '添加音频节点',
      description: 'AI 语音合成',
      icon: <Mic className="w-4 h-4" />,
      action: () => addNode('audio'),
      keywords: ['audio', 'yinpin', '音频'],
    },
    {
      id: 'add-script',
      label: '添加脚本节点',
      description: 'AI 脚本生成',
      icon: <FileText className="w-4 h-4" />,
      action: () => addNode('script'),
      keywords: ['script', 'jiaoben', '脚本'],
    },
    {
      id: 'add-tool',
      label: '添加工具节点',
      description: '工具箱',
      icon: <Wrench className="w-4 h-4" />,
      action: () => addNode('tool'),
      keywords: ['tool', 'gongju', '工具'],
    },
  ];

  const addNode = (type: NodeType) => {
    const centerX = window.innerWidth / 2 - 150;
    const centerY = window.innerHeight / 2 - 100;
    canvasStore.addNode(type, { x: centerX, y: centerY });
    uiStore.closeCommandPalette();
    setSearch('');
    setSelectedIndex(0);
  };

  const filteredCommands = commands.filter((cmd) => {
    const searchLower = search.toLowerCase();
    return (
      cmd.label.toLowerCase().includes(searchLower) ||
      cmd.description.toLowerCase().includes(searchLower) ||
      cmd.keywords.some((kw) => kw.toLowerCase().includes(searchLower))
    );
  });

  useEffect(() => {
    if (uiStore.commandPaletteOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [uiStore.commandPaletteOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!uiStore.commandPaletteOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filteredCommands[selectedIndex]?.action();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [uiStore.commandPaletteOpen, filteredCommands, selectedIndex]);

  if (!uiStore.commandPaletteOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-start justify-center pt-32">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => uiStore.closeCommandPalette()}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Command Palette */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: -20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: -20 }}
          className="relative w-full max-w-2xl bg-dark-800/95 backdrop-blur-xl border border-dark-700/50 rounded-2xl shadow-elevated overflow-hidden"
        >
          {/* Search Input */}
          <div className="flex items-center gap-3 px-4 py-4 border-b border-dark-700/50">
            <Search className="w-5 h-5 text-dark-400" />
            <input
              ref={inputRef}
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setSelectedIndex(0);
              }}
              placeholder="搜索或创建节点..."
              className="flex-1 bg-transparent text-white placeholder-dark-400 focus:outline-none text-base"
            />
            <kbd className="px-2 py-1 bg-dark-700/50 text-dark-400 text-xs rounded border border-dark-600">
              ESC
            </kbd>
          </div>

          {/* Commands List */}
          <div className="max-h-96 overflow-y-auto">
            {filteredCommands.length > 0 ? (
              filteredCommands.map((cmd, index) => (
                <motion.button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(index)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all ${
                    index === selectedIndex
                      ? 'bg-primary-500/10 border-l-2 border-primary-500'
                      : 'hover:bg-dark-700/30'
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      index === selectedIndex
                        ? 'bg-primary-500/20 text-primary-400'
                        : 'bg-dark-700/50 text-dark-400'
                    }`}
                  >
                    {cmd.icon}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">{cmd.label}</p>
                    <p className="text-xs text-dark-400">{cmd.description}</p>
                  </div>
                  {index === selectedIndex && (
                    <kbd className="px-2 py-1 bg-dark-700/50 text-dark-400 text-xs rounded border border-dark-600">
                      Enter
                    </kbd>
                  )}
                </motion.button>
              ))
            ) : (
              <div className="px-4 py-8 text-center text-dark-500 text-sm">
                没有找到匹配的命令
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-dark-900/50 border-t border-dark-700/50 flex items-center justify-between text-xs text-dark-400">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-dark-700/50 rounded border border-dark-600">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-dark-700/50 rounded border border-dark-600">↓</kbd>
                <span>导航</span>
              </div>
              <div className="flex items-center gap-1">
                <kbd className="px-1.5 py-0.5 bg-dark-700/50 rounded border border-dark-600">Enter</kbd>
                <span>选择</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 bg-dark-700/50 rounded border border-dark-600">⌘K</kbd>
              <span>快捷键</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
});

export default CommandPalette;
