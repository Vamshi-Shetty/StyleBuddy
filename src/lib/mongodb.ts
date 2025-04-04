import mongoose from 'mongoose'
import 'dotenv/config';

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    console.error("Error: MONGODB_URI environment variable is not defined.");
    throw new Error (" please define mongo environment variable")
}

async function connectToDatabase() {
    if (mongoose.connection.readyState === 1) {
        return mongoose;
    }
    const opts = {
        bufferCommands: false,
    }
    await mongoose.connect(MONGODB_URI!, opts);
    return mongoose;
}

export default connectToDatabase;