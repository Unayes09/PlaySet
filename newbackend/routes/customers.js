import express from 'express';
import { customersCollection } from '../services/customerService.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const perPage = 10;
    const search = (req.query.search || '').trim();

    const filter = search
      ? {
          $or: [
            { phone: { $regex: search, $options: 'i' } },
            { name: { $regex: search, $options: 'i' } },
          ],
        }
      : {};

    const customersCol = customersCollection(req);
    const totalCustomers = await customersCol.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalCustomers / perPage), 1);

    const customers = await customersCol
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();

    res.json({ totalPages, totalCustomers, customers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/by-phone/:phone', async (req, res) => {
  try {
    const phone = req.params.phone;
    const customersCol = customersCollection(req);
    const customer = await customersCol.findOne({ phone });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

