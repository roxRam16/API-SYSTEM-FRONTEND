import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  Package, 
  Users, 
  ShoppingCart, 
  Truck, 
  PlusCircle, 
  BarChart3, 
  UserCheck, 
  Settings,
  X,
  Brain,
  Moon,
  Sun
} from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const location = useLocation();
  const { isDarkMode, toggleTheme } = useTheme();
  const [isHovered, setIsHovered] = useState(false);

  const menuItems = [
    { path: '/', icon: Home, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Productos' },
    { path: '/customers', icon: Users, label: 'Clientes' },
    { path: '/sales', icon: ShoppingCart, label: 'Ventas' },
    { path: '/suppliers', icon: Truck, label: 'Proveedores' },
    { path: '/new-sale', icon: PlusCircle, label: 'Nueva Venta' },
    { path: '/reports', icon: BarChart3, label: 'Reportes' },
    { path: '/users', icon: UserCheck, label: 'Usuarios' },
    { path: '/profile', icon: Settings, label: 'Perfil' }
  ];

  const shouldShowExpanded = isOpen || isHovered;

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={onClose}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed left-0 top-0 h-full bg-gradient-to-b from-gray-800 to-gray-900 dark:from-gray-900 dark:to-black border-r border-gray-700 dark:border-gray-800 z-50 transform transition-all duration-300 ease-in-out ${
          isOpen 
            ? 'w-64 translate-x-0' // Mobile: full width when open
            : '-translate-x-full lg:translate-x-0' // Mobile: hidden, Desktop: visible
        }`}
        animate={{
          width: shouldShowExpanded ? 256 : 64
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{ width: shouldShowExpanded ? 256 : 64 }}
      >
        
        {/* Header */}
        <div className={`flex items-center p-4 border-b border-gray-700 dark:border-gray-800 ${
          !shouldShowExpanded ? 'justify-center' : 'justify-between'
        }`}>
          <div className={`flex items-center ${shouldShowExpanded ? 'space-x-3' : 'space-x-0'}`}>
            <motion.div 
              className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 0 20px rgba(59, 130, 246, 0.5)"
              }}
              transition={{ duration: 0.3 }}
            >
              <Brain className="w-5 h-5 text-white" />
            </motion.div>
            <AnimatePresence>
              {shouldShowExpanded && (
                <motion.div
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="text-lg font-bold text-white whitespace-nowrap">AI POS</h1>
                  <p className="text-xs text-gray-400 whitespace-nowrap">Sistema Inteligente</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          <AnimatePresence>
            {shouldShowExpanded && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-2"
              >
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={toggleTheme}
                  className="p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </motion.button>
                <button
                  onClick={onClose}
                  className="lg:hidden p-2 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation */}
        <nav className="p-2 space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`flex items-center px-3 py-3 rounded-xl transition-all duration-200 group relative overflow-hidden ${
                  isActive 
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg' 
                    : 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
                } ${!shouldShowExpanded ? 'justify-center' : 'space-x-3'}`}
                title={!shouldShowExpanded ? item.label : undefined}
              >
                {/* AI Hover Effect */}
                {!isActive && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{
                      background: [
                        "linear-gradient(90deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)",
                        "linear-gradient(90deg, rgba(147,51,234,0.1) 0%, rgba(59,130,246,0.1) 100%)",
                        "linear-gradient(90deg, rgba(59,130,246,0.1) 0%, rgba(147,51,234,0.1) 100%)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                )}
                
                <Icon className={`w-5 h-5 relative z-10 flex-shrink-0 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                
                <AnimatePresence>
                  {shouldShowExpanded && (
                    <motion.span
                      initial={{ opacity: 0, width: 0 }}
                      animate={{ opacity: 1, width: 'auto' }}
                      exit={{ opacity: 0, width: 0 }}
                      transition={{ duration: 0.2 }}
                      className="font-medium relative z-10 whitespace-nowrap"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
                
                {isActive && shouldShowExpanded && (
                  <motion.div
                    className="ml-auto w-2 h-2 bg-white rounded-full relative z-10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* AI Status - Only show when expanded */}
        <AnimatePresence>
          {shouldShowExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              className="absolute bottom-6 left-4 right-4"
            >
              <motion.div 
                className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl p-4 border border-blue-400/30"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-sm text-blue-200 font-medium">IA Activada</p>
                <p className="text-xs text-gray-400 mt-1">Análisis en tiempo real</p>
                <div className="flex space-x-1 mt-2">
                  {[...Array(3)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="w-1 h-1 bg-blue-400 rounded-full"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
};

export default Sidebar;