// components/crypto/MarketDataTable.jsx
import React from 'react';

export default function MarketDataTable({ cryptoDetails }) {
  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Format date
  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-bold mb-6 dark:text-white">Market Data</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column */}
        <div>
          <table className="w-full">
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 text-gray-500 dark:text-gray-400">Market Cap Rank</td>
                <td className="py-3 text-right font-medium dark:text-white">#{cryptoDetails.market_data.market_cap_rank}</td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 text-gray-500 dark:text-gray-400">All-Time High</td>
                <td className="py-3 text-right">
                  <div className="font-medium dark:text-white">{formatPrice(cryptoDetails.market_data.ath.usd)}</div>
                  <div className={`text-sm ${
                    cryptoDetails.market_data.ath_change_percentage.usd >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {cryptoDetails.market_data.ath_change_percentage.usd.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(cryptoDetails.market_data.ath_date.usd)}
                  </div>
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 text-gray-500 dark:text-gray-400">All-Time Low</td>
                <td className="py-3 text-right">
                  <div className="font-medium dark:text-white">{formatPrice(cryptoDetails.market_data.atl.usd)}</div>
                  <div className={`text-sm ${
                    cryptoDetails.market_data.atl_change_percentage.usd >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {cryptoDetails.market_data.atl_change_percentage.usd.toFixed(2)}%
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {formatDate(cryptoDetails.market_data.atl_date.usd)}
                  </div>
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 text-gray-500 dark:text-gray-400">ROI</td>
                <td className="py-3 text-right">
                  {cryptoDetails.market_data.roi ? (
                    <div className={`font-medium ${
                      cryptoDetails.market_data.roi.percentage >= 0 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                      {cryptoDetails.market_data.roi.percentage.toFixed(2)}%
                    </div>
                  ) : (
                    <div className="text-gray-500 dark:text-gray-400">N/A</div>
                  )}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        
        {/* Right column */}
        <div>
          <table className="w-full">
            <tbody>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 text-gray-500 dark:text-gray-400">Circulating Supply</td>
                <td className="py-3 text-right font-medium dark:text-white">
                  {cryptoDetails.market_data.circulating_supply.toLocaleString()} {cryptoDetails.symbol.toUpperCase()}
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 text-gray-500 dark:text-gray-400">Total Supply</td>
                <td className="py-3 text-right font-medium dark:text-white">
                  {cryptoDetails.market_data.total_supply 
                    ? `${cryptoDetails.market_data.total_supply.toLocaleString()} ${cryptoDetails.symbol.toUpperCase()}`
                    : 'N/A'
                  }
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 text-gray-500 dark:text-gray-400">Max Supply</td>
                <td className="py-3 text-right font-medium dark:text-white">
                  {cryptoDetails.market_data.max_supply 
                    ? `${cryptoDetails.market_data.max_supply.toLocaleString()} ${cryptoDetails.symbol.toUpperCase()}`
                    : 'Unlimited'
                  }
                </td>
              </tr>
              <tr className="border-b dark:border-gray-700">
                <td className="py-3 text-gray-500 dark:text-gray-400">Genesis Date</td>
                <td className="py-3 text-right font-medium dark:text-white">
                  {cryptoDetails.genesis_date ? formatDate(cryptoDetails.genesis_date) : 'N/A'}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Description */}
      {cryptoDetails.description?.en && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-3 dark:text-white">About {cryptoDetails.name}</h3>
          <div 
            className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed max-h-48 overflow-y-auto"
            dangerouslySetInnerHTML={{ __html: cryptoDetails.description.en.split('.').slice(0, 3).join('.') + '...' }}
          />
          <a 
            href={cryptoDetails.links.homepage[0]} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-2 text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 text-sm"
          >
            Visit official website →
          </a>
        </div>
      )}
    </div>
  );
}