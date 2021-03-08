import express from 'express';
import { config } from './backendSrc/config/config'
import cors from 'cors'
import * as BodyParser from 'body-parser';
import mongoose from 'mongoose';
import { entityRouter } from './backendSrc/routes/entityRoutes';
import { highlightRouter } from './backendSrc/routes/highlightRoutes';

export let app = express();
app.use(express.json());
app.use(cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));

mongoose.connect(config.mongoAtlasConnectionString, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(entityRouter);
app.use(highlightRouter);

app.use((request, result) => {
    result.status(400).send({ url: request.originalUrl + " not found" });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => { });
