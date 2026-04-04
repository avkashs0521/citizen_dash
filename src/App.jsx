import React, { useState, useEffect } from 'react';
import { WeatherCard, CurrencyCard, CitizenCard, FactCard } from './components/Cards';
import Chatbot from './components/Chatbot';
import { fetchWeather, fetchCurrency, fetchCitizen, fetchFact } from './api/liveData';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [rates, setRates] = useState(null);
  const [citizen, setCitizen] = useState(null);
  const [factData, setFactData] = useState(null);

  const [loadingStates, setLoadingStates] = useState({
    weather: false,
    currency: false,
    citizen: false,
    fact: false
  });

  const loadWeather = async () => {
    setLoadingStates(prev => ({ ...prev, weather: true }));
    const data = await fetchWeather();
    if (data) setWeatherData(data);
    setLoadingStates(prev => ({ ...prev, weather: false }));
  };

  const loadCurrency = async () => {
    setLoadingStates(prev => ({ ...prev, currency: true }));
    const data = await fetchCurrency();
    if (data) setRates(data);
    setLoadingStates(prev => ({ ...prev, currency: false }));
  };

  const loadCitizen = async () => {
    setLoadingStates(prev => ({ ...prev, citizen: true }));
    const data = await fetchCitizen();
    if (data) setCitizen(data);
    setLoadingStates(prev => ({ ...prev, citizen: false }));
  };

  const loadFact = async () => {
    setLoadingStates(prev => ({ ...prev, fact: true }));
    const data = await fetchFact();
    if (data) setFactData(data);
    setLoadingStates(prev => ({ ...prev, fact: false }));
  };

  useEffect(() => {
    // Initial Load
    loadWeather();
    loadCurrency();
    loadCitizen();
    loadFact();
  }, []);

  const dashboardData = { weatherData, rates, citizen, factData };

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <h1>Citizen Information Dashboard</h1>
        <p>Live, real-time city infrastructure and public data</p>
      </header>
      
      <main className="dashboard-grid">
        <WeatherCard 
          data={weatherData} 
          onRefresh={loadWeather} 
          isRefreshing={loadingStates.weather} 
        />
        <CurrencyCard 
          data={rates} 
          onRefresh={loadCurrency} 
          isRefreshing={loadingStates.currency} 
        />
        <CitizenCard 
          data={citizen} 
          onRefresh={loadCitizen} 
          isRefreshing={loadingStates.citizen} 
        />
        <FactCard 
          data={factData} 
          onRefresh={loadFact} 
          isRefreshing={loadingStates.fact} 
        />
      </main>

      <Chatbot dashboardData={dashboardData} />
    </div>
  );
}

export default App;
