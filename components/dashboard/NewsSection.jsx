// components/dashboard/NewsSection.jsx
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCryptoNews } from '../../store/slices/newsSlice';
import { ExternalLink } from 'lucide-react';
import React from 'react';
import Button from '../common/Button';
export default function NewsSection() {
  const dispatch = useDispatch();
  const { articles, loading, error, lastFetched, nextPage } = useSelector((state) => state.news);

  useEffect(() => {
    // Fetch news on component mount - pass null instead of a page number
    dispatch(fetchCryptoNews({ limit: 5, nextPageToken: null }));

    // Refresh news every 5 minutes
    const intervalId = setInterval(() => {
      dispatch(fetchCryptoNews({ limit: 5, nextPageToken: null }));
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, [dispatch]);

  // Handler for loading more articles
  const loadMoreArticles = () => {
    if (nextPage) {
      dispatch(fetchCryptoNews({ limit: 5, nextPageToken: nextPage }));
    }
  };

  // Format publication date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, { 
      month: 'short', 
      day: 'numeric',
      year: 'numeric' 
    });
  };

  return (
    <div className="news-section bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold dark:text-white">Crypto News</h2>
        {lastFetched && (
          <span className="text-xs text-gray-500 dark:text-gray-400">
            Updated {new Date(lastFetched).toLocaleTimeString()}
          </span>
        )}
      </div>

      {loading && articles.length === 0 && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent"></div>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Loading news...</p>
        </div>
      )}

      {error && articles.length === 0 && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-4 rounded">
          <p>Failed to load news. Please try again later.</p>
        </div>
      )}

      <div className="space-y-4">
        {articles.map((article, index) => (
          <div 
            key={article.article_id || index} 
            className="news-card border-b border-gray-200 dark:border-gray-700 last:border-b-0 pb-4 last:pb-0"
          >
            <a 
              href={article.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="group"
            >
              <h3 className="font-medium text-gray-900 dark:text-white group-hover:text-blue-500 transition-colors">
                {article.title}
              </h3>
              
              <div className="flex items-center justify-between mt-2">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  {article.source_id ? (
                    <span className="capitalize">{article.source_id.replace(/-/g, ' ')}</span>
                  ) : (
                    <span>{article.source}</span>
                  )}
                  {article.pubDate && (
                    <span> · {formatDate(article.pubDate)}</span>
                  )}
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
              </div>
              
              {article.description && (
                <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">
                  {article.description}
                </p>
              )}
            </a>
          </div>
        ))}
      </div>

      {articles.length > 0 && nextPage && (
        <div className="mt-4 text-center">
          <Button
  title={loading ? 'Loading...' : 'Load More'}
  variant="primary"
  size="medium"
  onClick={loadMoreArticles}
  isLoading={loading}
  isDisabled={loading}
/>
        </div>
      )}

      {articles.length === 0 && !loading && !error && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          No news articles available.
        </div>
      )}
    </div>
  );
}