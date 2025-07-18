require('dotenv').config({ path: `.env.${process.env.NODE_ENV}`, quiet: true });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');
const reservationRoutes = require('./routes/reservation.routes');
const flightRoutes = require('./routes/flight.routes');
const airportRoutes = require('./routes/airport.routes');
const globalErrorHandler = require('./controllers/error.controller');
const AppError = require('./utils/appError');
const PORT = process.env.PORT || 3001;

const app = express();

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message);
  });

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.MDT_FRONTEND,
      process.env.MDT_BACKEND,
      process.env.DT365_FRONTEND,
      process.env.DT365_BACKEND,
      process.env.VIEWTRIP_FRONTEND,
    ];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new AppError('Not allowed by CORS', 403));
    }
  },
  methods: 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
  allowedHeaders: [
    'Origin',
    'X-Session-ID',
    'X-Requested-With',
    'Content-Type',
    'Accept',
    'Authorization',
  ],
  exposedHeaders: ['Cross-Origin-Resource-Policy'],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json());

app.use(
  '/uploads',
  express.static(path.join(__dirname, 'public/uploads'), {
    setHeaders: (res, path) => {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  })
);

app.use(
  '/qr-codes',
  express.static(path.join(__dirname, 'public/qr-codes'), {
    setHeaders: (res, path) => {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  })
);

app.use(
  '/reservations',
  express.static(path.join(__dirname, 'public/reservations'), {
    setHeaders: (res, path) => {
      res.set('Cross-Origin-Resource-Policy', 'cross-origin');
    },
  })
);

app.use('/api/reservations', reservationRoutes);
app.use('/api/flights', flightRoutes);
app.use('/api/airports', airportRoutes);

app.all('/*\w', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});

app.use(globalErrorHandler);

app.listen(PORT, () =>
  console.log(`Server running on port ${PORT} (${process.env.NODE_ENV})`)
);

module.exports = app;
