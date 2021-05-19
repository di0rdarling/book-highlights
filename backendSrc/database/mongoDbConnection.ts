import mongoose, { Connection } from 'mongoose';
import { MONGODB_URI } from '../config/config';
import logger from '../logging/logger';

class MongoDbConnection {
    connection: any;
    constructor() {
        this.startConnection();
    }

    async startConnection() {
        try {
            this.connection = await mongoose.createConnection(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
            if (this.connection.readyState === 0) {
                logger.error('server.database.disconnected')
            } else if (this.connection.readyState === 1) {
                logger.info('server.database.connected')
            }
        } catch (err) {
            console.log({
                message: 'Unable to connect to database',
                error: err
            })
        }

    }

    useConnection() {
        return this.connection;
    }
}

export default MongoDbConnection;