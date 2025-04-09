import React, { useState, useEffect } from 'react';
import { WEATHER_API_URL, WEATHER_API_KEY, ICON_URL } from '../../api';

const Forecast = ({ city }) => {
    const [forecastData, setForecastData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchForecast = async () => {
            if (!city) return;
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(
                    `${WEATHER_API_URL}/forecast?lat=${city.value.latitude}&lon=${city.value.longitude}&appid=${WEATHER_API_KEY}&units=metric`
                );
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                const dailyForecast = data.list.filter((item, index) => index % 8 === 0);
                setForecastData(dailyForecast);
            } catch (err) {
                console.error('Error fetching forecast:', err);
                setError('Failed to fetch 5-day forecast.');
            } finally {
                setLoading(false);
            }
        };

        fetchForecast();
    }, [city]);

    if (loading) return <p>Loading forecast...</p>;
    if (error) return <p style={{ color: 'red' }}>{error}</p>;
    if (!forecastData) return null;

    return (
        <div style={{ marginTop: '20px', border: '1px solid #eee', padding: '15px', borderRadius: '8px', backgroundColor: '#f8f8f8' }}>
            <h3>5-Day Forecast</h3>
            <div style={{ display: 'flex', overflowX: 'auto' }}>
                {forecastData.map(item => (
                    <div key={item.dt} style={{ margin: '0 10px', padding: '10px', border: '1px solid #ddd', borderRadius: '6px', textAlign: 'center', flexShrink: 0 }}>
                        <p>{new Date(item.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })}</p>
                        <img src={`${ICON_URL}/${item.weather[0].icon}.png`} alt="Forecast Icon" style={{ width: '50px', height: '50px' }} />
                        <p>Temp: {Math.round(item.main.temp)}°C</p>
                        <p>{item.weather[0].description}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Forecast;