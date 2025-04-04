// pages/index.js - Main Dashboard Page
import { useState, useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import WeatherSection from '../components/dashboard/WeatherSection';
import CryptoSection from '../components/dashboard/CryptoSection';
import NewsSection from '../components/dashboard/NewsSection';
import React, { useMemo } from 'react';
export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>Dashboard | CryptoWeather</title>
        <meta name="description" content="Dashboard showing weather, cryptocurrency, and news" />
      </Head>
      
      <header className="bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold">CryptoWeather Dashboard</h1>
          <p className="mt-2 opacity-90">Your all-in-one information center</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Weather Section */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              Weather Updates
            </h2>
            <WeatherSection />
          </section>
          
          {/* Cryptocurrency Section */}
          <section className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Cryptocurrency Prices
            </h2>
            <CryptoSection />
          </section>
          
          {/* News Section - Full Width */}
          <section className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-2xl font-semibold mb-4 text-gray-800 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
              </svg>
              Crypto News
            </h2>
            <NewsSection />
          </section>
        </div>
      </main>
      
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <h3 className="text-xl font-bold">CryptoWeather</h3>
              <p className="text-gray-400 mt-1">© {new Date().getFullYear()} All Rights Reserved</p>
            </div>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-blue-400 transition">About</a>
              <a href="#" className="hover:text-blue-400 transition">Privacy</a>
              <a href="#" className="hover:text-blue-400 transition">Contact</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}