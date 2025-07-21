import React, { useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface FloatingLabelProps {
  id: string;
  type: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  icon?: ReactNode;
  className?: string;
}

const FloatingLabel: React.FC<FloatingLabelProps> = ({
  id,
  type,
  label,
  value,
  onChange,
  required = false,
  icon,
  className = ''
}) => {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 z-10">
            {icon}
          </div>
        )}
        
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full bg-white/10 border border-white/20 rounded-xl px-4 py-3 text-white placeholder-transparent focus:outline-none focus:border-blue-400 focus:bg-white/20 transition-all duration-300 ${
            icon ? 'pl-12' : ''
          }`}
          placeholder={label}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
        />
        
        <motion.label
          htmlFor={id}
          className={`absolute left-4 text-gray-300 transition-all duration-300 pointer-events-none ${
            icon ? 'left-12' : ''
          }`}
          animate={{
            top: (isFocused || value) ? '0.5rem' : '50%',
            fontSize: (isFocused || value) ? '0.75rem' : '1rem',
            y: (isFocused || value) ? 0 : '-50%',
            color: isFocused ? '#60a5fa' : '#9ca3af'
          }}
          transition={{ duration: 0.2 }}
        >
          {label}
        </motion.label>
      </div>
    </div>
  );
};

export default FloatingLabel;