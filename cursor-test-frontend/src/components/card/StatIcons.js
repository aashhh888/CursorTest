import React from 'react';

export const Circle = ({ color }) => (
    <svg viewBox="0 0 24 24" className="stat">
        <circle cx="12" cy="12" r="11" fill={color} />
    </svg>
);

export const Triangle = ({ color }) => (
    <svg viewBox="0 0 24 24" className="stat">
        <path d="M12 2L2 22H22L12 2Z" fill={color} />
    </svg>
);

export const Square = ({ color }) => (
    <svg viewBox="0 0 24 24" className="stat">
        <rect x="2" y="2" width="20" height="20" fill={color} />
    </svg>
);

export const Heart = ({ color }) => (
    <svg viewBox="0 0 24 24" className="stat">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill={color} />
    </svg>
);

export const Star = ({ color }) => (
    <svg viewBox="0 0 24 24" className="stat">
        <path d="M12 2L9 9L2 9.5L7 14L5.5 21L12 17.5L18.5 21L17 14L22 9.5L15 9L12 2Z" fill={color} />
    </svg>
);

export const Diamond = ({ color }) => (
    <svg viewBox="0 0 24 24" className="stat">
        <path d="M12 2L22 12L12 22L2 12L12 2Z" fill={color} />
    </svg>
); 