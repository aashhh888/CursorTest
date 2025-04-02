import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ImageGrid.css';
import CardItem from '../card/CardItem';
import SearchBar from '../search/SearchBar';
import API_CONFIG from '../../config/api.js';

const ImageGrid = () => {
    // Main state variables 
    const [images, setImages] = useState([]); // Stores all loaded images
    const [loading, setLoading] = useState(true); // Tracks if we're loading images
    const [page, setPage] = useState(1); // Current page number
    const [hasMore, setHasMore] = useState(true); // If there are more images to load
    const [searchBox, setSearchBox] = useState('');
    const [totalImages, setTotalImages] = useState(0);
    const observer = useRef();
    const imagesPerPage = 9;

    // Fetch images for the current page
    const fetchImages = async (pageNumber) => {
        try {
            const boxFilter = searchBox ? `&BoxFilter=${searchBox}` : '';
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.IMAGES}?PageNumber=${pageNumber}&PageSize=${imagesPerPage}${boxFilter}`
            );
            const data = await response.json();
            
            // If it's the first page, replace images, otherwise append
            setImages(prevImages => pageNumber === 1 ? data.data : [...prevImages, ...data.data]);
            setHasMore(data.hasNextPage);
            setTotalImages(data.totalCount);
            setLoading(false);
            
            console.log(`Loaded page ${pageNumber}, ${data.data.length} images (Total: ${data.totalCount})`);
        } catch (error) {
            console.error('Error fetching images:', error);
            setLoading(false);
        }
    };

    // Initial load
    useEffect(() => {
        setLoading(true);
        setPage(1);
        fetchImages(1);
    }, [searchBox]);

    // This function connects to the last image in our list
    const lastImageElementRef = useCallback(node => {
        if (loading) return;
        
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && hasMore) {
                const nextPage = page + 1;
                setPage(nextPage);
                fetchImages(nextPage);
            }
        }, { threshold: 0.5 });
        
        if (node) observer.current.observe(node);
    }, [loading, hasMore, page]);

    const handleSearch = (boxNumber) => {
        setSearchBox(boxNumber);
    };

    if (loading && images.length === 0) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="grid-container">
            <SearchBar onSearch={handleSearch} />
            <div className="image-grid">
                {images.map((image, index) => {
                    const isLastElement = images.length === index + 1;
                    return (
                        <CardItem
                            key={image.id}
                            item={image}
                            forwardedRef={isLastElement ? lastImageElementRef : null}
                        />
                    );
                })}
                {loading && <div className="loading-more">Loading more...</div>}
            </div>
            {images.length === 0 && !loading && (
                <div className="no-results">No images found</div>
            )}
        </div>
    );
};

export default ImageGrid; 