import React, { useState, useEffect } from 'react';
import API_CONFIG from '../../config/api.js';
import './BoxFilter.css';

const BoxFilter = ({ onFilterChange }) => {
    const [boxes, setBoxes] = useState([]);
    const [selectedBox, setSelectedBox] = useState('');

    useEffect(() => {
        fetchBoxes();
    }, []);

    const fetchBoxes = async () => {
        try {
            const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.BOXES}`);
            const data = await response.json();
            setBoxes(data);
        } catch (error) {
            console.error('Error fetching boxes:', error);
        }
    };

    const handleChange = (e) => {
        const value = e.target.value;
        setSelectedBox(value);
        onFilterChange(value);
    };

    return (
        <div className="filter-input-container">
            <select
                className="filter-input"
                value={selectedBox}
                onChange={handleChange}
            >
                <option value="">All Boxes</option>
                {boxes.map(box => (
                    <option key={box.id} value={box.id}>
                        {box.name}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default BoxFilter; 