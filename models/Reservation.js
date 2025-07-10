const mongoose = require('mongoose');

const passengerSchema = new mongoose.Schema({
  type: { type: String, required: true },
  title: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
});

const segmentSchema = new mongoose.Schema({
  departure: {
    iataCode: String,
    date: String,
    time: String,
  },
  arrival: {
    iataCode: String,
    date: String,
    time: String,
  },
  duration: String,
  carrierCode: String,
  flightNumber: String,
  aircraftCode: String,
  airline: {
    name: String,
    logo: String,
  },
});

const flightDetailsSchema = new mongoose.Schema({
  departureFlight: {
    duration: { type: String, required: true },
    segments: {
      type: [segmentSchema],
      validate: [
        (val) => val.length > 0,
        'At least one departure flight segment is required.',
      ],
    },
  },
  returnFlight: {
    duration: { type: String },
    segments: [segmentSchema],
  },
});

const reservationSchema = new mongoose.Schema(
  {
    sessionId: { type: String },
    pnr: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    from: { type: String, required: true },
    to: { type: String, required: true },
    departureDate: { type: String, required: true },
    returnDate: { type: String },
    passengers: {
      type: [passengerSchema],
      validate: [
        (val) => val.length > 0,
        'At least one passenger is required.',
      ],
    },
    email: { type: String },
    phoneNumber: {
      code: { type: String },
      digits: { type: String },
    },
    quantity: {
      adults: { type: Number },
      children: { type: Number },
      infants: { type: Number },
    },
    ticketValidity: { type: String },
    ticketAvailability: {
      immediate: { type: Boolean },
      receiptDate: { type: String },
    },
    paymentStatus: { type: String },
    amountPaid: {
      currency: { type: String },
      amount: { type: Number },
    },
    flightDetails: {
      type: flightDetailsSchema,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Reservation', reservationSchema);
