import 'dotenv/config'

const DEFAULT_API_PORT: number = 8080;
export const API_PORT = process.env.API_PORT || DEFAULT_API_PORT;
const DEFAULT_DATABASE: string = 'highlights';
export const DATABASE = process.env.DATABASE || DEFAULT_DATABASE;
const DEFAULT_MONGODB_URI: string = `mongodb://localhost:27017/${DATABASE}`
export const MONGODB_URI = process.env.MONGODB_URI || DEFAULT_MONGODB_URI;
const DEFAULT_HIGHLIGHTS_BASE_URL: string = '/highlights'
export const HIGHLIGHTS_BASE_URL = process.env.HIGHLIGHTS_BASE_URL || DEFAULT_HIGHLIGHTS_BASE_URL;
const DEFAULT_SWAGGER_PATH: string = '/api-docs'
export const SWAGGER_PATH = process.env.SWAGGER_PATH || DEFAULT_SWAGGER_PATH;

