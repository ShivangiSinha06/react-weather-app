import React, { useState, useEffect } from 'react';
import './App.css';
import Search from './components/search/search';
import Forecast from './components/Forecast';
import { WEATHER_API_URL, WEATHER_API_KEY, ICON_URL } from './api';

function App() {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [recentSearches, setRecentSearches] = useState(() => {
        const storedSearches = localStorage.getItem('recentSearches');
        return storedSearches ? JSON.parse(storedSearches).slice(0, 5) : [];
    });
    const [selectedCity, setSelectedCity] = useState(null);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        localStorage.setItem('recentSearches', JSON.stringify(recentSearches));
        document.body.className = theme;
    }, [recentSearches, theme]);

    const handleOnSearchChange = async (searchData) => {
        setSelectedCity(searchData);
        setLoading(true);
        setError(null);
        setWeather(null);
        try {
            const response = await fetch(
                `${WEATHER_API_URL}/weather?lat=${searchData.latitude}&lon=${searchData.longitude}&appid=${WEATHER_API_KEY}&units=metric`
            );
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            const data = await response.json();
            setWeather(data);
            setRecentSearches(prevSearches => {
                const newSearch = { name: data.name, value: searchData };
                const exists = prevSearches.some(search => search.name === newSearch.name);
                return exists ? prevSearches : [newSearch, ...prevSearches.slice(0, 4)];
            });
        } catch (err) {
            console.error('Error fetching weather:', err);
            setError('Failed to fetch weather data.');
        } finally {
            setLoading(false);
        }
    };

    const handleRecentSearchClick = (search) => {
        handleOnSearchChange(search.value);
    };

    const handleRefresh = () => {
        if (selectedCity) {
            handleOnSearchChange(selectedCity);
        }
    };

    const toggleTheme = () => {
        setTheme(prevTheme => (prevTheme === 'light' ? 'dark' : 'light'));
    };

    return (
        <div className={`container ${theme}`}>
            <h1>Weather Dashboard</h1>
            <button onClick={toggleTheme}>Toggle Theme</button>
            <Search onSearchChange={handleOnSearchChange} />
            <button onClick={handleRefresh} disabled={!selectedCity}>Refresh Weather</button>

            {loading && <p>Loading weather data...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {weather && (
                <div className="weather-info">
                    <h2>{weather.name}</h2>
                    <img src={`${ICON_URL}/${weather.weather[0].icon}.png`} alt="Weather Icon" />
                    <p>Temperature: <strong>{Math.round(weather.main.temp)}°C</strong></p>
                    <p>Weather: {weather.weather[0].description}</p>
                    <p>Humidity: {weather.main.humidity}%</p>
                    <p>Wind Speed: {weather.wind.speed} km/h</p>
                </div>
            )}

            {!weather && !loading && !error && <p>Search for a city to see the weather.</p>}

            {recentSearches.length > 0 && (
                <div className="recent-searches">
                    <h3>Recent Searches:</h3>
                    <ul>
                        {recentSearches.map(search => (
                            <li key={search.name} onClick={() => handleRecentSearchClick(search)}>{search.name}</li>
                        ))}
                    </ul>
                </div>
            )}

            {selectedCity && <Forecast city={selectedCity} />}
        </div>
    );
}

export default App;