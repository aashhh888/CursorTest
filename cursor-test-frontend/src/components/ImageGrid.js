import React, { useState, useEffect } from 'react';
import './ImageGrid.css';

const ImageGrid = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            const response = await fetch('http://localhost:5139/api/images');
            const data = await response.json();
            setImages(data);
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="image-grid">
            {images.map((image) => (
                <div key={image.id} className="image-item">
                    <img src={image.imageUrl} alt={image.title} />
                    <h3>{image.title}</h3>
                </div>
            ))}
        </div>
    );
};

export default ImageGrid; 