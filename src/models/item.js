const mongoose = require("mongoose");

// Define the schema
const schema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  sku: {
    type: String,
    required: true,
    trim: true,
  },
  unitPrice: {
    type: Number,
    required: true,
    min: 0,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  totalPrice: {
    type: Number,
    required: true,
    min: 0,
  },
});

schema.pre("save", function (next) {
  if (!this.totalPrice) {
    this.totalPrice = this.unitPrice * this.quantity;
  }
  next();
});

// Create the model
const Item = mongoose.model("Item", schema);

module.exports = Item;
