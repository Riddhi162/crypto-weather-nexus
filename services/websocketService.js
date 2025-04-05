export class CryptoWebSocketService {
    constructor(onMessageCallback) {
      this.socket = null;
      this.onMessageCallback = onMessageCallback;
      this.isConnected = false;
    }
  
    connect(cryptoIds = ['bitcoin', 'ethereum', 'solana']) {
      const url = `wss://ws.coincap.io/prices?assets=${cryptoIds.join(',')}`;
      
      this.socket = new WebSocket(url);
      
      this.socket.onopen = () => {
        console.log('WebSocket connected');
        this.isConnected = true;
      };
      
      this.socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (this.onMessageCallback) {
          this.onMessageCallback(data);
        }
      };
      
      this.socket.onerror = (error) => {
        console.error('WebSocket error:', error);
      };
      
      this.socket.onclose = () => {
        console.log('WebSocket disconnected');
        this.isConnected = false;
        
        setTimeout(() => {
          if (!this.isConnected) {
            this.connect(cryptoIds);
          }
        }, 5000);
      };
    }
  
    disconnect() {
      if (this.socket) {
        this.socket.close();
        this.socket = null;
      }
    }
  }
  
  export class WeatherAlertService {
    constructor(onAlertCallback) {
      this.onAlertCallback = onAlertCallback;
      this.interval = null;
      this.cities = [];
    }
  
    start(cities) {
      this.cities = cities;
      
      this.interval = setInterval(() => {
        if (Math.random() > 0.7 && this.cities.length > 0) {
          const randomCity = this.cities[Math.floor(Math.random() * this.cities.length)];
          const alertTypes = ['Heavy Rain', 'High Winds', 'Thunderstorm', 'Heat Wave', 'Flood Warning'];
          const alertType = alertTypes[Math.floor(Math.random() * alertTypes.length)];
          
          const alert = {
            city: randomCity,
            type: alertType,
            severity: Math.floor(Math.random() * 5) + 1,
            message: `${alertType} warning for ${randomCity}`,
            timestamp: new Date().toISOString()
          };
          
          if (this.onAlertCallback) {
            this.onAlertCallback(alert);
          }
        }
      }, 30000);
    }
  
    stop() {
      if (this.interval) {
        clearInterval(this.interval);
        this.interval = null;
      }
    }
  }