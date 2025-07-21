import React from 'react';
import { motion } from 'framer-motion';
import { Menu, Bell, Search, User, LogOut, Package, Users, Truck } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const quickSearchOptions = [
    { label: 'Productos', icon: Package, path: '/products' },
    { label: 'Clientes', icon: Users, path: '/customers' },
    { label: 'Proveedores', icon: Truck, path: '/suppliers' }
  ];

  const handleQuickSearch = (path: string) => {
    navigate(path);
  };

  const handleProfileClick = () => {
    navigate('/profile');
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
          </button>
          
          <div className="relative hidden md:block group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-gray-50 dark:bg-gray-700 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 dark:text-white"
              placeholder="Buscar productos, clientes..."
            />
            
            {/* Quick Search Dropdown */}
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mt-1 shadow-lg opacity-0 invisible group-focus-within:opacity-100 group-focus-within:visible transition-all duration-200 z-10">
              <div className="p-2">
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2 px-2">Acceso rápido:</p>
                {quickSearchOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.path}
                      onClick={() => handleQuickSearch(option.path)}
                      className="w-full flex items-center space-x-3 px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                      <Icon className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{option.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></span>
          </motion.button>

          {/* Profile Section - Clickable */}
          <motion.button
            onClick={handleProfileClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.role}</p>
            </div>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={logout}
            className="p-2 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </header>
  );
};

export default Header;