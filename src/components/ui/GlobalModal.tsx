import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';
import { useModalStore } from '../../store/useModalStore';

const GlobalModal: React.FC = () => {
  const { isOpen, config, closeModal } = useModalStore();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!config) return null;

  const {
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    danger = false,
    onConfirm,
    icon,
  } = config;

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      await onConfirm();
    } finally {
      setIsProcessing(false);
      closeModal();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]"
          onClick={closeModal}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[400px] bg-white rounded-[32px] p-8 shadow-[0_8px_40px_rgb(0,0,0,0.12)] flex flex-col items-center relative overflow-hidden"
          >
            {/* Icon */}
            <div className={`w-14 h-14 rounded-[20px] flex items-center justify-center mb-6 ${danger ? 'bg-red-50 text-red-500' : 'bg-brand/10 text-brand'}`}>
              {icon ? icon : danger ? <AlertTriangle size={24} /> : <Info size={24} />}
            </div>

            {/* Typography */}
            <h3 className="text-[20px] font-bold text-[#1A1A1A] mb-2 text-center leading-tight">
              {title}
            </h3>
            {description && (
              <div className="text-[14px] text-gray-500 text-center leading-relaxed mb-8">
                {description}
              </div>
            )}

            {/* Actions */}
            <div className="flex w-full gap-3">
              <button
                disabled={isProcessing}
                onClick={closeModal}
                className="flex-1 h-12 rounded-full border border-gray-200 text-[14px] font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                {cancelText}
              </button>
              <button
                disabled={isProcessing}
                onClick={handleConfirm}
                className={`flex-1 h-12 rounded-full text-[14px] font-semibold text-white transition-colors flex items-center justify-center ${
                  danger ? 'bg-red-500 hover:bg-red-600' : 'bg-[#1A1A1A] hover:bg-black'
                } ${isProcessing ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isProcessing ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  confirmText
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default GlobalModal;
