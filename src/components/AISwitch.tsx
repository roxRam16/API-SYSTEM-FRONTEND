import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Circle } from 'lucide-react';

interface AISwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const AISwitch: React.FC<AISwitchProps> = ({
  checked,
  onChange,
  label,
  disabled = false,
  size = 'md'
}) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'sm':
        return {
          container: 'w-10 h-6',
          thumb: 'w-4 h-4',
          translate: 'translate-x-4'
        };
      case 'md':
        return {
          container: 'w-12 h-7',
          thumb: 'w-5 h-5',
          translate: 'translate-x-5'
        };
      case 'lg':
        return {
          container: 'w-14 h-8',
          thumb: 'w-6 h-6',
          translate: 'translate-x-6'
        };
      default:
        return {
          container: 'w-12 h-7',
          thumb: 'w-5 h-5',
          translate: 'translate-x-5'
        };
    }
  };

  const sizeClasses = getSizeClasses();

  return (
    <div className="flex items-center space-x-3">
      {label && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </span>
      )}
      
      <motion.button
        type="button"
        onClick={() => !disabled && onChange(!checked)}
        disabled={disabled}
        className={`
          relative inline-flex items-center ${sizeClasses.container} rounded-full 
          transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
          ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
          ${checked 
            ? 'bg-gradient-to-r from-blue-500 via-cyan-500 to-blue-600 shadow-lg shadow-blue-500/30' 
            : 'bg-gray-300 dark:bg-gray-600'
          }
        `}
        whileHover={!disabled ? { scale: 1.05 } : {}}
        whileTap={!disabled ? { scale: 0.95 } : {}}
      >
        {/* Neural Network Background Effect */}
        {checked && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              background: [
                'linear-gradient(45deg, rgba(59,130,246,0.8), rgba(6,182,212,0.8))',
                'linear-gradient(45deg, rgba(6,182,212,0.8), rgba(139,92,246,0.8))',
                'linear-gradient(45deg, rgba(139,92,246,0.8), rgba(59,130,246,0.8))'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* AI Particles */}
        {checked && (
          <div className="absolute inset-0 rounded-full overflow-hidden">
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/60 rounded-full"
                style={{
                  left: `${20 + i * 20}%`,
                  top: '50%'
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, -2, 0]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.3
                }}
              />
            ))}
          </div>
        )}

        {/* Switch Thumb */}
        <motion.div
          className={`
            ${sizeClasses.thumb} bg-white rounded-full shadow-lg flex items-center justify-center
            transform transition-transform duration-300 relative z-10
            ${checked ? sizeClasses.translate : 'translate-x-1'}
          `}
          layout
        >
          {checked ? (
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Zap className="w-3 h-3 text-blue-600" />
            </motion.div>
          ) : (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Circle className="w-3 h-3 text-gray-400" />
            </motion.div>
          )}
        </motion.div>

        {/* Glow Effect */}
        {checked && (
          <motion.div
            className="absolute inset-0 rounded-full"
            animate={{
              boxShadow: [
                '0 0 0px rgba(59, 130, 246, 0)',
                '0 0 20px rgba(59, 130, 246, 0.6)',
                '0 0 0px rgba(59, 130, 246, 0)'
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </motion.button>
    </div>
  );
};

export default AISwitch;