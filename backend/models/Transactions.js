const mongoose = require("mongoose");

const TransactionSchema = new mongoose.Schema({
  amount: Number,
  roundUp: Number,
  saved: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Transaction", TransactionSchema);