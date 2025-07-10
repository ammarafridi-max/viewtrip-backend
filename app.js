require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const reservationRoutes = require('./routes/reservation.routes');
const flightRoutes = require('./routes/flight.routes');
const airportRoutes = require('./routes/airport.routes');
const globalErrorHandler = require('./controllers/error.controller');
const AppError = require('./utils/appError');

const app = express();

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

const corsOptions = {
  origin: function (origin, callback) {
    const allowedOrigins = [
      process.env.MDT_URL,
      process.env.DT365_URL,
      process.env.VIEWTRIP_URL,
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

module.exports = app;
