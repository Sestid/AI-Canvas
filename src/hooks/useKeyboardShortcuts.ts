import { useEffect } from 'react';
import { canvasStore } from '@/stores/canvasStore';
import { uiStore } from '@/stores/uiStore';

export const useKeyboardShortcuts = () => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command/Ctrl + K: 打开命令面板
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        uiStore.openCommandPalette();
        return;
      }

      // Command/Ctrl + S: 保存
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        canvasStore.saveToStorage();
        return;
      }

      // Command/Ctrl + Z: 撤销
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        // TODO: 实现撤销
        return;
      }

      // Command/Ctrl + Shift + Z: 重做
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'z') {
        e.preventDefault();
        // TODO: 实现重做
        return;
      }

      // Delete/Backspace: 删除选中节点
      if ((e.key === 'Delete' || e.key === 'Backspace') && canvasStore.selectedNodeId) {
        const activeElement = document.activeElement;
        // 如果焦点在输入框或文本域，不触发删除
        if (
          activeElement?.tagName === 'INPUT' ||
          activeElement?.tagName === 'TEXTAREA' ||
          (activeElement as HTMLElement)?.isContentEditable
        ) {
          return;
        }
        e.preventDefault();
        canvasStore.deleteNode(canvasStore.selectedNodeId);
        return;
      }

      // Escape: 取消选择
      if (e.key === 'Escape') {
        canvasStore.selectNode(null);
        uiStore.closeCommandPalette();
        uiStore.hideContextMenu();
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
};
