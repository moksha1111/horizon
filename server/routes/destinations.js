const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Destination = require('../models/Destination');
const { protect, admin } = require('../middleware/auth');

// GET /api/destinations
router.get('/', asyncHandler(async (req, res) => {
  const { keyword, category, continent, minPrice, maxPrice, difficulty, sort, page = 1, limit = 12 } = req.query;

  const filter = {};

  if (keyword) {
    filter.$or = [
      { name: { $regex: keyword, $options: 'i' } },
      { country: { $regex: keyword, $options: 'i' } },
      { description: { $regex: keyword, $options: 'i' } },
      { tags: { $regex: keyword, $options: 'i' } }
    ];
  }

  if (category) filter.category = category;
  if (continent) filter.continent = continent;
  if (difficulty) filter.difficulty = difficulty;

  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = Number(minPrice);
    if (maxPrice) filter.price.$lte = Number(maxPrice);
  }

  let sortObj = { createdAt: -1 };
  if (sort === 'price_asc') sortObj = { price: 1 };
  else if (sort === 'price_desc') sortObj = { price: -1 };
  else if (sort === 'rating') sortObj = { rating: -1 };
  else if (sort === 'name') sortObj = { name: 1 };

  const count = await Destination.countDocuments(filter);
  const destinations = await Destination.find(filter)
    .sort(sortObj)
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  res.json({
    destinations,
    page: Number(page),
    pages: Math.ceil(count / Number(limit)),
    total: count
  });
}));

// GET /api/destinations/featured
router.get('/featured', asyncHandler(async (req, res) => {
  const destinations = await Destination.find({ featured: true }).limit(6);
  res.json(destinations);
}));

// GET /api/destinations/categories
router.get('/categories', asyncHandler(async (req, res) => {
  const categories = await Destination.aggregate([
    { $group: { _id: '$category', count: { $sum: 1 } } },
    { $sort: { count: -1 } }
  ]);
  res.json(categories.map(c => ({ category: c._id, count: c.count })));
}));

// GET /api/destinations/:id
router.get('/:id', asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id)
    .populate('reviews.user', 'name avatar');

  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }

  res.json(destination);
}));

// POST /api/destinations — admin
router.post('/', protect, admin, asyncHandler(async (req, res) => {
  const destination = await Destination.create(req.body);
  res.status(201).json(destination);
}));

// PUT /api/destinations/:id — admin
router.put('/:id', protect, admin, asyncHandler(async (req, res) => {
  const destination = await Destination.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }

  res.json(destination);
}));

// DELETE /api/destinations/:id — admin
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }

  await destination.deleteOne();
  res.json({ message: 'Destination removed' });
}));

// POST /api/destinations/:id/reviews — protected
router.post('/:id/reviews', protect, asyncHandler(async (req, res) => {
  const { rating, title, comment, images } = req.body;
  const destination = await Destination.findById(req.params.id);

  if (!destination) {
    res.status(404);
    throw new Error('Destination not found');
  }

  const alreadyReviewed = destination.reviews.find(
    r => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this destination');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    avatar: req.user.avatar,
    rating: Number(rating),
    title,
    comment,
    images: images || []
  };

  destination.reviews.push(review);
  destination.numReviews = destination.reviews.length;
  destination.rating = destination.reviews.reduce((acc, r) => acc + r.rating, 0) / destination.reviews.length;

  await destination.save();
  res.status(201).json({ message: 'Review added' });
}));

module.exports = router;
