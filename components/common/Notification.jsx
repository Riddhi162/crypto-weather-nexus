// components/Notification.jsx
import { useState, useEffect } from 'react';
import { X, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react';
import React, { useMemo } from 'react'
export const NotificationType = {
  SUCCESS: 'success',
  ERROR: 'error',
  INFO: 'info',
  WARNING: 'warning',
  PRICE_UP: 'price_up',
  PRICE_DOWN: 'price_down',
  WEATHER: 'weather'
};

export default function Notification({ 
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose 
}) {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-close notification after duration
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300); // Allow close animation to complete
  };

  // Get icon based on notification type
  const getIcon = () => {
    switch (type) {
      case NotificationType.PRICE_UP:
        return <TrendingUp className="h-5 w-5 text-green-600" />;
      case NotificationType.PRICE_DOWN:
        return <TrendingDown className="h-5 w-5 text-red-600" />;
      case NotificationType.WEATHER:
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case NotificationType.WARNING:
        return <AlertTriangle className="h-5 w-5 text-amber-600" />;
      case NotificationType.ERROR:
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      default:
        return null;
    }
  };

  // Get color scheme based on notification type
  const getColorScheme = () => {
    switch (type) {
      case NotificationType.SUCCESS:
        return 'bg-green-50 border-green-200 text-green-800';
      case NotificationType.ERROR:
        return 'bg-red-50 border-red-200 text-red-800';
      case NotificationType.WARNING:
      case NotificationType.WEATHER:
        return 'bg-amber-50 border-amber-200 text-amber-800';
      case NotificationType.PRICE_UP:
        return 'bg-green-50 border-green-200 text-green-800';
      case NotificationType.PRICE_DOWN:
        return 'bg-red-50 border-red-200 text-red-800';
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800';
    }
  };

  return (
    <div 
      className={`
        notification fixed right-4 max-w-sm w-full shadow-lg rounded-lg border-l-4 overflow-hidden
        transition-all duration-300 transform
        ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getColorScheme()}
      `}
      style={{ top: '1rem', zIndex: 100 }}
    >
      <div className="p-4 flex">
        {getIcon() && (
          <div className="flex-shrink-0 mr-3">
            {getIcon()}
          </div>
        )}
        
        <div className="flex-1">
          {title && <h4 className="font-medium text-sm">{title}</h4>}
          {message && <p className="text-xs mt-1">{message}</p>}
        </div>
        
        <button 
          onClick={handleClose}
          className="flex-shrink-0 ml-2 text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}