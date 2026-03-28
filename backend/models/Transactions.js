const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  userId: {   // 🔥 THIS IS THE MISSING PIECE
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  roundUp: Number,
  saved: Number,
  date: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Transactions", transactionSchema);