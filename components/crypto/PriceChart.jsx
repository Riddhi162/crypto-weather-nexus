// components/crypto/PriceChart.jsx
import React from 'react';
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function PriceChart({ data, timeRange, color }) {
 
  const formatXAxis = (tickItem) => {
    if (!tickItem) return '';
    
    
    if (timeRange === '1') {
    
      const date = new Date(tickItem);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else if (timeRange === '7') {
      
      const date = new Date(tickItem);
      return date.toLocaleDateString([], { weekday: 'short' });
    } else if (timeRange === '30') {
    
      const date = new Date(tickItem);
      return date.toLocaleDateString([], { day: 'numeric', month: 'short' });
    } else {
     
      const date = new Date(tickItem);
      return date.toLocaleDateString([], { month: 'short', year: '2-digit' });
    }
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(value);
  };

  
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white dark:bg-gray-800 p-3 border border-gray-200 dark:border-gray-700 rounded shadow-lg">
          <p className="text-gray-500 dark:text-gray-400 text-sm">{label}</p>
          <p className="font-medium text-gray-900 dark:text-white">
            {formatPrice(payload[0].value)}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#eaeaea" />
        <XAxis 
          dataKey="date" 
          tickFormatter={formatXAxis} 
          tick={{ fontSize: 12, fill: '#718096' }}
          tickMargin={10}
        />
        <YAxis 
          domain={['auto', 'auto']}
          tick={{ fontSize: 12, fill: '#718096' }}
          tickFormatter={(value) => {
            if (value >= 1000) return `$${(value / 1000).toFixed(1)}k`;
            return `$${value}`;
          }}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="price" 
          stroke={color} 
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}