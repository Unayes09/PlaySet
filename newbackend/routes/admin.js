import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { adminsCollection } from '../services/adminService.js';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'username and password are required' });

    const admins = adminsCollection(req);
    const admin = await admins.findOne({ username });
    if (!admin) return res.status(401).json({ error: 'Invalid credentials' });

    const ok = await bcrypt.compare(password, admin.passwordHash);
    if (!ok) return res.status(401).json({ error: 'Invalid credentials' });

    const secret = process.env.JWT_SECRET || 'dev-secret';
    const token = jwt.sign({ sub: admin._id.toString(), username: admin.username }, secret, { expiresIn: '7d' });
    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

