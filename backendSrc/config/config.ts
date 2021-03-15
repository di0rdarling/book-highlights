import 'dotenv/config'

interface Config {
    env: string,
    port: string,
    database: string,
    collection: string,
    mongoUri: string
}

export const config: Config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database: process.env.DATABASE,
    collection: process.env.COLLECTION,
    mongoUri: `mongodb://localhost:27017/${process.env.NODE_ENV}`,
};

console.log(config);
