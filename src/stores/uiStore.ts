import { makeAutoObservable } from 'mobx';

class UIStore {
  sidebarCollapsed = false;
  inspectorCollapsed = false;
  commandPaletteOpen = false;
  contextMenu: { x: number; y: number; nodeId?: string } | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  toggleSidebar() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }

  toggleInspector() {
    this.inspectorCollapsed = !this.inspectorCollapsed;
  }

  openCommandPalette() {
    this.commandPaletteOpen = true;
  }

  closeCommandPalette() {
    this.commandPaletteOpen = false;
  }

  showContextMenu(x: number, y: number, nodeId?: string) {
    this.contextMenu = { x, y, nodeId };
  }

  hideContextMenu() {
    this.contextMenu = null;
  }
}

export const uiStore = new UIStore();
