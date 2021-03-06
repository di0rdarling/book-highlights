import 'dotenv/config'

//API
const DEFAULT_API_PORT: number = 8080;
export const API_PORT = process.env.API_PORT || DEFAULT_API_PORT;
const DEFAULT_HIGHLIGHTS_BASE_URL: string = '/highlights'
export const HIGHLIGHTS_BASE_URL = process.env.HIGHLIGHTS_BASE_URL || DEFAULT_HIGHLIGHTS_BASE_URL;
const DEFAULT_USERS_BASE_URL: string = '/users'
export const USERS_BASE_URL = process.env.USERS_BASE_URL || DEFAULT_USERS_BASE_URL;
const DEFAULT_AUTH_BASE_URL: string = '/auth'
export const AUTH_BASE_URL = process.env.USERS_AUTH_BASE_URL || DEFAULT_AUTH_BASE_URL;

//Mongodb
const DEFAULT_DATABASE: string = 'highlights';
export const DATABASE = process.env.DATABASE || DEFAULT_DATABASE;
const DEFAULT_MONGODB_URI: string = `mongodb://localhost:27017/${DATABASE}`
export const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;

//Swagger
const DEFAULT_SWAGGER_PATH: string = '/api-docs'
export const SWAGGER_PATH = process.env.SWAGGER_PATH || DEFAULT_SWAGGER_PATH;

//Readwise
const DEFAULT_READWISE_AUTH_TOKEN: string = 'r6Xi5KULfsvIXqHQ43G3a70adjJITIEB5bVg1WeteTpYuqnGJA'
export const READWISE_AUTH_TOKEN = process.env.READWISE_AUTH_TOKEN || DEFAULT_READWISE_AUTH_TOKEN;
const DEFAULT_READWISE_LIST_HIGHLIGHTS_URL: string = 'https://readwise.io/api/v2/highlights/'
export const READWISE_LIST_HIGHLIGHTS_URL = process.env.READWISE_LIST_HIGHLIGHTS_URL || DEFAULT_READWISE_LIST_HIGHLIGHTS_URL;
const DEFAULT_READWISE_LIST_HIGHLIGHTS_PAGE_SIZE: number = 1000
export const READWISE_LIST_HIGHLIGHTS_PAGE_SIZE = process.env.READWISE_LIST_HIGHLIGHTS_PAGE_SIZE || DEFAULT_READWISE_LIST_HIGHLIGHTS_PAGE_SIZE;
const DEFAULT_READWISE_LIST_BOOKS_URL: string = 'https://readwise.io/api/v2/books'
export const READWISE_LIST_BOOKS_URL = process.env.READWISE_LIST_BOOKS_URL || DEFAULT_READWISE_LIST_BOOKS_URL;
const DEFAULT_READWISE_LIST_BOOKS_PAGE_SIZE: number = 1000
export const READWISE_LIST_BOOKS_PAGE_SIZE = process.env.READWISE_LIST_BOOKS_PAGE_SIZE || DEFAULT_READWISE_LIST_BOOKS_PAGE_SIZE;

//Cache
const DEFAULT_READWISE_CACHE_HIGHLIGHTS_KEY: string = 'readwiseHighlights'
export const READWISE_CACHE_HIGHLIGHTS_KEY = process.env.READWISE_CACHE_HIGHLIGHTS_KEY || DEFAULT_READWISE_CACHE_HIGHLIGHTS_KEY;
const DEFAULT_READWISE_CACHE_BOOKS_KEY: string = 'readwiseBooks'
export const READWISE_CACHE_BOOKS_KEY = process.env.READWISE_CACHE_BOOKS_KEY || DEFAULT_READWISE_CACHE_BOOKS_KEY;
const DEFAULT_TTL: number = 360000
export const TTL = process.env.TTL || DEFAULT_TTL;

//Validation
const DEFAULT_USERS_MIN_PASSWORD_LENGTH: number = 6
export const USERS_MIN_PASSWORD_LENGTH = process.env.USERS_MIN_PASSWORD_LENGTH || DEFAULT_USERS_MIN_PASSWORD_LENGTH;


