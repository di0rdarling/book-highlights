import express from 'express';
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../swagger.json'
import cors from 'cors';
import { router } from './routes/highlightRoutes'
import { HIGHLIGHTS_BASE_URL, SWAGGER_PATH } from './config/config';

export let app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/**
 * Highlight routes.
 */
app.use(HIGHLIGHTS_BASE_URL, router);

/**
 * Swagger route.
 */
app.use(SWAGGER_PATH, swaggerUi.serve, swaggerUi.setup(swaggerDocument));

/**
 * 404 Route.
 */
app.use((request, result) => {
    result.status(404).send({ url: request.originalUrl + " not found" });
});