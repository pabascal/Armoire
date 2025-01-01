import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { connectDB } from './config/db.js';
import itemRoutes from './routes/item.route.js';
import authRoutes from './routes/auth.route.js';
import cors from 'cors';
import passport from './middleware/passport.js';
import bodyParser from 'body-parser';
import './utility/cleanup.js';

dotenv.config();    //allows access to read stuff in .env file

const app = express();  //initializes instance of express app, central part of backend. Represents server.
const PORT = process.env.PORT || 5000;
const __dirname = path.resolve();   //sets dirname to the absolute path of this project directory

app.use(cors()); //CORS middleware, allowing all origins by default
app.use(express.json()); //allows us to accept JSON data in the req.body
app.use(bodyParser.json());
app.use(passport.initialize());
app.use('/api/items', (req, res, next) => {
  console.log('Request to /api/items:', req.method, req.path);
  next();
}, itemRoutes);
app.use('/api/auth', authRoutes);
app.use('/uploads', express.static(path.join(__dirname, 'backend','uploads')));
console.log('Static folder set to:', path.join(__dirname, 'uploads'));


if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, '/frontend/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'frontend', 'dist', 'index.html'));
  });
}

const server = app.listen(PORT, '::', () => {
  connectDB();
  console.log('Server started at http://localhost:' + PORT);
});

server.on('error', (error) => {
  console.error('Server error:', error);
});


//These are probably unnecessary but scared to delete:
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something broke!',
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});
//These are probably unnecessary but scared to delete:
app.use((req, res, next) => {
  const oldSend = res.send;
  res.send = function(data) {
    console.log(`[${new Date().toISOString()}] Response sent:`, req.path);
    return oldSend.apply(res, arguments);
  };
  next();
});




//server.js: sets up Express app server, connects to database, handles API routes, serves static files
// in production, and listens for incoming requests.
