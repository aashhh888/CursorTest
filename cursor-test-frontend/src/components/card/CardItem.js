import React from 'react';
import './CardItem.css';
import cardIcon from '../card-icon.svg';
import StatsDisplay from './StatsDisplay';

const CardItem = ({ item, forwardedRef }) => {
    const stats = {
        hp: item.hp,
        atk: item.atk,
        def: item.def,
        spAtk: item.spAtk,
        spDef: item.spDef,
        speed: item.speed
    };

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
            <StatsDisplay stats={stats} />
            <h3 className="item-title">{item.title}</h3>
        </div>
    );
};

export default CardItem; 