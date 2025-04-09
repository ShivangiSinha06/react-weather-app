import React from 'react';
import './recent-searches.css';

const RecentSearches = ({ searches, onSearchClick, onClear }) => {
  if (!searches || searches.length === 0) {
    return null;
  }

  return (
    <div className="recent-searches-container">
      <h3>Recent Searches</h3>
      <ul className="recent-searches-list">
        {searches.map((search) => (
          <li key={`${search.latitude}-${search.longitude}-${search.name}`} onClick={() => onSearchClick(search)}>
            {search.name}
          </li>
        ))}
      </ul>
      <button className="clear-history-button" onClick={onClear}>Clear History</button>
    </div>
  );
};

export default RecentSearches;