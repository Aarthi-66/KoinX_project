const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const { storeCryptoData } = require('./scripts/fetchData');
const Crypto = require('./models/Crypto'); // Ensure this is included
const { create, all } = require('mathjs');
const math = create(all);

const app = express();

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/cryptoDB')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

// Define the /cryptos route
app.get('/cryptos', async (req, res) => {
  try {
    const data = await Crypto.find();  // Fetch all documents from the 'cryptos' collection
    res.json(data);
  } catch (error) {
    res.status(500).send('Error fetching data');
  }
});


app.get('/stats', async (req, res) => {
  const coin = req.query.coin; // Get the coin parameter from the query string
  console.log(`Querying stats for: ${coin}`); // Debug log

  if (!coin) {
    return res.status(400).send('Missing coin parameter');
  }

  try {
    // Find the latest record by coin name using a case-insensitive regex and select only the specified fields
    const cryptoData = await Crypto.findOne({ coin: new RegExp(coin, 'i') }) // Use `coin` for query
      .select('current_price market_cap change_24h') // Select only the desired fields
      .sort({ last_updated: -1 }); // Sort by last updated in descending order

    if (!cryptoData) {
      console.error(`Cryptocurrency not found for coin: ${coin}`); // Debug log
      return res.status(404).send('Cryptocurrency not found');
    }

    // Construct the response using the selected fields
    const response = {
      price: cryptoData.current_price,
      marketCap: cryptoData.market_cap,
      "24hChange": cryptoData.change_24h,
    };

    res.json(response); // Return the constructed response
  } catch (error) {
    console.error(error); // Log any errors for debugging
    res.status(500).send('Error fetching cryptocurrency data');
  }
});




// Implement the /deviation route
app.get('/deviation', async (req, res) => {
  const coin = req.query.coin; // Get the coin parameter from the query string
  console.log(`Calculating deviation for: ${coin}`); // Debug log

  if (!coin) {
    return res.status(400).send('Missing coin parameter');
  }

  try {
    // Find the last 100 records for the requested coin, using a case-insensitive regex
    const cryptoData = await Crypto.find({ coin: new RegExp(coin, 'i') }) // Change here
      .sort({ last_updated: -1 })
      .limit(100);

    console.log(`Fetched records: ${cryptoData.length}`); // Log number of records fetched

    if (cryptoData.length === 0) {
      console.error(`No records found for coin: ${coin}`); // Debug log
      return res.status(404).send('No records found for the specified cryptocurrency');
    }

    // Extract the current prices
    const prices = cryptoData.map(record => record.current_price);

    // Calculate the standard deviation
    const deviation = math.std(prices);

    // Construct the response
    res.json({ deviation: parseFloat(deviation.toFixed(2)) }); // Round to 2 decimal places
  } catch (error) {
    console.error(error); // Log any errors for debugging
    res.status(500).send('Error fetching cryptocurrency data for deviation calculation');
  }
});


// Schedule background job to fetch data every minute
cron.schedule('0 */2 * * *', async () => {  // Runs every 2 hours
  console.log('Fetching and storing cryptocurrency data...');
  await storeCryptoData();
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
