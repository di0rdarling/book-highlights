
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import axios from 'axios';
import Highlight from '../models/schemas/highlight'
import { router } from '../routes/highlightRoutes';
import { HighlightCreate } from '../models/highlightCreate';
import { HIGHLIGHTS_BASE_URL, MONGODB_URI, READWISE_AUTH_TOKEN, READWISE_LIST_BOOKS_PAGE_SIZE, READWISE_LIST_BOOKS_URL, READWISE_LIST_HIGHLIGHTS_PAGE_SIZE, READWISE_LIST_HIGHLIGHTS_URL } from '../config/config';
import { app } from '../app';
import { Highlight as HighlightFull } from '../models/highlight';
import { highlightNotFound, missingHighlightFieldsMessage } from '../messages/errorMessage';
import { allHighlightsDeleted, highlightDeleted } from '../messages/generalMessages';
import { mapReadwiseHighlightsToHighlights } from '../mappers/readwiseMapper';

jest.setTimeout(40000)
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);

describe('Tests Highlight Routes', () => {
    beforeEach((done) => {
        mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                mongoose.connection.db.dropDatabase();
                done();
            }).catch(err => {
                throw new Error('Unable to connect to database.')
            });
    })

    it('Creates a new Highlight object', async () => {
        //Setup
        let highlightCreate: HighlightCreate = {
            bookTitle: 'Test book',
            text: 'Test text',
            favourited: false
        }

        let expectedHighlightPost = {
            _id: null,
            bookTitle: highlightCreate.bookTitle,
            text: highlightCreate.text,
            favourited: highlightCreate.favourited,
            viewed: false,
            highlightedDate: new Date()
        }

        //Run test
        const actualHttpResponse = await request(app)
            .post(HIGHLIGHTS_BASE_URL)
            .send(highlightCreate);


        //Assert
        expect(actualHttpResponse.status).toBe(201)
        //Validate the dates separately, ignoring seconds and milliseconds.
        let actualHighlightedDate = actualHttpResponse.body.highlightedDate;
        expect(isDatesEqual(actualHighlightedDate, new Date().toISOString())).toBe(true);
        delete actualHttpResponse.body.highlightedDate;
        delete expectedHighlightPost.highlightedDate;
        //Set the returned id as this was not known before the request was made.
        expectedHighlightPost._id = actualHttpResponse.body._id;
        expect(actualHttpResponse.body !== expectedHighlightPost)

        //Assert database has been correctly updated.
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        let highlights = await Highlight.find({});
        let mappedHighlights = highlights.map(h => mapHighlightSchemaHighlight(h));
        expect(mappedHighlights).toHaveLength(1)
        expectedHighlightPost.highlightedDate = new Date();
        expect(isHighlightsEqual(expectedHighlightPost, mappedHighlights[0])).toBe(true);
    })

    it('Returns 400 Bad Request when the mandatory fields are not provided when creating a highlight', async () => {
        //Setup
        let missingHighlightFields = [
            'text',
            'bookTitle',
            'favourited'
        ]

        //Run test
        const actualHttpResponse = await request(app)
            .post(HIGHLIGHTS_BASE_URL)
            .send({});

        //Assert
        expect(actualHttpResponse.status).toBe(400)
        expect(actualHttpResponse.text).toEqual(missingHighlightFieldsMessage(missingHighlightFields))
    })

    it('Gets all existing Highlights.', async () => {
        //Setup
        let existingHighlights: any[] = [{
            bookTitle: 'Test book 1',
            text: 'Test text 1',
            highlightedDate: new Date('2011-10-05T14:48:00.000Z'),
            viewed: false,
            favourited: false
        }, {
            bookTitle: 'Test book 2',
            text: 'Test text 2',
            highlightedDate: new Date('2011-10-21T14:48:00.000Z'),
            viewed: false,
            favourited: false
        }]

        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await Highlight.insertMany(existingHighlights).then((highlights, err) => {
            highlights.map((highlight, i) => {
                existingHighlights[i]._id = highlight._id;
            })
        }).catch(err => {
            throw new Error('Unable to insert highlights to database.')
        });

        //Run test
        const actualHttpResponse = await request(app)
            .get(HIGHLIGHTS_BASE_URL);

        //Assert
        expect(actualHttpResponse.status).toBe(200);
        expect(actualHttpResponse.body).toHaveLength(2);
        actualHttpResponse.body.map((highlight, i) => {
            expect(isHighlightsEqual(existingHighlights[i], highlight)).toBe(true)
        })
    })

    it('Gets the highlight with the matching Id.', async () => {
        //Setup
        let existingHighlights: any[] = [{
            bookTitle: 'Test book 1',
            text: 'Test text 1',
            highlightedDate: new Date('2011-10-05T14:48:00.000Z'),
            viewed: false,
            favourited: false
        }, {
            bookTitle: 'Test book 2',
            text: 'Test text 2',
            highlightedDate: new Date('2011-10-21T14:48:00.000Z'),
            viewed: false,
            favourited: false
        }]

        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await Highlight.insertMany(existingHighlights).then((highlights, err) => {
            highlights.map((highlight, i) => {
                existingHighlights[i]._id = highlight._id;
            })
        }).catch(err => {
            throw new Error('Unable to insert highlights to database.')
        });

        let selectedHighlight = existingHighlights[0]

        //Run test
        const actualHttpResponse = await request(app)
            .get(`${HIGHLIGHTS_BASE_URL}/${selectedHighlight._id}`);

        //Assert
        expect(actualHttpResponse.status).toBe(200);
        expect(isHighlightsEqual(selectedHighlight, actualHttpResponse.body)).toBe(true)
    })

    it('Returns 404 Not Found when a highlight with the given ID is not found.', async () => {
        //Setup

        let nonExistingHighlightId = '6069aadcee0b8050bf877b23'

        //Run test
        const actualHttpResponse = await request(app)
            .get(`${HIGHLIGHTS_BASE_URL}/${nonExistingHighlightId}`);

        //Assert
        expect(actualHttpResponse.status).toBe(404);
        expect(actualHttpResponse.text).toEqual(highlightNotFound)
    })

    it('Edits the highlight with the matching Id.', async () => {
        //Setup
        let existingHighlights: any[] = [{
            bookTitle: 'Test book 1',
            text: 'Test text 1',
            highlightedDate: new Date('2011-10-05T14:48:00.000Z'),
            viewed: false,
            favourited: false
        }, {
            bookTitle: 'Test book 2',
            text: 'Test text 2',
            highlightedDate: new Date('2011-10-21T14:48:00.000Z'),
            viewed: false,
            favourited: false
        }]

        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await Highlight.insertMany(existingHighlights).then((highlights, err) => {
            highlights.map((highlight, i) => {
                existingHighlights[i]._id = highlight._id;
            })
        }).catch(err => {
            throw new Error('Unable to insert highlights to database.')
        });

        let editedHighlight = existingHighlights[0];
        editedHighlight.viewed = true;
        editedHighlight.favourited = true;

        //Run test
        const actualHttpResponse = await request(app)
            .put(`${HIGHLIGHTS_BASE_URL}/${editedHighlight._id}`)
            .send(editedHighlight);

        //Assert
        expect(actualHttpResponse.status).toBe(200);
        expect(isHighlightsEqual(editedHighlight, actualHttpResponse.body)).toBe(true)
    })

    it('Deletes the highlight with the matching Id.', async () => {
        //Setup
        let existingHighlights: any[] = [{
            bookTitle: 'Test book 1',
            text: 'Test text 1',
            highlightedDate: new Date('2011-10-05T14:48:00.000Z'),
            viewed: false,
            favourited: false
        }, {
            bookTitle: 'Test book 2',
            text: 'Test text 2',
            highlightedDate: new Date('2011-10-21T14:48:00.000Z'),
            viewed: false,
            favourited: false
        }]

        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await Highlight.insertMany(existingHighlights).then((highlights, err) => {
            highlights.map((highlight, i) => {
                existingHighlights[i]._id = highlight._id;
            })
        }).catch(err => {
            throw new Error('Unable to insert highlights to database.')
        });

        let selectedHighlight = existingHighlights[0]

        //Run test
        const actualHttpResponse = await request(app)
            .delete(`${HIGHLIGHTS_BASE_URL}/${selectedHighlight._id}`);

        //Assert
        expect(actualHttpResponse.status).toBe(200);
        expect(actualHttpResponse.text).toBe(highlightDeleted);

        //Assert database has been correctly updated.
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        let highlights = await Highlight.find({});
        let mappedHighlights = highlights.map(h => mapHighlightSchemaHighlight(h));
        expect(mappedHighlights).toHaveLength(1)
        expect(isHighlightsEqual(existingHighlights[1], mappedHighlights[0])).toBe(true);
    })

    it('Deletes all the existing highlights.', async () => {
        //Setup
        let existingHighlights: any[] = [{
            bookTitle: 'Test book 1',
            text: 'Test text 1',
            highlightedDate: new Date('2011-10-05T14:48:00.000Z'),
            viewed: false,
            favourited: false
        }, {
            bookTitle: 'Test book 2',
            text: 'Test text 2',
            highlightedDate: new Date('2011-10-21T14:48:00.000Z'),
            viewed: false,
            favourited: false
        }]

        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await Highlight.insertMany(existingHighlights).then((highlights, err) => {
            highlights.map((highlight, i) => {
                existingHighlights[i]._id = highlight._id;
            })
        }).catch(err => {
            throw new Error('Unable to insert highlights to database.')
        });

        //Run test
        const actualHttpResponse = await request(app)
            .delete(HIGHLIGHTS_BASE_URL);

        //Assert
        expect(actualHttpResponse.status).toBe(200);
        expect(actualHttpResponse.text).toBe(allHighlightsDeleted);

        //Assert database has been correctly updated.
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        let highlights = await Highlight.find({});
        expect(highlights).toHaveLength(0)
    })

    jest.setTimeout(100000)
    it('Syncs all readwise highlights to the database.', async () => {
        //Setup
        let readwiseGetHighlightsUrl = `${READWISE_LIST_HIGHLIGHTS_URL}?page=1&page_size=${READWISE_LIST_HIGHLIGHTS_PAGE_SIZE}`
        let readwiseHighlights = []

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
                readwiseHighlights = readwiseHighlights.concat(results);
                if (response.data.next) {
                    readwiseGetHighlightsUrl = response.data.next;
                } else {
                    readwiseGetHighlightsUrl = null;
                }
            } else {
                readwiseGetHighlightsUrl = null;
            }
        }

        let readwiseGetBooksUrl = `${READWISE_LIST_BOOKS_URL}?page=1&page_size=${READWISE_LIST_BOOKS_PAGE_SIZE}`
        let readwiseBooks = []

        //Get the all the books on readwise.
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
                if (response.data.next) {
                    readwiseGetBooksUrl = response.data.next;
                } else {
                    readwiseGetBooksUrl = null;
                }
            } else {
                readwiseGetBooksUrl = null;
            }
        }

        //Map each highlight and corresponding book to a full highlight model.
        let expectedSyncedHighlights = mapReadwiseHighlightsToHighlights(readwiseHighlights, readwiseBooks);
        expectedSyncedHighlights.sort((a, b) => a.bookId - b.bookId);

        //Run test
        const actualHttpResponse = await request(app)
            .get(`${HIGHLIGHTS_BASE_URL}/sync`);

        expect(actualHttpResponse.status).toBe(200);
        expect(actualHttpResponse.body).toHaveLength(expectedSyncedHighlights.length);

        //Map the ids as this was not known before the request was made.
        actualHttpResponse.body.sort((a, b) => a.bookId - b.bookId);
        actualHttpResponse.body.map((highlight, i) => {
            expectedSyncedHighlights[i]._id = highlight._id
        })
        actualHttpResponse.body.map((actualHighlight, i) => {
            expect(isHighlightsEqual(expectedSyncedHighlights[i], actualHighlight)).toBeTruthy()
        })

        //Assert database has been correctly updated.
        await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        let highlights = await Highlight.find({});
        expect(highlights).toHaveLength(expectedSyncedHighlights.length);
        highlights.sort((a, b) => a.bookId - b.bookId);
        highlights.map((actualHighlight, i) => {
            expect(isHighlightsEqual(expectedSyncedHighlights[i], actualHighlight)).toBeTruthy()
        })
    })
})

/**
 * Validates if the given highlights are equal.
 * @param expectedHighlight expected highlight.
 * @param actualHighlight actual highlight.
 * @returns true, if the two highlights are equal.
 */
function isHighlightsEqual(expectedHighlight: HighlightFull, actualHighlight: HighlightFull) {
    let isEqual = true;
    if (actualHighlight._id.toString() !== expectedHighlight._id.toString()) {
        isEqual = false
    }
    if (actualHighlight.bookTitle !== expectedHighlight.bookTitle) {
        isEqual = false
    }
    if (actualHighlight.text !== expectedHighlight.text) {
        isEqual = false
    }
    if (actualHighlight.viewed !== expectedHighlight.viewed) {
        isEqual = false
    }
    if (actualHighlight.favourited !== expectedHighlight.favourited) {
        isEqual = false
    }
    if (isDatesEqual(actualHighlight.highlightedDate, expectedHighlight.highlightedDate) !== true) {
        isEqual = false
    }
    return isEqual;
}

/**
 * Validates if the given dates are equal, ignoring the time. 
 * @param expectedDateIsoString expected date iso string.
 * @param actualDateIsoString actual date iso string.
 */
function isDatesEqual(expectedDateIsoString, actualDateIsoString) {
    let expectedDate: Date = new Date(expectedDateIsoString);
    let actualDate: Date = new Date(actualDateIsoString);
    if (expectedDate.toLocaleDateString() === actualDate.toLocaleDateString()) {
        return true;
    } else {
        return false;
    }
}

/**
 * Maps a highlight schema to a highlight model.
 * @param highlightSchema highlight  object.
 * @returns a mapped highlight.
 */
function mapHighlightSchemaHighlight(highlightSchema: any): HighlightFull {

    let mappedHighlight: HighlightFull = {
        _id: highlightSchema._id,
        bookTitle: highlightSchema.bookTitle,
        text: highlightSchema.text,
        highlightedDate: new Date(highlightSchema.highlightedDate),
        viewed: highlightSchema.viewed,
        favourited: highlightSchema.favourited
    }

    return mappedHighlight;
}

