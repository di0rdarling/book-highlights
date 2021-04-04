import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/config';

export class MongoDbConnection {
    connection = null;
    constructor() {
        try {
            this.connection = mongoose.createConnection(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
            this.connection.once('open', () => {
                console.log('Successfully connected to Database.')
            })
        } catch (err) {
            console.log({
                message: 'Unable to connect to database',
                error: err
            })
        }
    }
}