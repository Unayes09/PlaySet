const mongoose = require('mongoose');

const CustomerSnapshotSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    additionalInfo: { type: String },
    email: { type: String },
  },
  { _id: false }
);

const OrderSchema = new mongoose.Schema(
  {
    customer: { type: CustomerSnapshotSchema, required: true },
    date: { type: Date, default: Date.now, required: true },
    productIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    productNames: [{ type: String }],
    quantities: [{ type: Number }],
    priceTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ['ordered', 'ready_to_deliver', 'delivered'],
      default: 'ordered',
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', OrderSchema);
