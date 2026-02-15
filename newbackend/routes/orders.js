import express from 'express';
import { ObjectId } from 'mongodb';
import { ordersCollection } from '../services/orderService.js';
import { customersCollection } from '../services/customerService.js';
import { requireAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', requireAuth, async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1);
    const perPage = 10;

    const ordersCol = ordersCollection(req);
    const totalOrders = await ordersCol.countDocuments();
    const totalPages = Math.max(Math.ceil(totalOrders / perPage), 1);

    const orders = await ordersCol
      .find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .toArray();

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

    const customersCol = customersCollection(req);

    let customerDoc = await customersCol.findOne({ phone: customer.phone });
    if (customerDoc) {
      const update = {};
      if (customer.name && customer.name !== customerDoc.name) update.name = customer.name;
      if (customer.address && customer.address !== customerDoc.address) update.address = customer.address;
      if (customer.additionalInfo !== undefined && customer.additionalInfo !== customerDoc.additionalInfo)
        update.additionalInfo = customer.additionalInfo;
      if (customer.email !== undefined && customer.email !== customerDoc.email) update.email = customer.email;
      if (Object.keys(update).length) {
        await customersCol.updateOne({ _id: customerDoc._id }, { $set: update });
        customerDoc = { ...customerDoc, ...update };
      }
    } else {
      if (!customer.name || !customer.address) {
        return res.status(400).json({ error: 'name and address are required to create customer' });
      }
      const insertCustomer = {
        phone: customer.phone,
        name: customer.name,
        address: customer.address,
        additionalInfo: customer.additionalInfo,
        email: customer.email,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const customerResult = await customersCol.insertOne(insertCustomer);
      customerDoc = { ...insertCustomer, _id: customerResult.insertedId };
    }

    const customerSnapshot = {
      phone: customerDoc.phone,
      name: customerDoc.name,
      address: customerDoc.address,
      additionalInfo: customerDoc.additionalInfo,
      email: customerDoc.email,
    };

    const ordersCol = ordersCollection(req);

    const mappedProductIds = Array.isArray(productIds)
      ? productIds.map((id) => {
          try {
            return new ObjectId(id);
          } catch {
            return id;
          }
        })
      : [];

    const orderDoc = {
      customer: customerSnapshot,
      date,
      productIds: mappedProductIds,
      productNames,
      quantities,
      priceTotal,
      status,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await ordersCol.insertOne(orderDoc);
    const order = await ordersCol.findOne({ _id: result.insertedId });
    res.status(201).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    const ordersCol = ordersCollection(req);
    const update = { ...req.body, updatedAt: new Date() };
    const result = await ordersCol.findOneAndUpdate(
      { _id: objectId },
      { $set: update },
      { returnDocument: 'after' },
    );

    if (!result.value) return res.status(404).json({ error: 'Order not found' });
    res.json(result.value);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    let objectId;
    try {
      objectId = new ObjectId(id);
    } catch {
      return res.status(400).json({ error: 'Invalid order id' });
    }

    const ordersCol = ordersCollection(req);
    const result = await ordersCol.deleteOne({ _id: objectId });
    if (!result.deletedCount) return res.status(404).json({ error: 'Order not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

