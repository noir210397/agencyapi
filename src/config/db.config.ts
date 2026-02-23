import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGO_URI;


/**
 * Initialize and return a MongoDB connection.
 */
export async function connectDB(): Promise<void> {
    try {
        if (!MONGO_URI) {
            throw new Error('MONGO_URI must be defined in .env');
        }
        await mongoose.connect(MONGO_URI, {
            // these options are now defaults in Mongoose 6+, but you can still override:
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected');
    } catch (err) {
        console.error('❌ MongoDB connection error:', err);
        process.exit(1); // bail out
    }
}

