import { createFetcher, HttpError, TimeoutError } from '@avkashhhh/smart-fetch';

// Preconfigured fetcher instances using @avkashhhh/smart-fetch
const weatherFetcher = createFetcher({
  baseURL: 'https://api.open-meteo.com/v1',
  timeout: 5000,
  retries: 2,
  cacheTTL: 5 * 60 * 1000, // 5 minutes cache
});

const currencyFetcher = createFetcher({
  baseURL: 'https://open.er-api.com/v6',
  timeout: 5000,
  retries: 2,
  cacheTTL: 10 * 60 * 1000, // 10 minutes cache
});

const citizenFetcher = createFetcher({
  timeout: 5000,
  retries: 2,
  cacheTTL: 60 * 1000, // 1 minute cache
});

const factFetcher = createFetcher({
  baseURL: 'https://uselessfacts.jsph.pl/api/v2',
  timeout: 5000,
  retries: 2,
  cacheTTL: 60 * 1000, // 1 minute cache
});

export { HttpError, TimeoutError };

/**
 * Returns a human-friendly error message for smart-fetch and network errors.
 *
 * @param {Error} error
 * @returns {string}
 */
export function getFriendlyErrorMessage(error) {
  if (error instanceof TimeoutError) {
    return 'Request timed out. Please check your connection and refresh.';
  }
  if (error instanceof HttpError) {
    if (error.status === 429) {
      return 'Rate limit exceeded (429). Please wait a moment and try again.';
    }
    return `Server error (${error.status}). Please try again later.`;
  }
  return error?.message || 'Failed to load live data. Please try again.';
}

export async function fetchWeather() {
  const data = await weatherFetcher.getJSON('/forecast?latitude=18.52&longitude=73.86&current_weather=true');
  return data.current_weather; // returns { temperature, windspeed, weathercode, etc. }
}

export async function fetchCurrency() {
  const data = await currencyFetcher.getJSON('/latest/USD');
  const inrRate = data.rates.INR;
  return {
    USD: (1 / inrRate * data.rates.USD).toFixed(4),
    EUR: (1 / inrRate * data.rates.EUR).toFixed(4),
    GBP: (1 / inrRate * data.rates.GBP).toFixed(4),
  };
}

export async function fetchCitizen() {
  const data = await citizenFetcher.getJSON('/api/randomuser/');
  const user = data.results[0];
  return {
    name: `${user.name.first} ${user.name.last}`,
    photo: user.picture.large,
    email: user.email,
    city: user.location.city,
  };
}

export async function fetchFact() {
  const data = await factFetcher.getJSON('/facts/random?language=en');
  return {
    text: data.text,
  };
}
