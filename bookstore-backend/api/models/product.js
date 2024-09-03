const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
  price: { type: Number, required: true },
  year: { type: Number, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "Author" },
  imgUrl: { type: String },
});

module.exports = mongoose.model("Product", productSchema);
