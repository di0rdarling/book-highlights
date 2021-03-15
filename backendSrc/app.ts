import express from 'express';
import swaggerUi from 'swagger-ui-express'
import swaggerDocument from '../swagger.json'
import cors from 'cors';
import { entityRouter } from './routes/entityRoutes'
import { highlightRouter } from './routes/highlightRoutes'

export let app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(entityRouter);
app.use(highlightRouter);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use((request, result) => {
    result.status(400).send({ url: request.originalUrl + " not found" });
});