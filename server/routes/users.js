const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { protect, admin } = require('../middleware/auth');

// GET /api/users/profile
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password').populate('savedDestinations');
  res.json(user);
}));

// PUT /api/users/profile
router.put('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
  user.location = req.body.location !== undefined ? req.body.location : user.location;
  user.avatar = req.body.avatar !== undefined ? req.body.avatar : user.avatar;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updatedUser = await user.save();

  res.json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    avatar: updatedUser.avatar,
    bio: updatedUser.bio,
    location: updatedUser.location,
    joinedTrips: updatedUser.joinedTrips
  });
}));

// POST /api/users/wishlist/:destinationId
router.post('/wishlist/:destinationId', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const destId = req.params.destinationId;

  const index = user.savedDestinations.indexOf(destId);
  if (index > -1) {
    user.savedDestinations.splice(index, 1);
    await user.save();
    res.json({ message: 'Destination removed from wishlist', saved: false });
  } else {
    user.savedDestinations.push(destId);
    await user.save();
    res.json({ message: 'Destination added to wishlist', saved: true });
  }
}));

// GET /api/users/wishlist
router.get('/wishlist', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('savedDestinations');
  res.json(user.savedDestinations);
}));

// GET /api/users — admin only
router.get('/', protect, admin, asyncHandler(async (req, res) => {
  const users = await User.find({}).select('-password');
  res.json(users);
}));

// PUT /api/users/:id/role — admin only, toggle role
router.put('/:id/role', protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error('User not found'); }
  if (user._id.toString() === req.user._id.toString()) {
    res.status(400); throw new Error('Cannot change your own role');
  }
  user.role = user.role === 'admin' ? 'user' : 'admin';
  await user.save();
  res.json({ _id: user._id, role: user.role });
}));

// DELETE /api/users/:id — admin only
router.delete('/:id', protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  await user.deleteOne();
  res.json({ message: 'User removed' });
}));

module.exports = router;
