const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Booking = require('../models/Booking');
const Destination = require('../models/Destination');
const { protect, admin } = require('../middleware/auth');

// POST /api/bookings — protected
router.post('/', protect, asyncHandler(async (req, res) => {
  const { destination, startDate, guests, specialRequests, contactPhone, contactEmail } = req.body;

  const dest = await Destination.findById(destination);
  if (!dest) {
    res.status(404);
    throw new Error('Destination not found');
  }

  const totalPrice = dest.price * guests;

  const booking = await Booking.create({
    user: req.user._id,
    destination,
    startDate,
    guests,
    totalPrice,
    specialRequests,
    contactPhone,
    contactEmail
  });

  res.status(201).json(booking);
}));

// GET /api/bookings/mybookings — protected
router.get('/mybookings', protect, asyncHandler(async (req, res) => {
  const bookings = await Booking.find({ user: req.user._id })
    .populate('destination', 'name images country')
    .sort({ createdAt: -1 });
  res.json(bookings);
}));

// GET /api/bookings — admin
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const bookings = await Booking.find({})
    .populate('user', 'name email')
    .populate('destination', 'name country')
    .sort({ createdAt: -1 });
  res.json(bookings);
}));

// GET /api/bookings/:id — protected (owner or admin)
router.get('/:id', protect, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id).populate('destination');

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized');
  }

  res.json(booking);
}));

// PUT /api/bookings/:id/status — admin
router.put('/:id/status', protect, admin, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  booking.status = req.body.status;
  const updated = await booking.save();
  res.json(updated);
}));

// PUT /api/bookings/:id/pay — protected
router.put('/:id/pay', protect, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  booking.isPaid = true;
  booking.paidAt = Date.now();
  const updated = await booking.save();
  res.json(updated);
}));

// PUT /api/bookings/:id/cancel — protected (own booking, only if pending)
router.put('/:id/cancel', protect, asyncHandler(async (req, res) => {
  const booking = await Booking.findById(req.params.id);

  if (!booking) {
    res.status(404);
    throw new Error('Booking not found');
  }

  if (booking.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized');
  }

  if (booking.status !== 'pending') {
    res.status(400);
    throw new Error('Can only cancel pending bookings');
  }

  booking.status = 'cancelled';
  const updated = await booking.save();
  res.json(updated);
}));

module.exports = router;
