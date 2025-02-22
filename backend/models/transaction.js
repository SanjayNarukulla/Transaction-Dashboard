const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema(
  {
    id: { type: Number, required: true, unique: true }, // ✅ Custom Numeric ID
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    category: { type: String, required: true, trim: true },
    sold: { type: Boolean, default: false },
    dateOfSale: { type: Date, required: true },
    image: { type: String, required: true, trim: true },
  },
  {
    _id: false, // ❌ Disable default `_id` field
    toJSON: {
      transform: function (doc, ret) {
        delete ret._id; // ❌ Ensure `_id` doesn't appear in the response
        delete ret.__v; // ❌ Remove `__v` (MongoDB version key)
      },
    },
  }
);

module.exports = mongoose.model("Transaction", TransactionSchema);
