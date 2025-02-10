
import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import authRouter from './routes/auth.routes.js';
import path from 'path';
import { fileURLToPath } from 'url';
import userRouter from './routes/user.routes.js';

const app = express();
const PORT = 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// middleware
app.use(cors());

// parse req of content-type - application/json
app.use(express.json());

// parse req of content type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

// mongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/auth_db')
        .then(() => console.log('connected to MongoDB'))
        .catch(err => console.log('Mongodb connection error:', err))

// Serve React static files
app.use(express.static(path.resolve(__dirname, '../dist')));

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
    res.sendFile(path.join(__dirname, '../dist', 'index.html'));
})

// start server
app.listen(PORT, () => {
    console.log('Server running on port', PORT);
})

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});