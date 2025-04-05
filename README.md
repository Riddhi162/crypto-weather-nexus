# CryptoWeather Nexus

A modern, multi-page dashboard that combines weather data, cryptocurrency information, and real-time notifications via WebSocket.

## 🚀 Live Demo

https://crypto-weather-nexus-ld5nnuedk-riddhi-thakkar.vercel.app/

## 📝 Project Overview

CryptoWeather Nexus is a comprehensive dashboard application built with Next.js, React, Redux, and Tailwind CSS. The application provides real-time data on weather conditions, cryptocurrency prices, and crypto-related news headlines. It features WebSocket connections for live price updates and simulated weather alerts, creating an interactive and responsive user experience across all devices.

### Key Features

- **Multi-page architecture** with Dashboard and Detail pages
- **Real-time data updates** via WebSocket connections
- **Favorites system** for cities and cryptocurrencies
- **Responsive design** that works on all screen sizes
- **Comprehensive state management** with Redux
- **Graceful error handling** and fallback UI components

## 🛠️ Technologies Used

- **Next.js (v13+)** - React framework with file-based routing
- **React** - UI library with hooks for state and lifecycle management
- **Redux** - Global state management with Redux Thunk for async operations
- **Tailwind CSS** - Utility-first CSS framework
- **WebSocket API** - For real-time data updates
- **External APIs**:
  - OpenWeatherMap - Weather data
  - CoinCap - Cryptocurrency data and WebSocket
  - NewsData.io - Crypto news headlines

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/cryptoweather-nexus.git
cd cryptoweather-nexus
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your API keys:
```
NEXT_PUBLIC_OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
NEXT_PUBLIC_NEWSDATA_API_KEY=your_newsdata_api_key
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## 🌟 Features Explained

### Dashboard Sections

1. **Weather Section**
   - Displays current weather for New York, London, and Tokyo
   - Shows temperature, humidity, and conditions
   - Option to add/remove cities from favorites

2. **Cryptocurrency Section**
   - Shows live price, 24h change, and market cap for Bitcoin, Ethereum, and Solana
   - Real-time price updates via WebSocket
   - Option to add/remove cryptocurrencies from favorites

3. **News Section**
   - Displays top five crypto-related headlines
   - Links to original news sources

### Detail Pages

1. **City Details**
   - Extended weather forecast
   - Historical weather data presented in charts
   - Additional metrics (wind speed, pressure, visibility)

2. **Crypto Details**
   - Historical pricing data with interactive charts
   - Extended metrics (volume, supply, all-time high/low)
   - Market details and links to exchanges

### Real-Time Updates

- WebSocket connection to CoinCap for live cryptocurrency price updates
- Simulated weather alerts for demonstration purposes
- Notification system for price shifts and weather alerts

### Redux State Management

- Global store for user preferences and fetched data
- Clear loading and error states
- Persistent storage for favorites



## 📱 Responsive Design

The application is fully responsive and works on:
- Mobile devices (320px+)
- Tablets (768px+)
- Desktops (1024px+)
- Large screens (1440px+)
