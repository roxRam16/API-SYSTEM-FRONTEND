import React, { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FloatingLabelInputProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  required?: boolean;
  icon?: ReactNode;
  className?: string;
  disabled?: boolean;
  placeholder?: string;
  rows?: number;
  multiline?: boolean;
}

const FloatingLabelInput: React.FC<FloatingLabelInputProps> = ({
  id,
  type,
  label,
  value,
  onChange,
  required = false,
  icon,
  className = '',
  disabled = false,
  placeholder,
  rows = 3,
  multiline = false
}) => {
  const [isFocused, setIsFocused] = useState(false);
  const [isGlowing, setIsGlowing] = useState(false);

  const hasValue = value && value.length > 0;
  const shouldFloat = isFocused || hasValue;

  const handleFocus = () => {
    setIsFocused(true);
    setIsGlowing(true);
    setTimeout(() => setIsGlowing(false), 1500);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  const inputClasses = `
    w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 
    bg-white dark:bg-gray-700 text-gray-900 dark:text-white
    transition-all duration-300
    ${icon ? 'pl-12' : ''}
    ${disabled ? 'bg-gray-50 dark:bg-gray-600 cursor-not-allowed' : ''}
    ${isFocused ? 'shadow-lg shadow-blue-500/20' : ''}
    ${className}
  `;

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {/* Icon with proper spacing */}
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        
        {/* Input or Textarea */}
        {multiline ? (
          <textarea
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            rows={rows}
            className={inputClasses}
            placeholder={shouldFloat ? placeholder : ''}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ) : (
          <input
            id={id}
            name={id}
            type={type}
            value={value}
            onChange={onChange}
            required={required}
            disabled={disabled}
            className={inputClasses}
            placeholder={shouldFloat ? placeholder : ''}
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        )}
        
        {/* Floating Label with proper spacing from icon */}
        <motion.label
          htmlFor={id}
          className={`
            absolute text-gray-500 dark:text-gray-400 transition-all duration-300 
            pointer-events-none bg-white dark:bg-gray-700 px-2 rounded
            ${icon ? 'left-12' : 'left-4'}
            ${shouldFloat ? 'text-xs -top-2 text-blue-600 dark:text-blue-400' : 'text-base top-1/2 -translate-y-1/2'}
            ${isFocused ? 'text-blue-600 dark:text-blue-400' : ''}
          `}
          animate={{
            fontSize: shouldFloat ? '0.75rem' : '1rem',
            top: shouldFloat ? '-0.5rem' : '50%',
            y: shouldFloat ? 0 : '-50%',
            color: isFocused ? '#3b82f6' : '#6b7280'
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </motion.label>

        {/* AI Glow Effect on Focus */}
        {isGlowing && (
          <motion.div
            className="absolute inset-0 rounded-lg pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.8, 0],
              boxShadow: [
                '0 0 0px rgba(59, 130, 246, 0)',
                '0 0 30px rgba(59, 130, 246, 0.6)',
                '0 0 60px rgba(59, 130, 246, 0.3)',
                '0 0 0px rgba(59, 130, 246, 0)'
              ]
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        )}

        {/* Neural Network Particles on Focus */}
        {isFocused && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
            {[...Array(4)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full"
                style={{
                  left: `${20 + i * 20}%`,
                  top: '10%'
                }}
                animate={{
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                  y: [0, 20, 40]
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FloatingLabelInput;