const mongoose = require("mongoose");

const authorSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  nationality: { type: String, required: true },
});

module.exports = mongoose.model("Author", authorSchema);
