require('dotenv').config()

import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';

const app = express();

// Load middleware
app.use(cors({ credentials: true, }));
app.use(compression());
app.use(cookieParser());
app.use(bodyParser.text());

mongoose.Promise = Promise;
mongoose.connect(process.env.MONGO_URI);
mongoose.connection.on('error', (error: Error) => console.log(error));

app.use('/', router());

// Create the server and listen
const server = http.createServer(app);
server.listen(4000, () => {
    console.log('Server running on http://localhost:4000');
});
