import React from 'react';
import PropTypes from 'prop-types';
import { Circle, Triangle, Square, Heart, Star, Diamond } from './StatIcons';
import './StatsDisplay.css';

const StatsDisplay = ({ stats }) => {
    const getStatColor = (value) => {
        if (value === 31) return '#4285f4'; // Blue
        if (value === 30) return '#ff69b4'; // Pink
        return '#808080'; // Grey
    };

    return (
        <div className="stats-container">
            <Circle color={getStatColor(stats.hp)} />
            <Triangle color={getStatColor(stats.atk)} />
            <Square color={getStatColor(stats.def)} />
            <Heart color={getStatColor(stats.spAtk)} />
            <Star color={getStatColor(stats.spDef)} />
            <Diamond color={getStatColor(stats.speed)} />
        </div>
    );
};

// The following code defines the prop types for the StatsDisplay component using PropTypes.
// It ensures that the 'stats' prop passed to the component is an object with specific properties,
// each of which must be a number. The properties include 'hp', 'atk', 'def', 'spAtk', 'spDef', 
// and 'speed'. The '.isRequired' method indicates that the 'stats' prop must be provided 
// when the component is used, helping to catch potential bugs during development.

StatsDisplay.propTypes = {
    stats: PropTypes.shape({
        hp: PropTypes.number,
        atk: PropTypes.number,
        def: PropTypes.number,
        spAtk: PropTypes.number,
        spDef: PropTypes.number,
        speed: PropTypes.number
    }).isRequired
};

export default StatsDisplay; 