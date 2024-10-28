const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const path = require('path');
const exampleRoutes = require(path.join(__dirname, 'routes', 'exampleRoutes'));
const { errorMiddleware } = require('./middleware/errorMiddleware');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Routes
app.use('/api/example', exampleRoutes);

// Error handling middleware
app.use(errorMiddleware);

module.exports = app;
