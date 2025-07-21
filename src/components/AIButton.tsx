import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface AIButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  variant?: 'save' | 'cancel' | 'primary';
}

const AIButton: React.FC<AIButtonProps> = ({
  children,
  onClick,
  className = '',
  size = 'sm',
  disabled = false,
  type = 'button',
  variant = 'save'
}) => {
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = () => {
    if (disabled) return;
    
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 2000);
    
    if (onClick) {
      onClick();
    }
  };

  const getVariantClasses = () => {
    switch (variant) {
      case 'save':
        return `
          bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 
          text-white shadow-lg hover:shadow-xl
          hover:from-green-600 hover:via-emerald-600 hover:to-teal-600
        `;
      case 'cancel':
        return `
          bg-gradient-to-r from-gray-500 via-gray-600 to-gray-700 
          text-white shadow-lg hover:shadow-xl
          hover:from-gray-600 hover:via-gray-700 hover:to-gray-800
        `;
      case 'primary':
        return `
          bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 
          text-white shadow-lg hover:shadow-xl
          hover:from-blue-600 hover:via-purple-600 hover:to-cyan-600
        `;
      default:
        return '';
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 text-xs';
      case 'md':
        return 'px-4 py-2 text-sm';
      case 'lg':
        return 'px-6 py-3 text-base';
      default:
        return 'px-3 py-2 text-xs';
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
        scale: disabled ? 1 : 1.05,
        boxShadow: disabled ? undefined : variant === 'save' 
          ? "0 0 25px rgba(34, 197, 94, 0.6)" 
          : variant === 'cancel'
          ? "0 0 25px rgba(107, 114, 128, 0.6)"
          : "0 0 25px rgba(59, 130, 246, 0.6)"
      }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
    >
      {/* AI Sparkle Effect */}
      {isClicked && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ duration: 2 }}
        >
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                scale: 0, 
                x: 0, 
                y: 0,
                rotate: 0
              }}
              animate={{ 
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 60],
                y: [0, (Math.random() - 0.5) * 60],
                rotate: [0, 360]
              }}
              transition={{ 
                duration: 1.5, 
                delay: i * 0.1,
                ease: "easeOut"
              }}
            >
              <Sparkles className="w-3 h-3 text-white" />
            </motion.div>
          ))}
        </motion.div>
      )}
      
      {/* Neural Network Effect */}
      {isClicked && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: '-100%', skewX: -45 }}
          animate={{ x: '200%', skewX: -45 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        />
      )}
      
      {/* Content */}
      <span className="relative z-10 flex items-center justify-center space-x-2">
        {children}
      </span>
      
      {/* AI Glow Pulse */}
      {isClicked && (
        <motion.div
          className="absolute inset-0 rounded-lg"
          animate={{ 
            boxShadow: [
              '0 0 0px rgba(34, 197, 94, 0)',
              '0 0 30px rgba(34, 197, 94, 0.8)',
              '0 0 60px rgba(34, 197, 94, 0.4)',
              '0 0 0px rgba(34, 197, 94, 0)'
            ]
          }}
          transition={{ duration: 2, ease: "easeInOut" }}
        />
      )}
    </motion.button>
  );
};

export default AIButton;