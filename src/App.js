import React, { useState } from 'react';
import './App.css';
import Search from './components/search/search';
import { WEATHER_API_URL, WEATHER_API_KEY, ICON_URL } from './api';

function App() {
  const [weather, setWeather] = useState(null);

  const handleOnSearchChange = async (searchData) => {
    try {
      const response = await fetch(
        `${WEATHER_API_URL}/weather?lat=${searchData.latitude}&lon=${searchData.longitude}&appid=${WEATHER_API_KEY}&units=metric`
      );
      const data = await response.json();
      setWeather(data);
    } catch (error) {
      console.error('Error fetching weather:', error);
      setWeather(null); // Reset weather state on error
    }
  };

  return (
    <div className="container">
      <Search onSearchChange={handleOnSearchChange} />
      {weather && (
        <div style={{ marginTop: '20px', border: '1px solid #ccc', padding: '15px' }}>
          <h2>{weather.name}</h2>
          <p>Temperature: {Math.round(weather.main.temp)}°C</p>
          <p>Weather: {weather.weather[0].description}</p>
          <p>Humidity: {weather.main.humidity}%</p>
          <p>Wind Speed: {weather.wind.speed} km/h</p>
          <img src={`${ICON_URL}/${weather.weather[0].icon}.png`} alt="Weather Icon" />
        </div>
      )}
      {!weather && <p>No weather data available. Please search for a city.</p>}
    </div>
  );
}

export default App;