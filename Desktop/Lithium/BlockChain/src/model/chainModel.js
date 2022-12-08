const mongoose = require("mongoose");

const chainModel = new mongoose.Schema(
  {
    symbol: {
      type: String,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      unique: true,
      required: true,
    },
    marketCapUsd: {
      type: String,
      unique: true,
      required: true,
    },
    priceUsd: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = new mongoose.model("BlockChain", chainModel)