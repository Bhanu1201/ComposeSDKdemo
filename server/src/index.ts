// src/server.ts

import express, { Request, Response } from 'express';
import cors from 'cors';
import authenticationRoutes from './routes/auth';
import signupRoutes from './routes/signup';
import router from './routes/token';


const app = express();

// Configure CORS to allow requests from your React app
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // If you need to send cookies or other credentials
}));

// Parse JSON request bodies
app.use(express.json());

// Add specific headers to responses
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    next();
});

// Default route (for testing)
app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to the API. Please use the appropriate endpoints.');
});

// Use your authentication and signup routes
app.use('/api', authenticationRoutes);
app.use('/api', signupRoutes);
app.use('/api', router);

// Handle preflight requests
app.options('*', cors({
    origin: 'http://localhost:5173',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
