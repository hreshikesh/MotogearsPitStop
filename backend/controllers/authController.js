//controllers/authController.js

import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import User from '../models/User.js';
import generateToken, { cookieOptions } from '../utils/generateToken.js';
import sendEmail from '../utils/sendEmail.js';

const PRODUCTION_FRONTEND_URL = 'https://motogearspitstop.com';

const normalizePhone = (phone) => {
  const digits = String(phone || '').replace(/\D/g, '');
  if (digits.length > 10) return digits.slice(-10);
  return digits;
};

const normalizeUrl = url => url?.trim().replace(/\/$/, '');

const getFrontendUrl = (req) => {
  const requestOrigin = normalizeUrl(req.get('origin'));
  const configuredUrl = normalizeUrl(process.env.FRONTEND_URL);

  if (requestOrigin && !requestOrigin.includes('motogearspitstop.onrender.com')) {
    return requestOrigin;
  }

  if (configuredUrl && !configuredUrl.includes('motogearspitstop.onrender.com')) {
    return configuredUrl;
  }

  return PRODUCTION_FRONTEND_URL;
};

// @POST /api/auth/register
export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const phoneDigits = normalizePhone(phone);

  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!name || !password || !phone) {
    res.status(400);
    throw new Error('Please fill all required fields');
  }

  if (phoneDigits.length < 10) {
    res.status(400);
    throw new Error('Please enter a valid phone number');
  }

  if (password.length < 6 || !/[a-z]/.test(password)) {
    res.status(400);
    throw new Error('Password must be at least 6 characters and include one lowercase letter');
  }

  const phoneExists = await User.findOne({ phone: phoneDigits });
  if (phoneExists) {
    res.status(400);
    throw new Error('Phone number already registered');
  }

  if (normalizedEmail) {
    const emailExists = await User.findOne({ email: normalizedEmail });
    if (emailExists) {
      res.status(400);
      throw new Error('Email already registered');
    }
  }

  const user = await User.create({
    name,
    password,
    phone: phoneDigits,
    ...(normalizedEmail ? { email: normalizedEmail } : {})
  });
  const token = generateToken(res, user._id);

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar
    },
    token
  });
});

// @POST /api/auth/login
export const login = asyncHandler(async (req, res) => {
  const { name, phone, password } = req.body;
  const phoneDigits = normalizePhone(phone);

  if (!name?.trim() || !phoneDigits || !password) {
    res.status(400);
    throw new Error('Please enter your name, phone number, and password');
  }

  if (phoneDigits.length < 10) {
    res.status(400);
    throw new Error('Please enter a valid phone number');
  }

  const user = await User.findOne({ phone: phoneDigits });
  const nameMatches =
    user &&
    user.name.trim().toLowerCase() === String(name).trim().toLowerCase();

  if (!user || !nameMatches || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid name, phone number, or password');
  }

  const token = generateToken(res, user._id);

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar
    },
    token
  });
});

// @POST /api/auth/logout
export const logout = asyncHandler(async (req, res) => {
  res.cookie('token', '', {
    ...cookieOptions,
    expires: new Date(0)
  });
  res.json({ success: true, message: 'Logged out successfully' });
});

// @GET /api/auth/me
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.json({ success: true, user });
});

// @POST /api/auth/forgot-password
export const forgotPassword = asyncHandler(async (req, res) => {
  const email = String(req.body.email || '').trim().toLowerCase();

  if (!email) {
    res.status(400);
    throw new Error('Please enter your email');
  }

  const user = await User.findOne({ email });
  if (!user) {
    res.status(404);
    throw new Error('No account with that email');
  }

  const resetToken = crypto.randomBytes(32).toString('hex');
  user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
  await user.save();
const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  try {
    await sendEmail({
      to: user.email,
      subject: 'MotoGear Pitstop - Password Reset',
      html: `
        <h2>Password Reset Request</h2>
        <p>Click the link below to reset your password. Valid for 15 minutes.</p>
        <a href="${resetUrl}" style="background:#e11d48;color:#fff;padding:10px 20px;border-radius:5px;text-decoration:none;">Reset Password</a>
        <p>If you didn't request this, ignore this email.</p>
      `
    });
  } catch (error) {
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    console.error('Forgot password email failed:', error.message);
    res.status(503);
    throw new Error('Unable to send reset email right now. Please try again in a few minutes.');
  }

  res.json({ success: true, message: 'Reset email sent' });
});

// @PUT /api/auth/reset-password/:token
export const resetPassword = asyncHandler(async (req, res) => {
  const hashedToken = crypto.createHash('sha256').update(req.params.token).digest('hex');
  const { password } = req.body;

  if (!password || password.length < 6 || !/[a-z]/.test(password)) {
    res.status(400);
    throw new Error('Password must be at least 6 characters and include one lowercase letter');
  }

  const user = await User.findOne({
    resetPasswordToken: hashedToken,
    resetPasswordExpire: { $gt: Date.now() }
  });

  if (!user) {
    res.status(400);
    throw new Error('Invalid or expired reset token');
  }

  user.password = password;
  user.resetPasswordToken = undefined;
  user.resetPasswordExpire = undefined;
  await user.save();

  const token = generateToken(res, user._id);
  res.json({ success: true, message: 'Password reset successful', token });
});
