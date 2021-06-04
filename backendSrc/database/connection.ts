import mongoose from 'mongoose';
import { MONGODB_URI } from '../config/config';

/**
 * Opens Mongoose's default connection to MongoDB.
 */
class Connection {
    constructor() {
        mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    }
}

export default Connection;