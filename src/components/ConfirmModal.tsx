import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X, Archive, Calendar } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  type?: 'delete' | 'archive';
  itemName?: string;
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  type = 'delete',
  itemName
}) => {
  const isArchive = type === 'archive';

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
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                    isArchive ? 'bg-blue-100 dark:bg-blue-900/20' : 'bg-red-100 dark:bg-red-900/20'
                  }`}>
                    {isArchive ? (
                      <Archive className={`w-6 h-6 text-blue-600 dark:text-blue-400`} />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                    )}
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
                
                {isArchive && itemName && (
                  <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
                    <div className="flex items-center space-x-2 text-blue-800 dark:text-blue-200">
                      <Calendar className="w-4 h-4" />
                      <span className="text-sm font-medium">Información importante:</span>
                    </div>
                    <p className="text-sm text-blue-700 dark:text-blue-300 mt-2">
                      <strong>{itemName}</strong> será archivado y marcado como inactivo. 
                      Podrás verlo en modo de solo lectura con la fecha de archivo.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-end space-x-3">
                <button
                  onClick={onClose}
                  className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Cancelar
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onConfirm}
                  className={`px-6 py-2 rounded-lg font-medium shadow-lg hover:shadow-xl transition-all duration-300 text-white ${
                    isArchive 
                      ? 'bg-gradient-to-r from-blue-600 to-cyan-600' 
                      : 'bg-gradient-to-r from-red-600 to-pink-600'
                  }`}
                >
                  {isArchive ? 'Archivar' : 'Eliminar'}
                </motion.button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;