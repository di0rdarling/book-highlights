
import express from 'express';
import request from 'supertest';
import mongoose from 'mongoose';
import Highlight from '../models/highlight';
import { highlightRouter } from '../routes/highlightRoutes';
import { HttpResponse } from './models/httpResponse';
import { HighlightCreate } from './models/highlight';
import { Highlight as HighlightModel } from './models/highlight';

jest.setTimeout(40000)
const MONGO_TEST_URI = 'mongodb://localhost:27017/test'
const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(highlightRouter);

describe('insert', () => {
    beforeEach((done) => {
        mongoose.connect(MONGO_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true })
            .then(() => {
                mongoose.connection.db.dropDatabase();
                done();
            }).catch(err => {
                console.log(err)
            });
    })

    it('Creates a new Highlight object', async () => {
        //Setup
        let highlightCreate: HighlightCreate = {
            bookTitle: 'Test book',
            text: 'Test text',
            highlightedDate: new Date('2011-10-05T14:48:00.000Z'),
            viewed: false,
            favourited: false
        }
        let expectedHttpResponse: HttpResponse = {
            status: 201,
            text: 'Created'
        }

        //Run test
        const actualHttpResponse = await request(app)
            .post("/highlight")
            .send(highlightCreate);

        //Assert the response.
        expect(actualHttpResponse.status).toBe(expectedHttpResponse.status)
        expect(actualHttpResponse.text).toBe(expectedHttpResponse.text)

        //Assert the database.
        await mongoose.connect(MONGO_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        let highlights = await Highlight.find({});
        let mappedHighlights = highlights.map(h => mapDbHighlightToHighlightCreate(h));
        expect(mappedHighlights).toEqual([highlightCreate]);
    })

    it('Gets all Highlight objects', async () => {
        //Setup
        let existingHighlights: any[] = [{
            bookTitle: 'Test book 1',
            text: 'Test text 1',
            highlightedDate: '2011-10-05T14:48:00.000Z',
            viewed: false,
            favourited: false
        }, {
            bookTitle: 'Test book 2',
            text: 'Test textssssssss 2',
            highlightedDate: '2011-10-05T14:48:00.000Z',
            viewed: false,
            favourited: false
        }]

        let expectedHttpResponse: HttpResponse = {
            status: 200,
            text: '',
            body: existingHighlights
        }
        await mongoose.connect(MONGO_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await Highlight.insertMany(existingHighlights);

        //Run test
        const actualHttpResponse = await request(app)
            .get("/highlights");

        //Assert response.
        let mappedBody = actualHttpResponse.body.map(h => mapDbHighlightToHighlightCreate(h));
        expect(actualHttpResponse.status).toBe(expectedHttpResponse.status);
        expect(mappedBody).toEqual(expectedHttpResponse.body);
    })

    it('Edits a Highlight using the ID', async () => {
        //Setup
        let existingHighlights: HighlightModel[] = [{
            bookTitle: 'Test book 1',
            text: 'Test text 1',
            highlightedDate: new Date('2011-10-05T14:48:00.000Z'),
            viewed: false,
            favourited: false
        }, {
            bookTitle: 'Test book 2',
            text: 'Test texts 2',
            highlightedDate: new Date('2011-10-05T14:48:00.000Z'),
            viewed: false,
            favourited: false
        }]

        await mongoose.connect(MONGO_TEST_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        await Highlight.insertMany(existingHighlights);
        let highlights = await Highlight.find({});

        //Edit the highlight.
        let editedHighlight = highlights[0];
        editedHighlight.bookTitle = 'Edited Title'

        let expectedHttpResponse: HttpResponse = {
            status: 200,
            text: '',
            body: editedHighlight
        }

        //Run test
        const actualHttpResponse = await request(app)
            .put(`/highlight/${editedHighlight.id}`)
            .send(editedHighlight);

        //Assert response.
        expect(actualHttpResponse.status).toBe(expectedHttpResponse.status);
        expect(actualHttpResponse.body).toEqual(expectedHttpResponse.body);
    })
})

/**
 * Maps a database type highlight to a highlight create model.
 * @param dbHighlight database highlight.
 * @returns a highlight create model.
 */
function mapDbHighlightToHighlightCreate(dbHighlight: any): HighlightCreate {
    return {
        bookTitle: dbHighlight.bookTitle,
        text: dbHighlight.text,
        highlightedDate: dbHighlight.highlightedDate,
        viewed: dbHighlight.viewed,
        favourited: dbHighlight.favourited
    }
}