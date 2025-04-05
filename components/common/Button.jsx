// components/ui/Button.js
import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Button Component
 * @param {Object} props - Component props
 * @param {string} props.title - Button text
 * @param {string} [props.variant='primary'] - Button variant (primary, secondary, danger, success)
 * @param {string} [props.size='medium'] - Button size (small, medium, large)
 * @param {boolean} [props.isActive=false] - Whether the button is in active state
 * @param {boolean} [props.isLoading=false] - Whether to show loading state
 * @param {boolean} [props.isDisabled=false] - Whether the button is disabled
 * @param {Function} [props.onClick] - Click handler function
 * @param {React.ReactNode} [props.leftIcon] - Icon to display on the left
 * @param {React.ReactNode} [props.rightIcon] - Icon to display on the right
 * @param {string} [props.className] - Additional CSS classes
 */
const Button = ({
  title,
  variant = 'primary',
  size = 'medium',
  isActive = false,
  isLoading = false,
  isDisabled = false,
  onClick,
  leftIcon,
  rightIcon,
  className = '',
  ...props
}) => {
  // Variant styles
  const variantStyles = {
    primary: {
      base: 'bg-teal-600 text-white border border-transparent',
      hover: 'hover:bg-teal-500',
      active: 'bg-teal-700',
      disabled: 'bg-teal-600/50 cursor-not-allowed',
    },
    secondary: {
      base: 'bg-gray-700 text-gray-200 border border-gray-600',
      hover: 'hover:bg-gray-600',
      active: 'bg-gray-800',
      disabled: 'bg-gray-700/50 text-gray-400 cursor-not-allowed',
    },
    tertiary: {
      base: 'bg-transparent text-gray-200 border border-gray-700',
      hover: 'hover:bg-gray-700/50 hover:border-gray-600',
      active: 'bg-gray-700/70',
      disabled: 'text-gray-500 border-gray-700/50 cursor-not-allowed',
    },
    danger: {
      base: 'bg-red-600 text-white border border-transparent',
      hover: 'hover:bg-red-500',
      active: 'bg-red-700',
      disabled: 'bg-red-600/50 cursor-not-allowed',
    },
    success: {
      base: 'bg-green-600 text-white border border-transparent',
      hover: 'hover:bg-green-500',
      active: 'bg-green-700',
      disabled: 'bg-green-600/50 cursor-not-allowed',
    },
    glass: {
      base: 'backdrop-blur-lg bg-black/20 text-white border border-white/10',
      hover: 'hover:bg-black/30',
      active: 'bg-black/15',
      disabled: 'bg-black/5 text-white/50 cursor-not-allowed',
    },
  };

  // Size styles
  const sizeStyles = {
    small: 'text-xs px-3 py-1.5 rounded-lg',
    medium: 'text-sm px-4 py-2 rounded-lg',
    large: 'text-base px-6 py-3 rounded-xl',
  };

  // State styles
  const getStateStyles = () => {
    if (isDisabled) return variantStyles[variant].disabled;
    if (isActive) return variantStyles[variant].active;
    return `${variantStyles[variant].base} ${variantStyles[variant].hover}`;
  };

  // Combined classes
  const buttonClasses = `
    flex items-center justify-center font-medium transition-all duration-200
    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-400
    ${sizeStyles[size]}
    ${getStateStyles()}
    ${className}
  `.trim();

  return (
    <motion.button
      whileTap={{ scale: isDisabled ? 1 : 0.97 }}
      onClick={isDisabled ? undefined : onClick}
      disabled={isDisabled || isLoading}
      className={buttonClasses}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center justify-center">
          <div className="w-5 h-5 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
          <span>Loading...</span>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          {leftIcon && <span className="mr-2">{leftIcon}</span>}
          <span>{title}</span>
          {rightIcon && <span className="ml-2">{rightIcon}</span>}
        </div>
      )}
    </motion.button>
  );
};

export default Button;