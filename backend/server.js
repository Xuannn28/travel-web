
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/user.routes.js';
import fs from 'fs';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// Define allowed frontend origins
const allowedOrigins = [
  'https://travel-web-frontend-eosin.vercel.app', // Production frontend URL
  'https://travel-web-frontend-lmpt8hq4a-xuannn28s-projects.vercel.app', // Preview frontend URL
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('CORS not allowed for this origin'));
    }
  },
  credentials: true,
}));

// parse req of content-type - application/json
app.use(express.json());

// parse req of content type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// mongoDB connection
mongoose.connect( process.env.MONGO_URL || 'mongodb://127.0.0.1:27017/auth_db')
        .then(() => console.log('connected to MongoDB'))
        .catch(err => console.log('Mongodb connection error:', err))

// Serve React static files (add checking before serving .existSync())
if (fs.existsSync(path.resolve(__dirname, '../frontend/dist'))) {
  app.use(express.static(path.resolve(__dirname, '../frontend/dist')));
}

// Serve Leaflet marker images from node_modules
app.use(
    '/leaflet/images',
    express.static(
      path.resolve(path.join(__dirname, '../node_modules/leaflet/dist/images'))
    )
  );

// routes
app.use('/api/auth', authRouter);

app.use('/api', userRouter);

app.get('*', (req, res) => {
  res.redirect('https://travel-web-frontend-eosin.vercel.app' + req.originalUrl);
})

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

// start server
app.listen(PORT, () => {
    console.log('Server running on port', PORT);
})

