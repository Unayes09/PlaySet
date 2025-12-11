const express = require('express');
const Customer = require('../models/Customer');
const { requireAuth } = require('../middleware/auth');

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

    const totalCustomers = await Customer.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(totalCustomers / perPage), 1);

    const customers = await Customer.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json({ totalPages, totalCustomers, customers });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/by-phone/:phone', async (req, res) => {
  try {
    const phone = req.params.phone;
    const customer = await Customer.findOne({ phone });
    if (!customer) return res.status(404).json({ error: 'Customer not found' });
    res.json(customer);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
