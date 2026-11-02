import React from 'react';
import { Cloud, DollarSign, User, Lightbulb, RefreshCw, AlertCircle } from 'lucide-react';

export const DashboardCard = ({ title, icon, onRefresh, isRefreshing, children }) => {
  return (
    <div className="glass-card">
      <div className="card-header">
        <div className="card-title">
          {icon}
          <span>{title}</span>
        </div>
        <button 
          className="refresh-btn" 
          onClick={onRefresh}
          disabled={isRefreshing}
          title="Refresh Data"
        >
          <RefreshCw size={16} />
        </button>
      </div>
      <div className="card-content">
        {children}
      </div>
    </div>
  );
};

const ErrorDisplay = ({ message }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f87171', padding: '0.5rem 0' }}>
    <AlertCircle size={18} style={{ flexShrink: 0 }} />
    <span style={{ fontSize: '0.875rem', lineHeight: '1.4' }}>{message}</span>
  </div>
);

export const WeatherCard = ({ data, error, onRefresh, isRefreshing }) => {
  return (
    <DashboardCard title="Live Weather" icon={<Cloud size={20} color="#60a5fa" />} onRefresh={onRefresh} isRefreshing={isRefreshing}>
      {error ? (
        <ErrorDisplay message={error} />
      ) : !data ? (
        <div className="loading-skeleton"></div>
      ) : (
        <>
          <div className="data-label">Temperature</div>
          <div className="data-value primary">{data.temperature}°C</div>
          <div className="data-label">Wind Speed</div>
          <div className="data-value" style={{ fontSize: '1.25rem' }}>{data.windspeed} km/h</div>
        </>
      )}
    </DashboardCard>
  );
};

export const CurrencyCard = ({ data, error, onRefresh, isRefreshing }) => {
  return (
    <DashboardCard title="Currency Rates" icon={<DollarSign size={20} color="#34d399" />} onRefresh={onRefresh} isRefreshing={isRefreshing}>
      {error ? (
        <ErrorDisplay message={error} />
      ) : !data ? (
        <div className="loading-skeleton"></div>
      ) : (
        <>
          <div className="data-label">1 INR equals</div>
          <div className="data-value" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>$ {data.USD} <span style={{fontSize:'1rem', color:'var(--text-secondary)'}}>USD</span></div>
          <div className="data-value" style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>€ {data.EUR} <span style={{fontSize:'1rem', color:'var(--text-secondary)'}}>EUR</span></div>
          <div className="data-value" style={{ fontSize: '1.5rem' }}>£ {data.GBP} <span style={{fontSize:'1rem', color:'var(--text-secondary)'}}>GBP</span></div>
        </>
      )}
    </DashboardCard>
  );
};

export const CitizenCard = ({ data, error, onRefresh, isRefreshing }) => {
  return (
    <DashboardCard title="Citizen Profile" icon={<User size={20} color="#f472b6" />} onRefresh={onRefresh} isRefreshing={isRefreshing}>
      {error ? (
        <ErrorDisplay message={error} />
      ) : !data ? (
        <div className="loading-skeleton"></div>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <img 
            src={data.photo} 
            alt={data.name} 
            style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-color)' }}
          />
          <div>
            <div className="data-value" style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{data.name}</div>
            <div className="data-label" style={{ marginBottom: '0' }}>{data.city}</div>
            <div className="data-label" style={{ fontSize: '0.75rem', marginTop: '0.25rem' }}>{data.email}</div>
          </div>
        </div>
      )}
    </DashboardCard>
  );
};

export const FactCard = ({ data, error, onRefresh, isRefreshing }) => {
  return (
    <DashboardCard title="City Fact of the Day" icon={<Lightbulb size={20} color="#fbbf24" />} onRefresh={onRefresh} isRefreshing={isRefreshing}>
      {error ? (
        <ErrorDisplay message={error} />
      ) : !data ? (
        <div className="loading-skeleton"></div>
      ) : (
        <div className="data-value" style={{ fontSize: '1.1rem', lineHeight: '1.5', fontWeight: '400', fontStyle: 'italic' }}>
          "{data.text}"
        </div>
      )}
    </DashboardCard>
  );
};
