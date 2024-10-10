const mongoose = require('mongoose');

const cryptoSchema = new mongoose.Schema({
  coin: { type: String, required: true },  // Change here
  symbol: { type: String, required: true },
  current_price: { type: Number, required: true },
  market_cap: { type: Number, required: true },
  change_24h: { type: Number, required: true },
  last_updated: { type: Date, default: Date.now }, // Automatically set current date and time
});

module.exports = mongoose.model('Crypto', cryptoSchema);
