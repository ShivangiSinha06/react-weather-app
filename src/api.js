const WEATHER_API_URL = 'https://api.openweathermap.org/data/2.5';
const WEATHER_API_KEY = '07bfda33beaaef2d2da183a6c5a87321'; 
const GEO_API_URL = 'http://api.openweathermap.org/geo/1.0';
const ICON_URL = 'https://openweathermap.org/img/w/';

async function fetchWeatherData(lat, lon) {
  try {
    const response = await fetch(`${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=metric`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw error;
  }
}

export { WEATHER_API_URL, WEATHER_API_KEY, GEO_API_URL, ICON_URL, fetchWeatherData };