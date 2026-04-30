import { makeAutoObservable } from 'mobx';
import { CanvasState } from '@/types/canvas';

interface HistoryEntry {
  state: CanvasState;
  timestamp: number;
}

class HistoryStore {
  private history: HistoryEntry[] = [];
  private currentIndex = -1;
  private maxHistory = 50;

  constructor() {
    makeAutoObservable(this);
  }

  push(state: CanvasState) {
    // 移除当前索引之后的历史
    this.history = this.history.slice(0, this.currentIndex + 1);

    // 添加新状态
    this.history.push({
      state: JSON.parse(JSON.stringify(state)), // 深拷贝
      timestamp: Date.now(),
    });

    // 限制历史记录数量
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    } else {
      this.currentIndex++;
    }
  }

  undo(): CanvasState | null {
    if (!this.canUndo) return null;
    this.currentIndex--;
    return this.getCurrentState();
  }

  redo(): CanvasState | null {
    if (!this.canRedo) return null;
    this.currentIndex++;
    return this.getCurrentState();
  }

  get canUndo(): boolean {
    return this.currentIndex > 0;
  }

  get canRedo(): boolean {
    return this.currentIndex < this.history.length - 1;
  }

  private getCurrentState(): CanvasState | null {
    return this.history[this.currentIndex]?.state || null;
  }

  clear() {
    this.history = [];
    this.currentIndex = -1;
  }
}

export const historyStore = new HistoryStore();
