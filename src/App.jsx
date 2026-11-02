import React, { useState, useEffect } from 'react';
import { WeatherCard, CurrencyCard, CitizenCard, FactCard } from './components/Cards';
import Chatbot from './components/Chatbot';
import { fetchWeather, fetchCurrency, fetchCitizen, fetchFact, getFriendlyErrorMessage } from './api/liveData';

function App() {
  const [weatherData, setWeatherData] = useState(null);
  const [rates, setRates] = useState(null);
  const [citizen, setCitizen] = useState(null);
  const [factData, setFactData] = useState(null);

  const [errors, setErrors] = useState({
    weather: null,
    currency: null,
    citizen: null,
    fact: null,
  });

  const [loadingStates, setLoadingStates] = useState({
    weather: false,
    currency: false,
    citizen: false,
    fact: false,
  });

  const loadWeather = async () => {
    setLoadingStates(prev => ({ ...prev, weather: true }));
    setErrors(prev => ({ ...prev, weather: null }));
    try {
      const data = await fetchWeather();
      if (data) setWeatherData(data);
    } catch (err) {
      console.error('Failed to load weather:', err);
      setErrors(prev => ({ ...prev, weather: getFriendlyErrorMessage(err) }));
    } finally {
      setLoadingStates(prev => ({ ...prev, weather: false }));
    }
  };

  const loadCurrency = async () => {
    setLoadingStates(prev => ({ ...prev, currency: true }));
    setErrors(prev => ({ ...prev, currency: null }));
    try {
      const data = await fetchCurrency();
      if (data) setRates(data);
    } catch (err) {
      console.error('Failed to load currency:', err);
      setErrors(prev => ({ ...prev, currency: getFriendlyErrorMessage(err) }));
    } finally {
      setLoadingStates(prev => ({ ...prev, currency: false }));
    }
  };

  const loadCitizen = async () => {
    setLoadingStates(prev => ({ ...prev, citizen: true }));
    setErrors(prev => ({ ...prev, citizen: null }));
    try {
      const data = await fetchCitizen();
      if (data) setCitizen(data);
    } catch (err) {
      console.error('Failed to load citizen:', err);
      setErrors(prev => ({ ...prev, citizen: getFriendlyErrorMessage(err) }));
    } finally {
      setLoadingStates(prev => ({ ...prev, citizen: false }));
    }
  };

  const loadFact = async () => {
    setLoadingStates(prev => ({ ...prev, fact: true }));
    setErrors(prev => ({ ...prev, fact: null }));
    try {
      const data = await fetchFact();
      if (data) setFactData(data);
    } catch (err) {
      console.error('Failed to load fact:', err);
      setErrors(prev => ({ ...prev, fact: getFriendlyErrorMessage(err) }));
    } finally {
      setLoadingStates(prev => ({ ...prev, fact: false }));
    }
  };

  useEffect(() => {
    // Initial Load scheduled asynchronously to avoid synchronous effect setState warnings
    const timer = setTimeout(() => {
      loadWeather();
      loadCurrency();
      loadCitizen();
      loadFact();
    }, 0);

    return () => clearTimeout(timer);
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
          error={errors.weather}
          onRefresh={loadWeather} 
          isRefreshing={loadingStates.weather} 
        />
        <CurrencyCard 
          data={rates} 
          error={errors.currency}
          onRefresh={loadCurrency} 
          isRefreshing={loadingStates.currency} 
        />
        <CitizenCard 
          data={citizen} 
          error={errors.citizen}
          onRefresh={loadCitizen} 
          isRefreshing={loadingStates.citizen} 
        />
        <FactCard 
          data={factData} 
          error={errors.fact}
          onRefresh={loadFact} 
          isRefreshing={loadingStates.fact} 
        />
      </main>

      <Chatbot dashboardData={dashboardData} />
    </div>
  );
}

export default App;
