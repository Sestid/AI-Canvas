import { useEffect, useRef } from 'react';
import { canvasStore } from '@/stores/canvasStore';

export const useAutoSave = (interval = 30000) => {
  const timerRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    timerRef.current = setInterval(() => {
      canvasStore.saveToStorage();
    }, interval);

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [interval]);
};
