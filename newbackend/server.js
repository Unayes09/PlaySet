import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { httpServerHandler } from 'cloudflare:node';
import { getDb } from './db.js';
import adminRoutes from './routes/admin.js';
import productsRoutes from './routes/products.js';
import customersRoutes from './routes/customers.js';
import ordersRoutes from './routes/orders.js';
import uploadsRoutes from './routes/uploads.js';
import swaggerSpec from './swagger.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

app.use(async (req, res, next) => {
  try {
    req.db = await getDb();
    next();
  } catch (err) {
    next(err);
  }
});

app.use('/api/admin', adminRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/customers', customersRoutes);
app.use('/api/orders', ordersRoutes);
app.use('/api/uploads', uploadsRoutes);

app.get('/api/docs.json', (req, res) => res.json(swaggerSpec));

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

export default httpServerHandler(app);

