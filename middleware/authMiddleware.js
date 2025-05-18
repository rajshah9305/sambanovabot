const jwt = require('jsonwebtoken');
const asyncHandler = require('express-async-handler');
const User = require('../models/User');
const { ApiError } = require('../utils/errorHandler');

// Protect routes
const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check if token exists in headers
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        throw new ApiError('User not found', 401);
      }

      next();
    } catch (error) {
      throw new ApiError('Not authorized, token failed', 401);
    }
  }

  if (!token) {
    throw new ApiError('Not authorized, no token', 401);
  }
});

module.exports = { protect };