import { useState, useEffect, useCallback } from 'react';

const FAVORITES_KEY = 'favorites';
const FAVORITES_EVENT = 'favoritesChanged';
const SAVED_EVENT = 'propertyFavoriteSaved';

// Global reference to track favorites across all hook instances
let globalFavorites: number[] = [];

/**
 * Hook for managing favorite properties with localStorage persistence,
 * real-time sync across multiple components, and save notifications
 * 
 * Listen to SAVED_EVENT for animations when a property is favorited
 */
export const useFavorites = () => {
    const [favorites, setFavorites] = useState<number[]>([]);

    // Initialize favorites from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(FAVORITES_KEY);
        const parsed = stored ? JSON.parse(stored) : [];
        globalFavorites = parsed;
        setFavorites(parsed);
    }, []);

    // Listen for favorites changes from other component instances
    useEffect(() => {
        const handleFavoritesChange = (event: CustomEvent) => {
            setFavorites(event.detail);
        };

        window.addEventListener(FAVORITES_EVENT, handleFavoritesChange as EventListener);
        return () => {
            window.removeEventListener(FAVORITES_EVENT, handleFavoritesChange as EventListener);
        };
    }, []);

    const toggleFavorite = useCallback((id: number) => {
        const isFav = globalFavorites.includes(id);
        const updated = isFav
            ? globalFavorites.filter(f => f !== id)
            : [...globalFavorites, id];

        globalFavorites = updated;
        setFavorites(updated);
        localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));

        // Notify other component instances
        window.dispatchEvent(
            new CustomEvent(FAVORITES_EVENT, { detail: updated })
        );

        // Dispatch save event if adding to favorites
        if (!isFav) {
            window.dispatchEvent(
                new CustomEvent(SAVED_EVENT, { detail: { id, isSaved: true } })
            );
        }
    }, []);

    const isFavorite = useCallback((id: number) => favorites.includes(id), [favorites]);

    return {
        favorites,
        toggleFavorite,
        isFavorite,
        SAVED_EVENT,
    };
};
