import axios from "axios";
import { getCachedHighlights, cacheHighlights, getCachedBooks, cacheBooks } from "../cache/readwiseCache";
import {
    READWISE_LIST_HIGHLIGHTS_URL,
    READWISE_LIST_HIGHLIGHTS_PAGE_SIZE,
    READWISE_AUTH_TOKEN,
    READWISE_LIST_BOOKS_URL,
    READWISE_LIST_BOOKS_PAGE_SIZE
} from "../config/config";
import logger from '../logging/logger';

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
        logger.info('Querying Readwise highlights API.')
        let readwiseGetHighlightsUrl: string | undefined = `${READWISE_LIST_HIGHLIGHTS_URL}?page=1&page_size=${READWISE_LIST_HIGHLIGHTS_PAGE_SIZE}`

        //Get the all the highlights on readwise.
        while (readwiseGetHighlightsUrl) {
            let response: any = await axios({
                method: 'GET',
                url: readwiseGetHighlightsUrl,
                headers: {
                    'Authorization': `Token ${READWISE_AUTH_TOKEN}`
                }
            })

            if (response && (await response).status === 200) {
                let results = response.data.results
                if (!readwiseHighlights) {
                    readwiseHighlights = results;
                } else {
                    readwiseHighlights = readwiseHighlights.concat(results);
                }
                if (response.data.next && allHighlights) {
                    readwiseGetHighlightsUrl = response.data.next;
                } else {
                    readwiseGetHighlightsUrl = undefined;
                }
            } else {
                throw new Error('Unable to get Readwise Highlights.')
            }
        }

        if (readwiseHighlights && readwiseHighlights.length) {
            //Cache the fetched highlights.
            cacheHighlights(readwiseHighlights)
        }
    } else {
        logger.info('Readwise highlights successfully sourced from cache.')
        readwiseHighlights = cachedReadwiseHighlights;
    }
    return readwiseHighlights;
}

/**
 * Gets all readwise highlights.
 * @param allBooks if true, will return all books.
 * @returns list of readwise books for the user.
 */
export async function getBooks(allBooks: boolean): Promise<any> {

    let readwiseBooks;

    //Fetch data from cache.
    //If not available, query API and update cache.
    let cachedReadwiseBooks = getCachedBooks();
    if (cachedReadwiseBooks === undefined) {
        logger.info('Querying Readwise books API.')
        let readwiseGetBooksUrl: any = `${READWISE_LIST_BOOKS_URL}?page=1&page_size=${READWISE_LIST_BOOKS_PAGE_SIZE}`

        //Get all the books on readwise.
        while (readwiseGetBooksUrl) {
            let response = await axios({
                method: 'GET',
                url: readwiseGetBooksUrl,
                headers: {
                    'Authorization': `Token ${READWISE_AUTH_TOKEN}`
                }
            });
            if (response && (await response).status === 200) {
                let results = response.data.results
                if (!readwiseBooks) {
                    readwiseBooks = results;
                } else {
                    readwiseBooks = readwiseBooks.concat(results);
                }
                if (response.data.next && allBooks) {
                    readwiseGetBooksUrl = response.data.next;
                } else {
                    readwiseGetBooksUrl = null;
                }
            } else {
                throw new Error('Unable to get Readwise Books.')
            }
        }

        if (readwiseBooks && readwiseBooks.length) {
            //Cache the fetched books.
            cacheBooks(readwiseBooks)
        }
    } else {
        readwiseBooks = cachedReadwiseBooks;
    }

    return readwiseBooks;
}

