import React from 'react';
import cardIcon from './card-icon.svg';
import './CardItem.css';

const CardItem = ({ item, forwardedRef }) => {
    return (
        <div 
            className="card-item"
            ref={forwardedRef}
        >
            <div className="card-header">
                <img src={cardIcon} alt="Icon" className="card-icon" />
                <span className="item-number">No. {String(item.id).padStart(3, '0')}</span>
                <span className="box-number">Box {item.box}</span>
            </div>
            <img src={item.imageUrl} alt={item.title} className="item-image" />
            <h3 className="item-title">{item.title}</h3>
        </div>
    );
};

export default CardItem; 