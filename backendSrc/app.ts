const express = require('express');
const swaggerUi = require('swagger-ui-express')
const swaggerDocument = require('../swagger.json')
const cors = require('cors');
const { router } = require('./routes/highlightRoutes')
const { HIGHLIGHTS_BASE_URL, SWAGGER_PATH } = require('./config/config');
const morgan = require('morgan');

let app = express();
app.use(express.json());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'))

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
app.use((request: any, result: any) => {
    result.status(404).send({ url: request.originalUrl + " not found" });
});

export default app;