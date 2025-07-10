const Reservation = require('../models/Reservation');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const generatePNR = require('../utils/generatePNR');
const createReservationPDF = require('../utils/createReservationPDF');

exports.getReservation = catchAsync(async (req, res, next) => {
  const { pnr, lastName } = req.body;

  if (!pnr || !lastName) {
    return next(new AppError('PNR and last name are required.', 400));
  }

  const ticket = await Reservation.findOne({ pnr: pnr.toUpperCase() });

  if (!ticket) {
    return next(new AppError('No reservation found for this PNR.', 404));
  }

  const leadPassenger = ticket.passengers[0];
  if (
    !leadPassenger ||
    leadPassenger.lastName.toLowerCase() !== lastName.toLowerCase()
  ) {
    return next(new AppError('Last name does not match.', 403));
  }

  // ⏳ Check Expiration
  const createdAt = new Date(ticket.createdAt);
  const validityStr = ticket.ticketValidity; // e.g., "2 Days"
  const validityMatch = validityStr.match(/(\d+)\s+Days?/i);
  const daysValid = validityMatch ? parseInt(validityMatch[1]) : null;

  if (!daysValid) {
    return next(new AppError('Invalid ticket validity format.', 400));
  }

  const expirationDate = new Date(createdAt);
  expirationDate.setDate(expirationDate.getDate() + daysValid);

  const now = new Date();
  if (now > expirationDate) {
    return next(
      new AppError(
        `This reservation has expired. It was valid for ${daysValid} days.`,
        410 // 410 Gone
      )
    );
  }

  // ✅ Everything OK
  res.status(200).json({
    status: 'success',
    data: ticket,
  });
});

exports.createReservation = catchAsync(async (req, res, next) => {
  const data = req.body;

  if (!data) return next(new AppError('Reservation data is empty.', 400));

  const pnr = generatePNR().toUpperCase();
  data.pnr = pnr;

  const reservation = await Reservation.create(data);

  await createReservationPDF(reservation);

  res.status(201).json({
    status: 'success',
    data: {
      reservation,
    },
  });
});
