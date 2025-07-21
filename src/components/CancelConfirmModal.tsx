import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, ArrowLeft } from 'lucide-react';
import AIButton from './AIButton';

interface CancelConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  hasChanges?: boolean;
}

const CancelConfirmModal: React.FC<CancelConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  hasChanges = false
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md border border-gray-200 dark:border-gray-700"
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-orange-100 dark:bg-orange-900/20">
                    <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-600 dark:text-gray-300 mb-4">{message}</p>
                
                {hasChanges && (
                  <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-orange-800 dark:text-orange-200">
                      <AlertTriangle className="w-4 h-4" />
                      <span className="text-sm font-medium">¡Atención!</span>
                    </div>
                    <p className="text-sm text-orange-700 dark:text-orange-300 mt-2">
                      Tienes cambios sin guardar que se perderán si continúas.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3">
                <AIButton
                  onClick={onClose}
                  variant="cancel"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Continuar editando</span>
                </AIButton>
                <AIButton
                  onClick={onConfirm}
                  variant="primary"
                  size="sm"
                  className="flex items-center space-x-2"
                >
                  <X className="w-4 h-4" />
                  <span>Salir sin guardar</span>
                </AIButton>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CancelConfirmModal;