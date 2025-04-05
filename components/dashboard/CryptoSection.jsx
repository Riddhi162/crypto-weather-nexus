// components/dashboard/CryptoSection.jsx
import { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Link from 'next/link';
import { fetchCryptoPrices } from '../../store/slices/cryptoSlice';
import { addFavoriteCrypto, removeFavoriteCrypto } from '../../store/slices/userPreferencesSlice';
import { ArrowUpIcon, ArrowDownIcon, StarIcon } from 'lucide-react';
import React from 'react';
import Button from '../common/Button';
import { CryptoWebSocketService } from '../../services/websocketService';
export default function CryptoSection() {
  const dispatch = useDispatch();
  const { prices, loading, error } = useSelector((state) => state.crypto);
  const { favoriteCryptos } = useSelector((state) => state.userPreferences);
  const [newCrypto, setNewCrypto] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [realTimePrices, setRealTimePrices] = useState({});
  const wsServiceRef = useRef(null);

  
  const defaultCryptos = ['bitcoin', 'ethereum', 'solana'];

  
  const handleWebSocketMessage = (data) => {
    setRealTimePrices(prevPrices => ({ ...prevPrices, ...data }));
  };

  
  useEffect(() => {
   
    const cryptosToTrack = [...new Set([...defaultCryptos, ...favoriteCryptos])];
    
    dispatch(fetchCryptoPrices(cryptosToTrack));

    if (!wsServiceRef.current) {
      wsServiceRef.current = new CryptoWebSocketService(handleWebSocketMessage);
    }
    wsServiceRef.current.connect(cryptosToTrack);

    const intervalId = setInterval(() => {
      dispatch(fetchCryptoPrices(cryptosToTrack));
    }, 60000);

    return () => {
      clearInterval(intervalId);
      if (wsServiceRef.current) {
        wsServiceRef.current.disconnect();
      }
    };
  }, [dispatch, favoriteCryptos]);

  useEffect(() => {
    if (wsServiceRef.current && wsServiceRef.current.isConnected) {
      const cryptosToTrack = [...new Set([...defaultCryptos, ...favoriteCryptos])];
      wsServiceRef.current.disconnect();
      wsServiceRef.current.connect(cryptosToTrack);
    }
  }, [favoriteCryptos]);

  const handleAddCrypto = (e) => {
    e.preventDefault();
    if (newCrypto.trim()) {
      dispatch(addFavoriteCrypto(newCrypto.trim().toLowerCase()));
      setNewCrypto('');
      setShowAddForm(false);
    }
  };
  const toggleFavorite = (cryptoId) => {
    if (favoriteCryptos.includes(cryptoId)) {
      dispatch(removeFavoriteCrypto(cryptoId));
    } else {
      dispatch(addFavoriteCrypto(cryptoId));
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const formatMarketCap = (marketCap) => {
    if (marketCap >= 1000000000) {
      return `$${(marketCap / 1000000000).toFixed(2)}B`;
    } else if (marketCap >= 1000000) {
      return `$${(marketCap / 1000000).toFixed(2)}M`;
    } else {
      return `$${(marketCap / 1000).toFixed(2)}K`;
    }
  };

  const getCurrentPrice = (crypto) => {
    if (realTimePrices[crypto.id]) {
      return parseFloat(realTimePrices[crypto.id]);
    }
    return crypto.current_price;
  };

  const hasPriceChanged = (crypto) => {
    return realTimePrices[crypto.id] !== undefined;
  };

  return (
    <div className="crypto-section bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white">Cryptocurrency</h2>
        <Button
          title={showAddForm ? 'Cancel' : '+ Add'}
          variant="primary"
          size="small"
          onClick={() => setShowAddForm(!showAddForm)}
        />
      </div>

      {showAddForm && (
        <form onSubmit={handleAddCrypto} className="mb-4 flex">
          <input
            type="text"
            value={newCrypto}
            onChange={(e) => setNewCrypto(e.target.value)}
            className="flex-1 border rounded-l px-3 py-2 dark:bg-gray-700 dark:text-white dark:border-gray-600"
            placeholder="Enter crypto ID (e.g., cardano)"
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r hover:bg-blue-600 transition-colors"
          >
            Add
          </button>
        </form>
      )}

      {loading && prices.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading cryptocurrency data...</p>
        </div>
      )}

      {error && prices.length === 0 && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>Failed to load cryptocurrency data. Please try again later.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {prices.map((crypto) => {
          // Get the current price (either from WebSocket or API)
          const currentPrice = getCurrentPrice(crypto);
          
          // Calculate price change
          const priceChange = crypto.price_change_percentage_24h;
          const isPriceUp = priceChange > 0;
          
          // Check if price is being updated in real-time
          const isRealTime = hasPriceChanged(crypto);

          return (
            <div 
              key={crypto.id} 
              className={`crypto-card p-4 rounded-lg border ${
                favoriteCryptos.includes(crypto.id) 
                  ? 'border-yellow-400 dark:border-yellow-600' 
                  : 'border-gray-200 dark:border-gray-700'
              } relative transition-all hover:shadow-md ${
                isRealTime ? 'bg-blue-50 dark:bg-blue-900/10' : ''
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <img 
                    src={crypto.image} 
                    alt={crypto.name} 
                    className="w-8 h-8 mr-2" 
                  />
                  <div>
                    <h3 className="font-medium dark:text-white">{crypto.name}</h3>
                    <span className="text-gray-500 dark:text-gray-400 text-sm">{crypto.symbol.toUpperCase()}</span>
                  </div>
                </div>
                <button 
                  onClick={() => toggleFavorite(crypto.id)}
                  className="focus:outline-none"
                >
                  <StarIcon 
                    className={`h-5 w-5 ${
                      favoriteCryptos.includes(crypto.id) 
                        ? 'text-yellow-400 fill-yellow-400' 
                        : 'text-gray-400 dark:text-gray-500'
                    }`} 
                  />
                </button>
              </div>
              
              <div className="mt-3">
                <div className={`text-lg font-bold dark:text-white ${
                  isRealTime ? 'animate-pulse' : ''
                }`}>
                  {formatPrice(currentPrice)}
                  {isRealTime && (
                    <span className="ml-2 text-xs text-blue-500 dark:text-blue-400">LIVE</span>
                  )}
                </div>
                <div className={`flex items-center text-sm ${
                  isPriceUp ? 'text-green-500' : 'text-red-500'
                }`}>
                  {isPriceUp ? (
                    <ArrowUpIcon className="w-4 h-4 mr-1" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 mr-1" />
                  )}
                  <span>{Math.abs(priceChange).toFixed(2)}%</span>
                </div>
              </div>
              
              <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                Market Cap: {formatMarketCap(crypto.market_cap)}
              </div>
              
              <Link 
                href={`/crypto/${crypto.id}`}
                className="mt-3 text-sm text-blue-500 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 block"
              >
                <Button
                  title="View Details"
                  variant="secondary"
                  className="w-1/2"
                />
              </Link>
            </div>
          );
        })}
      </div>

      {prices.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No cryptocurrency data available. Click "Add" to track cryptocurrencies.
        </div>
      )}
      
      {wsServiceRef.current && wsServiceRef.current.isConnected && (
        <div className="mt-4 text-xs text-right text-green-500 dark:text-green-400">
          Live updates active
        </div>
      )}
    </div>
  );
}