// components/crypto/MetricsCard.jsx
import React from 'react';
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-react';

export default function MetricsCard({ title, value, changePercentage, secondaryValue }) {
 
  const formatPercentage = (value) => {
    if (value === undefined || value === null) return null;
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const formattedChange = formatPercentage(changePercentage);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-2">{title}</h3>
      
      <div className="flex items-end">
        <div className="text-xl font-bold dark:text-white">{value}</div>
        
        {formattedChange && (
          <div className={`ml-3 flex items-center text-sm ${
            changePercentage >= 0 ? 'text-green-500' : 'text-red-500'
          }`}>
            {changePercentage >= 0 ? (
              <TrendingUpIcon className="w-4 h-4 mr-1" />
            ) : (
              <TrendingDownIcon className="w-4 h-4 mr-1" />
            )}
            <span>{formattedChange}</span>
          </div>
        )}
      </div>
      
      {secondaryValue && (
        <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          {secondaryValue}
        </div>
      )}
    </div>
  );
}