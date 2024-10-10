const axios = require('axios');
const Crypto = require('../models/Crypto');

// Fetch cryptocurrency data from CoinGecko API
async function fetchCryptoData() {
  try {
    const response = await axios.get('https://api.coingecko.com/api/v3/coins/markets', {
      params: {
        vs_currency: 'usd',
        ids: 'bitcoin,matic-network,ethereum'
      }
    });

    console.log('Fetched data:', response.data); // Debug log

    // Map the response data to the desired format
    return response.data.map(coin => ({
      coin: coin.name.toLowerCase(),  // Change here
      symbol: coin.symbol,
      current_price: coin.current_price,
      market_cap: coin.market_cap,
      change_24h: coin.price_change_percentage_24h,
    }));

  } catch (error) {
    console.error("Error fetching data: ", error);
  }
}

// Store the fetched cryptocurrency data in MongoDB
async function storeCryptoData() {
  const data = await fetchCryptoData();

  if (!data) {
    console.error("No data fetched");
    return; // Exit if there's no data
  }

  // Iterate over each coin data and store it in the database
  for (const coin of data) {
    try {
      // Check if the coin already exists in the database
      let crypto = await Crypto.findOne({ coin: coin.coin });  // Change here

      if (crypto) {
        // If the coin exists, update its data
        crypto.current_price = coin.current_price;
        crypto.market_cap = coin.market_cap;
        crypto.change_24h = coin.change_24h;
        crypto.last_updated = Date.now();
      } else {
        // If the coin does not exist, create a new document
        crypto = new Crypto(coin);
      }

      await crypto.save(); // Save the document to the database
      console.log(`Stored/Updated data for ${coin.coin}`);  // Change here
    } catch (err) {
      console.error(`Error storing data for ${coin.coin}:`, err);  // Change here
    }
  }
}

module.exports = { storeCryptoData };
