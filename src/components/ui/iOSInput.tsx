'use client';

import { motion } from '@/lib/motion';
import { useState, InputHTMLAttributes } from 'react';

interface IOSInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
}

export default function IOSInput({
  label,
  error,
  helperText,
  icon,
  leftIcon,
  rightIcon,
  fullWidth = true,
  className = '',
  type,
  ...props
}: IOSInputProps) {
  // Use icon prop as leftIcon if provided
  const displayLeftIcon = icon || leftIcon;
  const [isFocused, setIsFocused] = useState(false);
  const [hasValue, setHasValue] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPasswordField = type === 'password';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setHasValue(e.target.value.length > 0);
    props.onChange?.(e);
  };

  return (
    <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
      {/* Label */}
      {label && (
        <motion.label
          initial={{ opacity: 0.7 }}
          animate={{ opacity: isFocused || hasValue ? 1 : 0.7 }}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </motion.label>
      )}

      {/* Input container */}
      <motion.div
        initial={false}
        animate={{
          scale: isFocused ? 1.01 : 1,
        }}
        transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] as any }}
        className="relative"
      >
        {/* Glow effect */}
        <motion.div
          initial={false}
          animate={{
            opacity: isFocused ? 1 : 0,
            scale: isFocused ? 1 : 0.95,
          }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-indigo-600/20 rounded-2xl blur-xl"
        />

        {/* Input wrapper */}
        <div className="relative">
          {/* Left icon */}
          {displayLeftIcon && (
            <motion.div
              animate={{
                color: isFocused ? '#2563eb' : '#6b7280',
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-xl"
            >
              {displayLeftIcon}
            </motion.div>
          )}

          {/* Input */}
          <input
            {...props}
            type={isPasswordField && showPassword ? 'text' : type}
            onChange={handleChange}
            onFocus={(e) => {
              setIsFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setIsFocused(false);
              props.onBlur?.(e);
            }}
            className={`
              w-full px-4 py-4 
              ${displayLeftIcon ? 'pl-12' : ''} 
              ${rightIcon || isPasswordField ? 'pr-12' : ''}
              bg-white/80 backdrop-blur-xl backdrop-saturate-[180%]
              border-2 transition-all duration-300
              ${error 
                ? 'border-red-300 focus:border-red-500' 
                : isFocused
                  ? 'border-blue-500 shadow-[0_10px_40px_-15px_rgba(0,122,255,0.3)]'
                  : 'border-gray-200/50 hover:border-gray-300/80'
              }
              rounded-2xl
              text-gray-900 placeholder:text-gray-400
              focus:outline-none focus:ring-0
              disabled:opacity-50 disabled:cursor-not-allowed
            `}
          />

          {/* Password visibility toggle */}
          {isPasswordField && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition-colors focus:outline-none"
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          )}

          {/* Right icon */}
          {rightIcon && !isPasswordField && (
            <motion.div
              animate={{
                color: isFocused ? '#2563eb' : '#6b7280',
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xl"
            >
              {rightIcon}
            </motion.div>
          )}

          {/* Focus ring animation */}
          {isFocused && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="absolute inset-0 rounded-2xl border-2 border-blue-500 pointer-events-none"
              style={{
                boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.1)',
              }}
            />
          )}
        </div>
      </motion.div>

      {/* Error message */}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-sm text-red-600 flex items-center gap-1"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </motion.p>
      )}

      {/* Helper text */}
      {helperText && !error && (
        <p className="mt-2 text-xs text-gray-500">
          {helperText}
        </p>
      )}
    </div>
  );
}
