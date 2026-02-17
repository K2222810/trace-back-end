const dotenv = require('dotenv');
dotenv.config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
const logger = require('morgan');

const authRouter = require('./controllers/auth');
const testJwtRouter = require('./controllers/test-jwt');
const applicationRouter = require('./controllers/applications.js');
const followUpsRouter = require('./controllers/followUps.js');
const checkInRouter = require('./controllers/checkIns.js');

mongoose.connect(process.env.MONGODB_URI);

mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`);
});

app.use(cors());
app.use(express.json());
app.use(logger('dev'));

// Routes go here
app.use('/auth', authRouter);
app.use('/test-jwt', testJwtRouter);
app.use('/applications', applicationRouter);
app.use('/applications/:appId/follow-ups', followUpsRouter);
app.use('/applications/:appId/check-ins', checkInRouter);


const PORT = process.env.PORT ? process.env.PORT : 3000;

// Start the server and listen on port 3000
console.log("About to listen on", process.env.PORT);
app.listen(PORT, () => {
  console.log(`The express app is ready!, ${PORT}`);
});
