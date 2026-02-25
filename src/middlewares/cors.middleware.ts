import cors, { CorsOptions } from 'cors';

const whitelist = [
    'http://localhost:3001',
    'https://thorneandmayreruiters.vercel.app',
];

const corsOptions: CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || whitelist.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true
};

export default cors(corsOptions);
