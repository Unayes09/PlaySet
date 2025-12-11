const mongoose = require('mongoose');

const CustomerSchema = new mongoose.Schema(
  {
    phone: { type: String, required: true },
    name: { type: String, required: true },
    address: { type: String, required: true },
    additionalInfo: { type: String },
    email: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Customer', CustomerSchema);
