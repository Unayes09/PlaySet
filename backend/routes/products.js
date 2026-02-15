const express = require('express');
const Product = require('../models/Product');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { page: pageParam, category, q, isNew, isNewProduct, isFeatured } = req.query;
    const query = {};
    if (category) query.category = category;
    if (q) {
      const rx = new RegExp(q, 'i');
      query.$or = [{ name: rx }, { description: rx }];
    }
    const newParam = isNewProduct ?? isNew;
    if (newParam != null) {
      const flag = String(newParam) === 'true';
      if (flag) {
        query.$and = [...(query.$and || []), { $or: [{ isNewProduct: true }, { isNew: true }] }];
      } else {
        query.$and = [
          ...(query.$and || []),
          {
            $and: [
              { $or: [{ isNewProduct: { $exists: false } }, { isNewProduct: false }] },
              { $or: [{ isNew: { $exists: false } }, { isNew: false }] },
            ],
          },
        ];
      }
    }
    if (isFeatured != null) query.isFeatured = String(isFeatured) === 'true';
    if (pageParam) {
      const page = Math.max(parseInt(pageParam, 10) || 1, 1);
      const perPage = 10;
      const totalProducts = await Product.countDocuments(query);
      const totalPages = Math.max(Math.ceil(totalProducts / perPage), 1);
      const products = await Product.find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage);
      return res.json({ totalPages, totalProducts, products });
    }
    const products = await Product.find(query).sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', requireAuth, async (req, res) => {
  try {
    const {
      name,
      imageUrls = [],
      videoUrls = [],
      description,
      actualPrice,
      offerPrice,
      stock,
      category,
      isNew = false,
      isNewProduct = false,
      isFeatured = false,
    } = req.body;

    if (!name || actualPrice == null || stock == null) {
      return res.status(400).json({ error: 'name, actualPrice, stock are required' });
    }

    const product = await Product.create({
      name,
      imageUrls,
      videoUrls,
      description,
      actualPrice,
      offerPrice,
      stock,
      category,
      isNewProduct: !!isNewProduct || !!isNew,
      isFeatured,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, req.body, { new: true });
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByIdAndDelete(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
