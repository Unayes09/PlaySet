import express from 'express';
import { ObjectId } from 'mongodb';
import { productsCollection } from '../services/productService.js';
import { requireAuth } from '../middleware/auth.js';

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

    const productsCol = productsCollection(req);

    if (pageParam) {
      const page = Math.max(parseInt(pageParam, 10) || 1, 1);
      const perPage = 10;
      const totalProducts = await productsCol.countDocuments(query);
      const totalPages = Math.max(Math.ceil(totalProducts / perPage), 1);
      const products = await productsCol
        .find(query)
        .sort({ createdAt: -1 })
        .skip((page - 1) * perPage)
        .limit(perPage)
        .toArray();
      return res.json({ totalPages, totalProducts, products });
    }
    const products = await productsCol.find(query).sort({ createdAt: -1 }).toArray();
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

    const productsCol = productsCollection(req);

    const doc = {
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
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await productsCol.insertOne(doc);
    const product = await productsCol.findOne({ _id: result.insertedId });
    res.status(201).json(product);
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
      return res.status(400).json({ error: 'Invalid product id' });
    }

    const productsCol = productsCollection(req);
    const update = { ...req.body, updatedAt: new Date() };
    const result = await productsCol.findOneAndUpdate(
      { _id: objectId },
      { $set: update },
      { returnDocument: 'after' },
    );

    if (!result.value) return res.status(404).json({ error: 'Product not found' });
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
      return res.status(400).json({ error: 'Invalid product id' });
    }
    const productsCol = productsCollection(req);
    const result = await productsCol.deleteOne({ _id: objectId });
    if (!result.deletedCount) return res.status(404).json({ error: 'Product not found' });
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;

