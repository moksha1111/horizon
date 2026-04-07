const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const Journal = require('../models/Journal');
const { protect } = require('../middleware/auth');

// GET /api/journals — public
router.get('/', asyncHandler(async (req, res) => {
  const { tag, page = 1, limit = 10 } = req.query;

  const filter = { published: true };
  if (tag) filter.tags = { $regex: tag, $options: 'i' };

  const count = await Journal.countDocuments(filter);
  const journals = await Journal.find(filter)
    .populate('author', 'name avatar bio')
    .sort({ createdAt: -1 })
    .skip((Number(page) - 1) * Number(limit))
    .limit(Number(limit));

  res.json({
    journals,
    page: Number(page),
    pages: Math.ceil(count / Number(limit)),
    total: count
  });
}));

// GET /api/journals/:id — public
router.get('/:id', asyncHandler(async (req, res) => {
  const journal = await Journal.findById(req.params.id)
    .populate('author', 'name avatar bio')
    .populate('comments.user', 'name avatar');

  if (!journal) {
    res.status(404);
    throw new Error('Journal not found');
  }

  res.json(journal);
}));

// POST /api/journals — protected
router.post('/', protect, asyncHandler(async (req, res) => {
  const { title, content, excerpt, coverImage, destination, tags, published } = req.body;

  const readTime = Math.ceil(content.split(' ').length / 200);

  const journal = await Journal.create({
    author: req.user._id,
    title,
    content,
    excerpt,
    coverImage,
    destination,
    tags,
    published: published !== undefined ? published : true,
    readTime
  });

  res.status(201).json(journal);
}));

// PUT /api/journals/:id — protected (own journal only)
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const journal = await Journal.findById(req.params.id);

  if (!journal) {
    res.status(404);
    throw new Error('Journal not found');
  }

  if (journal.author.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to edit this journal');
  }

  const { title, content, excerpt, coverImage, destination, tags, published } = req.body;

  journal.title = title || journal.title;
  journal.content = content || journal.content;
  journal.excerpt = excerpt !== undefined ? excerpt : journal.excerpt;
  journal.coverImage = coverImage !== undefined ? coverImage : journal.coverImage;
  journal.destination = destination !== undefined ? destination : journal.destination;
  journal.tags = tags || journal.tags;
  journal.published = published !== undefined ? published : journal.published;

  if (content) {
    journal.readTime = Math.ceil(content.split(' ').length / 200);
  }

  const updated = await journal.save();
  res.json(updated);
}));

// DELETE /api/journals/:id — protected (own or admin)
router.delete('/:id', protect, asyncHandler(async (req, res) => {
  const journal = await Journal.findById(req.params.id);

  if (!journal) {
    res.status(404);
    throw new Error('Journal not found');
  }

  if (journal.author.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Not authorized to delete this journal');
  }

  await journal.deleteOne();
  res.json({ message: 'Journal removed' });
}));

// PUT /api/journals/:id/like — protected (toggle)
router.put('/:id/like', protect, asyncHandler(async (req, res) => {
  const journal = await Journal.findById(req.params.id);

  if (!journal) {
    res.status(404);
    throw new Error('Journal not found');
  }

  const index = journal.likes.indexOf(req.user._id);
  if (index > -1) {
    journal.likes.splice(index, 1);
    await journal.save();
    res.json({ liked: false, likesCount: journal.likes.length });
  } else {
    journal.likes.push(req.user._id);
    await journal.save();
    res.json({ liked: true, likesCount: journal.likes.length });
  }
}));

// POST /api/journals/:id/comments — protected
router.post('/:id/comments', protect, asyncHandler(async (req, res) => {
  const journal = await Journal.findById(req.params.id);

  if (!journal) {
    res.status(404);
    throw new Error('Journal not found');
  }

  const comment = {
    user: req.user._id,
    name: req.user.name,
    avatar: req.user.avatar,
    text: req.body.text
  };

  journal.comments.push(comment);
  await journal.save();

  res.status(201).json(journal.comments[journal.comments.length - 1]);
}));

module.exports = router;
