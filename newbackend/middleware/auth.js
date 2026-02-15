import jwt from 'jsonwebtoken';

export function requireAuth(req, res, next) {
  const auth = req.headers.authorization || '';
  const token = auth.startsWith('Bearer ') ? auth.slice(7) : null;
  if (!token) return res.status(401).json({ error: 'Unauthorized' });
  try {
    const secret = process.env.JWT_SECRET || 'dev-secret';
    const payload = jwt.verify(token, secret);
    req.adminId = payload.sub;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
}

