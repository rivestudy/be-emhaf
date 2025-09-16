import db from '../models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

const { User } = db;
const SALT_ROUNDS = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';
const TOKEN_EXPIRES_IN = process.env.TOKEN_EXPIRES_IN || '7d';

export const register = async (req, res) => {
  try {
    const { username, full_name, password, email } = req.body;
    if (!username || !full_name || !password) {
      return res.status(400).json({ message: 'username, full_name and password are required' });
    }

    const existing = await User.findOne({ where: { username } });
    if (existing) {
      return res.status(400).json({ message: 'Username already exists' });
    }

    const salt = await bcrypt.genSalt(SALT_ROUNDS);
    const hashed = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      full_name,
      password: hashed,
      email: email || null
    });
    const { password: _, ...userSafe } = newUser.toJSON();

    return res.status(201).json({ message: 'User registered', user: userSafe });
  } catch (err) {
    console.error('Register error', err);
    console.log('Register error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ message: 'username and password required' });

    const user = await User.findOne({ where: { username } });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(401).json({ message: 'Invalid credentials' });

    const payload = { id: user.user_id, username: user.username };
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

    return res.json({ message: 'Login success', token, user: { user_id: user.user_id, username: user.username, full_name: user.full_name, email: user.email } });
  } catch (err) {
    console.error('Login error', err);
    console.log('Login error', err);
    return res.status(500).json({ message: 'Server error', error: err.message });
  }
};
