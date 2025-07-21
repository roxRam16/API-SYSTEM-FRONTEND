import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
  type = 'button'
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 1500);
    
    if (onClick) {
      onClick();
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'primary':
        return `
          bg-gradient-to-r from-blue-600 via-purple-600 to-cyan-600 
          text-white shadow-lg hover:shadow-xl
          ${isClicked ? 'animate-color-wave bg-400%' : ''}
        `;
      case 'secondary':
        return `
          bg-gradient-to-r from-gray-600 via-gray-700 to-gray-800 
          text-white shadow-lg hover:shadow-xl
          ${isClicked ? 'animate-color-wave bg-400%' : ''}
        `;
      case 'outline':
        return `
          border-2 border-gradient-to-r from-blue-600 to-purple-600 
          text-blue-600 dark:text-blue-400 bg-transparent
          hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50
          dark:hover:from-blue-900/20 dark:hover:to-purple-900/20
          ${isClicked ? 'animate-shimmer' : ''}
        `;
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-sm';
      case 'md':
        return 'px-4 py-3 text-sm';
      case 'lg':
        return 'px-6 py-4 text-base';
      default:
        return 'px-4 py-3 text-sm';
    }
  };

  return (
    <motion.button
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={`
        relative overflow-hidden rounded-lg font-medium transition-all duration-300
        ${getVariantClasses()}
        ${getSizeClasses()}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
        ${className}
      `}
      whileHover={{ 
        scale: disabled ? 1 : 1.02,
        boxShadow: disabled ? undefined : "0 0 25px rgba(59, 130, 246, 0.4)"
      }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      style={{
        backgroundSize: isClicked ? '400% 400%' : '100% 100%',
        backgroundImage: variant === 'primary' && isClicked 
          ? 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4, #10b981, #f59e0b, #ef4444, #3b82f6)'
          : undefined
      }}
    >
      {/* Shimmer effect overlay */}
      {isClicked && variant !== 'outline' && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
          initial={{ x: '-100%' }}
          animate={{ x: '100%' }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {children}
      </span>
      
      {/* Glow effect */}
      {isClicked && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          initial={{ opacity: 0 }}
          animate={{ 
            opacity: [0, 0.8, 0],
            boxShadow: [
              '0 0 0px rgba(59, 130, 246, 0)',
              '0 0 30px rgba(59, 130, 246, 0.8)',
              '0 0 0px rgba(59, 130, 246, 0)'
            ]
          }}
          transition={{ duration: 1.5 }}
        />
      )}
    </motion.button>
  );
};

export default AnimatedButton;