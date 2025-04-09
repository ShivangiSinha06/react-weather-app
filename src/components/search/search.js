import React, { useState } from 'react';
import { AsyncPaginate } from 'react-select-async-paginate';
import { GEO_API_URL, WEATHER_API_KEY } from '../../api';
import './search.css';

const Search = ({ onSearchChange, inputValue, setInputValue }) => {
  const loadOptions = async (inputValue) => {
    try {
      const response = await fetch(
        `${GEO_API_URL}/direct?q=${inputValue}&limit=5&appid=${WEATHER_API_KEY}`
      );
      const data = await response.json();
      return {
        options: data.map((city) => ({
          value: { latitude: city.lat, longitude: city.lon, name: `${city.name}, ${city.country}` },
          label: `${city.name}, ${city.country}`,
        })),
      };
    } catch (error) {
      console.error('Error fetching cities:', error);
      return { options: [] };
    }
  };

  const handleOnChange = (searchData) => {
    setInputValue(searchData ? searchData.label : '');
    if (searchData) {
      onSearchChange(searchData.value);
    }
  };

  return (
    <AsyncPaginate
      placeholder="Search for city..."
      debounceTimeout={600}
      value={inputValue ? { label: inputValue } : null}
      onChange={handleOnChange}
      loadOptions={loadOptions}
      className="search-bar"
      classNamePrefix="search-bar"
    />
  );
};

export default Search;