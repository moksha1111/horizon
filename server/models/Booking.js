const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  destination: { type: mongoose.Schema.Types.ObjectId, ref: 'Destination', required: true },
  startDate: { type: Date, required: true },
  guests: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
  specialRequests: { type: String, default: '' },
  contactPhone: String,
  contactEmail: String,
  isPaid: { type: Boolean, default: false },
  paidAt: Date
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
