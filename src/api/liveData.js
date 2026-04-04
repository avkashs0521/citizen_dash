export async function fetchWeather() {
  try {
    const res = await fetch('https://api.open-meteo.com/v1/forecast?latitude=18.52&longitude=73.86&current_weather=true');
    const data = await res.json();
    return data.current_weather; // returns { temperature, windspeed, weathercode, etc. }
  } catch (error) {
    console.error("Error fetching weather:", error);
    return null;
  }
}

export async function fetchCurrency() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await res.json();
    // API provides base USD. To get INR to USD/EUR/GBP, we convert based on INR.
    // data.rates has INR, USD, EUR, GBP relative to 1 USD.
    // So 1 INR = (1 / data.rates.INR) * data.rates.TARGET
    const inrRate = data.rates.INR;
    return {
      USD: (1 / inrRate * data.rates.USD).toFixed(4),
      EUR: (1 / inrRate * data.rates.EUR).toFixed(4),
      GBP: (1 / inrRate * data.rates.GBP).toFixed(4)
    };
  } catch (error) {
    console.error("Error fetching currency:", error);
    return null;
  }
}

export async function fetchCitizen() {
  try {
    const res = await fetch('https://randomuser.me/api/');
    const data = await res.json();
    const user = data.results[0];
    return {
      name: `${user.name.first} ${user.name.last}`,
      photo: user.picture.large,
      email: user.email,
      city: user.location.city
    };
  } catch (error) {
    console.error("Error fetching citizen:", error);
    return null;
  }
}

export async function fetchFact() {
  try {
    const res = await fetch('https://uselessfacts.jsph.pl/api/v2/facts/random?language=en');
    const data = await res.json();
    return {
      text: data.text
    };
  } catch (error) {
    console.error("Error fetching fact:", error);
    return null;
  }
}
