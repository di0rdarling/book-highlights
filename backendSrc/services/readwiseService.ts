import axios from "axios";
import NodeCache from "node-cache";
import {
    READWISE_LIST_HIGHLIGHTS_URL,
    READWISE_LIST_HIGHLIGHTS_PAGE_SIZE,
    READWISE_AUTH_TOKEN,
    READWISE_LIST_BOOKS_URL,
    READWISE_LIST_BOOKS_PAGE_SIZE,
    READWISE_CACHE_HIGHLIGHTS_KEY,
    READWISE_CACHE_BOOKS_KEY,
    TTL
} from "../config/config";

let cache = new NodeCache();

/**
 * Gets all readwise highlights.
 * @param allHighlights if true, will return all the users' highlights.
 * @returns a list of readwise highlights for the user.
 */
export async function getHighlights(allHighlights: boolean): Promise<any[]> {

    let readwiseHighlights;

    //Fetch data from cache.
    //If not available, query API and update cache.
    let cachedReadwiseHighlights = getCachedHighlights();
    if (cachedReadwiseHighlights === undefined) {
        console.log('No readwise highlights in cache. Querying API.')
        let readwiseGetHighlightsUrl = `${READWISE_LIST_HIGHLIGHTS_URL}?page=1&page_size=${READWISE_LIST_HIGHLIGHTS_PAGE_SIZE}`

        //Get the all the highlights on readwise.
        while (readwiseGetHighlightsUrl) {
            let response = await axios({
                method: 'GET',
                url: readwiseGetHighlightsUrl,
                headers: {
                    'Authorization': `Token ${READWISE_AUTH_TOKEN}`
                }
            });
            if (response.status === 200) {
                let results = response.data.results
                if (!readwiseHighlights) {
                    readwiseHighlights = results;
                } else {
                    readwiseHighlights = readwiseHighlights.concat(results);
                }
                if (response.data.next && allHighlights) {
                    readwiseGetHighlightsUrl = response.data.next;
                } else {
                    readwiseGetHighlightsUrl = null;
                }
            } else {
                throw new Error('Unable to get Readwise Highlights.')
            }
        }

        //Cache the fetched highlights.
        cacheHighlights(readwiseHighlights)
    } else {
        console.log('Readwise highlights sourced from cache.')
        readwiseHighlights = cachedReadwiseHighlights;
    }
    return readwiseHighlights;
}

/**
 * Gets all readwise highlights.
 * @param allBooks if true, will return all books.
 * @returns list of readwise books for the user.
 */
export async function getBooks(allBooks: boolean): Promise<any[]> {

    let readwiseBooks;

    //Fetch data from cache.
    //If not available, query API and update cache.
    let cachedReadwiseBooks = getCachedBooks();
    if (cachedReadwiseBooks === undefined) {
        console.log('No readwise books in cache. Querying API.')
        let readwiseGetBooksUrl = `${READWISE_LIST_BOOKS_URL}?page=1&page_size=${READWISE_LIST_BOOKS_PAGE_SIZE}`
        let readwiseBooks = []

        //Get all the books on readwise.
        while (readwiseGetBooksUrl) {
            let response = await axios({
                method: 'GET',
                url: readwiseGetBooksUrl,
                headers: {
                    'Authorization': `Token ${READWISE_AUTH_TOKEN}`
                }
            });
            if (response.status === 200) {
                let results = response.data.results
                readwiseBooks = readwiseBooks.concat(results);
                if (response.data.next && allBooks) {
                    readwiseGetBooksUrl = response.data.next;
                } else {
                    readwiseGetBooksUrl = null;
                }
            } else {
                throw new Error('Unable to get Readwise Books.')
            }
        }

        //Cache the fetched books.
        cacheBooks(readwiseBooks)
    } else {
        readwiseBooks = cachedReadwiseBooks;
    }

    return readwiseBooks;
}

/**
 * Retrieves the cached readwise highlights.
 * @returns any cached highlights.
 */
function getCachedHighlights() {
    return cache.get(READWISE_CACHE_HIGHLIGHTS_KEY);
}

/**
 * Caches the given highlights.
 */
function cacheHighlights(highlights: any[]) {
    const success = cache.mset([
        { key: "readwiseHighlights", val: highlights, ttl: TTL as number },
    ])
    if (!success) {
        console.log('Unable to cache readwise highlights.')
    } else {
        console.log('Cache successfully updated with readwise highlights.')
    }
}

/**
 * Retrieves the cached readwise books.
 * @returns any cached books.
 */
function getCachedBooks() {
    return cache.get(READWISE_CACHE_BOOKS_KEY);
}

/**
 * Caches the given books.
 */
function cacheBooks(books: any[]) {
    const success = cache.mset([
        { key: "readwiseBooks", val: books, ttl: TTL as number },
    ])
    if (!success) {
        console.log('Unable to cache readwise books.')
    } else {
        console.log('Cache successfully updated with readwise books.')
    }
}
