const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  products: {
    type: mongoose.Schema.Types.Array,
  },
  quantity: { type: Number, default: 1 },
  date: { type: Date, default: Date.now },
  user: {
    type: mongoose.Schema.Types.String,
    required: true,
  },
});

module.exports = mongoose.model("Order", orderSchema);
