import NodeCache from "node-cache";
import {
    READWISE_CACHE_HIGHLIGHTS_KEY,
    READWISE_CACHE_BOOKS_KEY,
    TTL
} from "../config/config";
import logger from '../logging/logger';
let cache = new NodeCache();

/**
 * Retrieves the cached readwise highlights.
 * @returns any cached highlights.
 */
export function getCachedHighlights() {
    return cache.get(READWISE_CACHE_HIGHLIGHTS_KEY);
}

/**
 * Caches the given highlights.
 */
export function cacheHighlights(highlights: any[]) {
    const success = cache.mset([
        { key: "readwiseHighlights", val: highlights, ttl: TTL as number },
    ])
    if (!success) {
        logger.error('Unable to cache readwise highlights.')
    } else {
        logger.info('Cache successfully updated with readwise highlights.')
    }
}

/**
 * Retrieves the cached readwise books.
 * @returns any cached books.
 */
export function getCachedBooks() {
    return cache.get(READWISE_CACHE_BOOKS_KEY);
}

/**
 * Caches the given books.
 */
export function cacheBooks(books: any[]) {
    const success = cache.mset([
        { key: "readwiseBooks", val: books, ttl: TTL as number },
    ])
    if (!success) {
        logger.error('Unable to cache readwise books.')
    } else {
        logger.info('Cache successfully updated with readwise books.')
    }
}
