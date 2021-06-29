import * as swaggerDocument from '../swagger.json';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import morgan from 'morgan';
import session from 'express-session';
import passport from 'passport';
import User from './models/schemas/usersSchema';
import { router as highlightRouter } from './routes/highlightRoutes';
import { router as userRoutes } from './routes/usersRoutes';
import { HIGHLIGHTS_BASE_URL, MONGODB_URI, SWAGGER_PATH, USERS_BASE_URL } from './config/config';
import MongoStore from 'connect-mongo';

let app = express();
app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('combined'));

//Express session configuration.
app.use(passport.initialize());
app.use(session({
  secret: 'todo', //TODO - can be anything.
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongoUrl: MONGODB_URI })
}));
app.use(passport.session());

passport.use(User.createStrategy());

/**
 * Highlight routes.
 */
app.use(HIGHLIGHTS_BASE_URL, highlightRouter);

/**
 * User routes.
 */
app.use(USERS_BASE_URL, userRoutes);

/**
 * User routes.
 */
app.use('/auth', userRoutes);

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