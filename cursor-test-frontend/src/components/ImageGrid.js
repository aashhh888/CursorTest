import React, { useState, useEffect, useRef, useCallback } from 'react';
import './ImageGrid.css';

const ImageGrid = () => {
    // Main state variables 
    const [images, setImages] = useState([]); // Stores all images from the API
    const [displayedImages, setDisplayedImages] = useState([]); // Stores only the images we're showing on screen
    const [loading, setLoading] = useState(true); // Tracks if we're loading images for the first time
    const [page, setPage] = useState(1); // Keeps track of how many "pages" of images we've loaded
    const [hasMore, setHasMore] = useState(true); // Tells us if there are more images to load
    const observer = useRef(); // Special tool to watch when user scrolls to bottom
    const imagesPerPage = 9; // How many images to load at once

    // Run once when component first loads
    useEffect(() => {
        fetchImages(); // Get all images from the API
    }, []);

    // Run whenever images array or page number changes
    useEffect(() => {
        if (images.length > 0) {
            // Calculate how many images to show based on current page
            const endIndex = page * imagesPerPage;
            // Take only that portion from our full images array
            setDisplayedImages(images.slice(0, endIndex));
            // Check if we've reached the end of all images
            setHasMore(endIndex < images.length);
            
            // Log when images are actually displayed
            console.log(`Displaying ${Math.min(endIndex, images.length)} of ${images.length} images (${imagesPerPage} per page)`);
        }
    }, [images, page, imagesPerPage]);

    // This function connects to the last image in our list
    // It watches when that image becomes visible as user scrolls
    const lastImageElementRef = useCallback(node => {
        // Don't do anything if we're in the middle of loading
        if (loading) return;
        
        // Clear any previous watchers
        if (observer.current) observer.current.disconnect();
        
        // Create a new watcher (observer)
        observer.current = new IntersectionObserver(entries => {
            // When the last image becomes visible on screen...
            if (entries[0].isIntersecting && hasMore) {
                // Log when new page is being loaded
                console.log(`Loading next set of images - Page ${page + 1}`);
                // Load the next page of images
                setPage(prevPage => prevPage + 1);
            }
        }, { threshold: 0.5 }); // Trigger when image is 50% visible
        
        // Start watching the last image element
        if (node) observer.current.observe(node);
    }, [loading, hasMore, page]);

    // Function to get all images from the API
    const fetchImages = async () => {
        try {
            const response = await fetch('http://localhost:5139/api/images');
            const data = await response.json();
            console.log(`Loaded ${data.length} total images from API`);
            setImages(data); // Store all images in state
        } catch (error) {
            console.error('Error fetching images:', error);
        } finally {
            setLoading(false); // Mark loading as complete
        }
    };

    // Show loading message while fetching initial data
    if (loading) {
        return <div className="loading">Loading...</div>;
    }

    // The main component that renders our image grid
    return (
        <div className="image-grid">
            {displayedImages.map((image, index) => {
                // Check if this is the last image being displayed
                const isLastElement = displayedImages.length === index + 1;
                return (
                    <div 
                        key={image.id} 
                        className="image-item"
                        data-number={`No. ${String(image.id).padStart(3, '0')}`}
                        // Only add the watcher to the last image in our list
                        ref={isLastElement ? lastImageElementRef : null}
                    >
                        <img src={image.imageUrl} alt={image.title} />
                        <h3>{image.title}</h3>
                    </div>
                );
            })}
            {/* Show loading indicator when getting more images */}
            {loading && <div className="loading-more">Loading more...</div>}
        </div>
    );
};

export default ImageGrid; 