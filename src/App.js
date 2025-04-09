import React, { useState, useEffect } from 'react';
import Search from './components/search/search';
import { fetchWeatherData } from './api';
import './App.css';
import CurrentWeather from './components/current-weather/current-weather';
import RecentSearches from './components/recent-searches/recent-searches';

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [recentSearches, setRecentSearches] = useState(() => {
    const storedSearches = localStorage.getItem('recentSearches');
    return storedSearches ? JSON.parse(storedSearches) : [];
  });
  const [searchInputValue, setSearchInputValue] = useState('');

  useEffect(() => {
    localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
  }, [recentSearches]);

  const handleOnSearchChange = async (searchData) => {
    const { latitude, longitude, name } = searchData;
    setSearchInputValue('');

    try {
      const currentWeatherResponse = await fetchWeatherData(latitude, longitude);
      setCurrentWeather(currentWeatherResponse);
      if (!recentSearches.some(search => search.name === name)) {
        setRecentSearches(prevSearches => [searchData, ...prevSearches.slice(0, 4)]);
      }
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setCurrentWeather(null);
      // Optionally display an error message to the user
    }
  };

  const handleRecentSearchClick = async (recentSearch) => {
    try {
      const currentWeatherResponse = await fetchWeatherData(recentSearch.latitude, recentSearch.longitude);
      setCurrentWeather(currentWeatherResponse);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setCurrentWeather(null);
      // Optionally display an error message
    }
  };

  const clearSearchHistory = () => {
    setRecentSearches([]);
  };

  return (
    <div className="container">
      <h1 className="dashboard-title">Weather Dashboard</h1>
      <div className="search-container">
        <Search onSearchChange={handleOnSearchChange} inputValue={searchInputValue} setInputValue={setSearchInputValue} />
      </div>
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {!currentWeather && <p className="search-instruction">Search for a city to see the weather.</p>}
      {recentSearches.length > 0 && (
        <RecentSearches
          searches={recentSearches}
          onSearchClick={handleRecentSearchClick}
          onClear={clearSearchHistory}
        />
      )}
    </div>
  );
}

export default App;