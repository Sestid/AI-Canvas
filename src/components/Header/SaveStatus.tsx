import { observer } from 'mobx-react-lite';
import { canvasStore } from '@/stores/canvasStore';
import { Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const SaveStatus = observer(() => {
  const { isSaving, lastSaved } = canvasStore;

  const getTimeAgo = (timestamp: number | null) => {
    if (!timestamp) return '';

    const seconds = Math.floor((Date.now() - timestamp) / 1000);

    if (seconds < 10) return '刚刚保存';
    if (seconds < 60) return `${seconds}秒前保存`;

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}分钟前保存`;

    const hours = Math.floor(minutes / 60);
    return `${hours}小时前保存`;
  };

  return (
    <AnimatePresence mode="wait">
      {isSaving ? (
        <motion.div
          key="saving"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800/50 text-dark-300 text-sm"
        >
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
          <span>保存中...</span>
        </motion.div>
      ) : (
        <motion.div
          key="saved"
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 5 }}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-dark-800/30 text-dark-400 text-sm"
        >
          <Check className="w-3.5 h-3.5 text-green-500" />
          <span>{getTimeAgo(lastSaved)}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
});

export default SaveStatus;
