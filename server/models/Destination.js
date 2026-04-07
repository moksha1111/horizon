const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: String,
  avatar: String,
  rating: { type: Number, required: true, min: 1, max: 5 },
  title: String,
  comment: { type: String, required: true },
  images: [String]
}, { timestamps: true });

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  continent: { type: String, required: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  images: [String],
  category: { type: String, required: true, enum: ['beach', 'mountain', 'city', 'countryside', 'desert', 'island', 'forest', 'arctic'] },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  duration: { type: String, required: true },
  groupSize: { type: Number, default: 12 },
  difficulty: { type: String, enum: ['easy', 'moderate', 'challenging'], default: 'easy' },
  highlights: [String],
  includes: [String],
  excludes: [String],
  itinerary: [{
    day: Number,
    title: String,
    description: String,
    activities: [String]
  }],
  coordinates: { lat: Number, lng: Number },
  reviews: [reviewSchema],
  rating: { type: Number, default: 0 },
  numReviews: { type: Number, default: 0 },
  featured: { type: Boolean, default: false },
  maxGuests: { type: Number, default: 20 },
  availableDates: [Date],
  tags: [String]
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);
