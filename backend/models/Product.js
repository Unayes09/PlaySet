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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', ProductSchema);
