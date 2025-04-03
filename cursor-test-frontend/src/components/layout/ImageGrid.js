import React, { useReducer, useEffect, useRef, useCallback } from 'react';
import './ImageGrid.css';
import CardItem from '../card/CardItem';
import SearchBar from '../search/SearchBar';
import API_CONFIG from '../../config/api.js';

// Define action types
const ACTIONS = {
    SET_LOADING: 'SET_LOADING',
    SET_IMAGES: 'SET_IMAGES',
    UPDATE_PAGE: 'UPDATE_PAGE',
    SET_SEARCH: 'SET_SEARCH',
    UPDATE_METADATA: 'UPDATE_METADATA',
    RESET_STATE: 'RESET_STATE'
};

// Initial state
const initialState = {
    images: [],
    loading: true,
    page: 1,
    hasMore: true,
    searchBox: '',
    totalImages: 0
};

// Reducer function
const reducer = (state, action) => {
    switch (action.type) {
        case ACTIONS.SET_LOADING:
            return { ...state, loading: action.payload };
        case ACTIONS.SET_IMAGES:
            return { 
                ...state, 
                images: action.payload.page === 1 
                    ? action.payload.images 
                    : [...state.images, ...action.payload.images] 
            };
        case ACTIONS.UPDATE_PAGE:
            return { ...state, page: action.payload };
        case ACTIONS.SET_SEARCH:
            return { ...state, searchBox: action.payload };
        case ACTIONS.UPDATE_METADATA:
            return { 
                ...state, 
                hasMore: action.payload.hasNextPage,
                totalImages: action.payload.totalCount
            };
        case ACTIONS.RESET_STATE:
            return { 
                ...state, 
                page: 1, 
                loading: true 
            };
        default:
            return state;
    }
};

const ImageGrid = () => {
    const [state, dispatch] = useReducer(reducer, initialState);
    const observer = useRef();
    const imagesPerPage = 9;

    // Fetch images for the current page
    const fetchImages = async (pageNumber) => {
        try {
            const boxFilter = state.searchBox ? `&BoxFilter=${state.searchBox}` : '';
            const response = await fetch(
                `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.IMAGES}?PageNumber=${pageNumber}&PageSize=${imagesPerPage}${boxFilter}`
            );
            const data = await response.json();
            
            dispatch({ type: ACTIONS.SET_IMAGES, payload: { images: data.data, page: pageNumber } });
            dispatch({ type: ACTIONS.UPDATE_METADATA, payload: { 
                hasNextPage: data.hasNextPage, 
                totalCount: data.totalCount 
            }});
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
            
            console.log(`Loaded page ${pageNumber}, ${data.data.length} images (Total: ${data.totalCount})`);
        } catch (error) {
            console.error('Error fetching images:', error);
            dispatch({ type: ACTIONS.SET_LOADING, payload: false });
        }
    };

    // Initial load
    useEffect(() => {
        dispatch({ type: ACTIONS.RESET_STATE });
        fetchImages(1);
    }, [state.searchBox]);

    // This function connects to the last image in our list
    const lastImageElementRef = useCallback(node => {
        if (state.loading) return;
        
        if (observer.current) observer.current.disconnect();
        
        observer.current = new IntersectionObserver(entries => {
            if (entries[0].isIntersecting && state.hasMore) {
                const nextPage = state.page + 1;
                dispatch({ type: ACTIONS.UPDATE_PAGE, payload: nextPage });
                fetchImages(nextPage);
            }
        }, { threshold: 0.5 });
        
        if (node) observer.current.observe(node);
    }, [state.loading, state.hasMore, state.page]);

    const handleSearch = (boxNumber) => {
        dispatch({ type: ACTIONS.SET_SEARCH, payload: boxNumber });
    };

    if (state.loading && state.images.length === 0) {
        return <div className="loading">Loading...</div>;
    }

    return (
        <div className="grid-container">
            <SearchBar onSearch={handleSearch} />
            <div className="image-grid">
                {state.images.map((image, index) => {
                    const isLastElement = state.images.length === index + 1;
                    return (
                        <CardItem
                            key={image.id}
                            item={image}
                            forwardedRef={isLastElement ? lastImageElementRef : null}
                        />
                    );
                })}
                {state.loading && <div className="loading-more">Loading more...</div>}
            </div>
            {state.images.length === 0 && !state.loading && (
                <div className="no-results">No images found</div>
            )}
        </div>
    );
};

export default ImageGrid; 