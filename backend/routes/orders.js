const express = require('express');
const Order = require('../models/Order');
const Customer = require('../models/Customer');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const perPage = 10;

    const totalOrders = await Order.countDocuments();
    const totalPages = Math.max(Math.ceil(totalOrders / perPage), 1);

    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage);

    res.json({ totalPages, totalOrders, orders });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const {
      customer,
      date,
      productIds = [],
      productNames = [],
      quantities = [],
      priceTotal,
      status,
    } = req.body;

    if (!customer || priceTotal == null) {
      return res.status(400).json({ error: 'customer and priceTotal are required' });
    }
    if (!customer.phone) {
      return res.status(400).json({ error: 'customer.phone is required' });
    }

    let customerDoc = await Customer.findOne({ phone: customer.phone });
    if (customerDoc) {
      const update = {};
      if (customer.name && customer.name !== customerDoc.name) update.name = customer.name;
      if (customer.address && customer.address !== customerDoc.address) update.address = customer.address;
      if (customer.additionalInfo !== undefined && customer.additionalInfo !== customerDoc.additionalInfo)
        update.additionalInfo = customer.additionalInfo;
      if (customer.email !== undefined && customer.email !== customerDoc.email) update.email = customer.email;
      if (Object.keys(update).length) {
        customerDoc = await Customer.findByIdAndUpdate(customerDoc._id, update, { new: true });
      }
    } else {
      if (!customer.name || !customer.address) {
        return res.status(400).json({ error: 'name and address are required to create customer' });
      }
      customerDoc = await Customer.create({
        phone: customer.phone,
        name: customer.name,
        address: customer.address,
        additionalInfo: customer.additionalInfo,
        email: customer.email,
      });
    }

    const customerSnapshot = {
      phone: customerDoc.phone,
      name: customerDoc.name,
      address: customerDoc.address,
      additionalInfo: customerDoc.additionalInfo,
      email: customerDoc.email,
    };

    const order = await Order.create({
      customer: customerSnapshot,
      date,
      productIds,
      productNames,
      quantities,
      priceTotal,
      status,
    });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByIdAndDelete(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
