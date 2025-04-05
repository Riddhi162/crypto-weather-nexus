import React, { useState, useEffect } from 'react';
import Notification, { NotificationType } from './Notification';

const NotificationManager = ({ weatherService, priceService }) => {
  const [notifications, setNotifications] = useState([]);
  
  // Function to add a new notification
  const addNotification = (type, title, message, duration = 5000) => {
    const id = Date.now().toString();
    setNotifications(prevNotifications => [
      ...prevNotifications,
      { id, type, title, message, duration }
    ]);
    
    return id;
  };
  
  // Function to remove a notification
  const removeNotification = (id) => {
    setNotifications(prevNotifications => 
      prevNotifications.filter(notification => notification.id !== id)
    );
  };
  
  // Monitor price changes (simulation)
  useEffect(() => {
    if (!priceService) return;
    
    const priceMonitor = setInterval(() => {
      // This would be your real price service integration
      const priceChange = priceService.getLatestChange();
      
      if (priceChange) {
        const { symbol, changePercent, price } = priceChange;
        
        if (Math.abs(changePercent) >= 5) {
          const type = changePercent > 0 
            ? NotificationType.PRICE_UP 
            : NotificationType.PRICE_DOWN;
            
          const direction = changePercent > 0 ? 'up' : 'down';
          
          addNotification(
            type,
            `${symbol} ${direction} ${Math.abs(changePercent).toFixed(2)}%`,
            `Current price: $${price.toFixed(2)}`,
            8000
          );
        }
      }
    }, 30000); // Check every 30 seconds
    
    return () => clearInterval(priceMonitor);
  }, [priceService]);
  
  // Monitor weather alerts (simulation)
  useEffect(() => {
    if (!weatherService) return;
    
    const weatherAlertCheck = setInterval(() => {
      // This would be your real weather service integration
      const alerts = weatherService.getActiveAlerts();
      
      alerts.forEach(alert => {
        if (!alert.notified) {
          addNotification(
            NotificationType.WEATHER,
            alert.title,
            alert.description,
            10000
          );
          
          // Mark as notified to prevent duplicate notifications
          weatherService.markAlertAsNotified(alert.id);
        }
      });
    }, 60000); // Check every minute
    
    return () => clearInterval(weatherAlertCheck);
  }, [weatherService]);
  
  // Public API for other components to use
  const api = {
    success: (title, message, duration) => 
      addNotification(NotificationType.SUCCESS, title, message, duration),
      
    error: (title, message, duration) => 
      addNotification(NotificationType.ERROR, title, message, duration),
      
    info: (title, message, duration) => 
      addNotification(NotificationType.INFO, title, message, duration),
      
    warning: (title, message, duration) => 
      addNotification(NotificationType.WARNING, title, message, duration),
      
    priceAlert: (symbol, changePercent, price, duration) => {
      const type = changePercent > 0 
        ? NotificationType.PRICE_UP 
        : NotificationType.PRICE_DOWN;
        
      const direction = changePercent > 0 ? 'up' : 'down';
      
      return addNotification(
        type,
        `${symbol} ${direction} ${Math.abs(changePercent).toFixed(2)}%`,
        `Current price: $${price.toFixed(2)}`,
        duration
      );
    },
    
    weatherAlert: (title, description, duration) => 
      addNotification(NotificationType.WEATHER, title, description, duration),
      
    remove: (id) => removeNotification(id)
  };
  
  // Expose the API globally for testing
  useEffect(() => {
    window.notificationApi = api;
    return () => { delete window.notificationApi; };
  }, []);
  
  return (
    <div className="notification-manager">
      {notifications.map((notification, index) => (
        <div 
          key={notification.id} 
          style={{ top: `${index * 5 + 1}rem` }}
          className="absolute right-0"
        >
          <Notification
            type={notification.type}
            title={notification.title}
            message={notification.message}
            duration={notification.duration}
            onClose={() => removeNotification(notification.id)}
          />
        </div>
      ))}
    </div>
  );
};

export default NotificationManager;