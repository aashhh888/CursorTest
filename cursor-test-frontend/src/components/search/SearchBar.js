import React, { useState } from 'react';
import BoxFilter from './BoxFilter';
import './SearchBar.css';

const SearchBar = ({ onSearch }) => {
    const [filterCount, setFilterCount] = useState(0);

    const handleBoxFilter = (value) => {
        setFilterCount(value ? 1 : 0);
        onSearch(value);
    };

    return (
        <div className="search-container">
            <span className="filter-count">Search ({filterCount})</span>
            <BoxFilter onFilterChange={handleBoxFilter} />
        </div>
    );
};

export default SearchBar; 