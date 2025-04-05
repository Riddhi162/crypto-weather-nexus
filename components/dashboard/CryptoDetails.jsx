// pages/crypto/[id].js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import Head from 'next/head';
import Link from 'next/link';
import { fetchCryptoDetails } from '../../store/slices/cryptoSlice'; // Removed fetchCryptoHistory import
import { addFavoriteCrypto, removeFavoriteCrypto } from '../../store/slices/userPreferencesSlice';
import { ArrowLeftIcon, StarIcon, TrendingUpIcon, TrendingDownIcon, RefreshCwIcon } from 'lucide-react';
import MetricsCard from '../../components/crypto/MetricsCard';
import MarketDataTable from '../../components/crypto/MarketDataTable';
import Navbar from '../common/Navbar';
import Footer from '../common/Footer';

export default function CryptoDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const dispatch = useDispatch();
  
  const { details, loading, error } = useSelector((state) => state.crypto);
  const { favoriteCryptos } = useSelector((state) => state.userPreferences);
  
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Simplified to only fetch details
  useEffect(() => {
    if (id) {
      dispatch(fetchCryptoDetails(id));
    }
  }, [dispatch, id]);

  // Simplified refresh function
  const handleRefresh = () => {
    if (id) {
      setIsRefreshing(true);
      dispatch(fetchCryptoDetails(id)).finally(() => {
        setTimeout(() => setIsRefreshing(false), 500);
      });
    }
  };

  // Toggle favorite status
  const toggleFavorite = () => {
    if (id) {
      if (favoriteCryptos.includes(id)) {
        dispatch(removeFavoriteCrypto(id));
      } else {
        dispatch(addFavoriteCrypto(id));
      }
    }
  };

  // Format price with commas
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  // Format large numbers
  const formatLargeNumber = (num) => {
    if (num >= 1000000000) {
      return `$${(num / 1000000000).toFixed(2)}B`;
    } else if (num >= 1000000) {
      return `$${(num / 1000000).toFixed(2)}M`;
    } else if (num >= 1000) {
      return `$${(num / 1000).toFixed(2)}K`;
    } else {
      return `$${num.toFixed(2)}`;
    }
  };

  // Format percentage
  const formatPercentage = (value) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  // Get crypto details
  const cryptoDetails = details[id]?.data;

  // Check if crypto is favorite
  const isFavorite = favoriteCryptos.includes(id);

  return (
    <>
      <Navbar/>
      <Head>
        <title>{cryptoDetails ? `${cryptoDetails.name} (${cryptoDetails.symbol.toUpperCase()})` : 'Cryptocurrency Details'}</title>
        <meta name="description" content={`Detailed information about ${cryptoDetails?.name || 'cryptocurrency'} including market metrics.`} />
      </Head>

      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center mb-6">
          <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 dark:text-gray-300 dark:hover:text-blue-400 mr-4">
            <ArrowLeftIcon className="w-5 h-5 mr-1" />
            <span>Back to Dashboard</span>
          </Link>
          
          <button 
            onClick={handleRefresh} 
            className={`ml-auto p-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 ${isRefreshing ? 'animate-spin' : ''}`}
            disabled={isRefreshing}
          >
            <RefreshCwIcon className="w-5 h-5" />
          </button>
        </div>

        {loading && !cryptoDetails && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-300 text-lg">Loading cryptocurrency data...</p>
          </div>
        )}

        {error && !cryptoDetails && (
          <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
            <p className="font-bold">Error</p>
            <p>Failed to load cryptocurrency data. Please try again later.</p>
          </div>
        )}

        {cryptoDetails && (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
              <div className="flex items-start">
                <img src={cryptoDetails.image.large} alt={cryptoDetails.name} className="w-16 h-16 mr-4" />
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <h1 className="text-2xl font-bold dark:text-white">{cryptoDetails.name}</h1>
                      <span className="ml-2 px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded-md text-gray-600 dark:text-gray-300">
                        {cryptoDetails.symbol.toUpperCase()}
                      </span>
                      <div 
                        className="ml-2 px-2 py-1 text-xs rounded font-medium"
                        style={{ 
                          backgroundColor: cryptoDetails.market_data.market_cap_rank <= 10 ? '#facf5a' : '#e6e6e6',
                          color: cryptoDetails.market_data.market_cap_rank <= 10 ? '#000' : '#333'
                        }}
                      >
                        Rank #{cryptoDetails.market_data.market_cap_rank}
                      </div>
                    </div>
                    
                    <button 
                      onClick={toggleFavorite}
                      className="focus:outline-none"
                    >
                      <StarIcon 
                        className={`h-6 w-6 ${
                          isFavorite
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-400 dark:text-gray-500'
                        }`} 
                      />
                    </button>
                  </div>
                  
                  <div className="mt-4 flex items-end">
                    <div className="text-3xl font-bold dark:text-white">
                      {formatPrice(cryptoDetails.market_data.current_price.usd)}
                    </div>
                    
                    <div className={`ml-3 flex items-center text-lg ${
                      cryptoDetails.market_data.price_change_percentage_24h >= 0 
                        ? 'text-green-500' 
                        : 'text-red-500'
                    }`}>
                      {cryptoDetails.market_data.price_change_percentage_24h >= 0 ? (
                        <TrendingUpIcon className="w-5 h-5 mr-1" />
                      ) : (
                        <TrendingDownIcon className="w-5 h-5 mr-1" />
                      )}
                      <span>{formatPercentage(cryptoDetails.market_data.price_change_percentage_24h)}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 ml-1">(24h)</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">1h</div>
                  <div className={`font-medium ${
                    cryptoDetails.market_data.price_change_percentage_1h_in_currency.usd >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {formatPercentage(cryptoDetails.market_data.price_change_percentage_1h_in_currency.usd)}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">24h</div>
                  <div className={`font-medium ${
                    cryptoDetails.market_data.price_change_percentage_24h >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {formatPercentage(cryptoDetails.market_data.price_change_percentage_24h)}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">7d</div>
                  <div className={`font-medium ${
                    cryptoDetails.market_data.price_change_percentage_7d >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {formatPercentage(cryptoDetails.market_data.price_change_percentage_7d)}
                  </div>
                </div>
                
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="text-sm text-gray-500 dark:text-gray-400">30d</div>
                  <div className={`font-medium ${
                    cryptoDetails.market_data.price_change_percentage_30d >= 0 
                      ? 'text-green-500' 
                      : 'text-red-500'
                  }`}>
                    {formatPercentage(cryptoDetails.market_data.price_change_percentage_30d)}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
              <MetricsCard 
                title="Market Cap" 
                value={formatLargeNumber(cryptoDetails.market_data.market_cap.usd)}
                changePercentage={cryptoDetails.market_data.market_cap_change_percentage_24h}
              />
              
              <MetricsCard 
                title="24h Trading Volume" 
                value={formatLargeNumber(cryptoDetails.market_data.total_volume.usd)}
              />
              
              <MetricsCard 
                title="Circulating Supply" 
                value={`${cryptoDetails.market_data.circulating_supply.toLocaleString()} ${cryptoDetails.symbol.toUpperCase()}`}
                secondaryValue={cryptoDetails.market_data.max_supply 
                  ? `${Math.round((cryptoDetails.market_data.circulating_supply / cryptoDetails.market_data.max_supply) * 100)}% of max supply`
                  : 'No max supply'
                }
              />
            </div>
            
            <MarketDataTable cryptoDetails={cryptoDetails} />
          </>
        )}
      </div>
      <Footer/>
    </>
  );
}