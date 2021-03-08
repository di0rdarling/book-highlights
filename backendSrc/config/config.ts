interface Config {
    env: string,
    port: string,
    database: string,
    collection: string,
    mongoAtlasConnectionString: string
}

export const config: Config = {
    env: process.env.NODE_ENV,
    port: process.env.PORT,
    database: process.env.DATABASE,
    collection: process.env.COLLECTION,
    mongoAtlasConnectionString: `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_USER_PASSWORD}@databases.j2me1.mongodb.net/${process.env.DATABASE}?retryWrites=true&w=majority&useNewUrlParser=true&useUnifiedTopology=true`,
};

console.log(config);