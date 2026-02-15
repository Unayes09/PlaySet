const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    imageUrls: [{ type: String }],
    videoUrls: [{ type: String }],
    description: { type: String },
    actualPrice: { type: Number, required: true },
    offerPrice: { type: Number },
    stock: { type: Number, required: true },
    category: { type: String, enum: ['Mini bricks', 'Lego', 'Puzzle'], default: 'Mini bricks' },
    isNewProduct: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
