const mongoose = require("mongoose");

const subscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  cost: {
    type: Number,
    required: true
  },
  billingCycle: {
    type: String,
    default: "Monthly"
  },
  renewalDate: {
    type: Date,
    required: true
  },
  category: {
    type: String
  }
});

module.exports = mongoose.model("Subscription", subscriptionSchema);