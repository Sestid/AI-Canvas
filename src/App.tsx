import { observer } from 'mobx-react-lite';
import { ReactFlowProvider } from '@xyflow/react';
import { App as AntdApp } from 'antd';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import Canvas from './components/Canvas/Canvas';
import CommandPalette from './components/CommandPalette/CommandPalette';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { useAutoSave } from './hooks/useAutoSave';

const App = observer(() => {
  useKeyboardShortcuts();
  useAutoSave();

  return (
    <AntdApp>
      <div className="h-screen w-screen flex flex-col bg-dark-950 text-white overflow-hidden">
        <Header />

        <div className="flex-1 flex overflow-hidden">
          <Sidebar />

          <ReactFlowProvider>
            <Canvas />
          </ReactFlowProvider>
        </div>

        <CommandPalette />
      </div>
    </AntdApp>
  );
});

export default App;
