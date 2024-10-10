Features:
   Fetch Cryptocurrency Data: Automatically fetches data for Bitcoin, Matic, and Ethereum every two hours.
   Retrieve Cryptocurrency Data:
/cryptos: Get a list of all stored cryptocurrencies.
/stats: Get the latest data (current price, market cap, and 24-hour change) for a specific cryptocurrency.
/deviation: Calculate and return the standard deviation of the price of a specific cryptocurrency based on the last 100 records.

Technologies Used:
Node.js
Express.js
MongoDB (using MongoDB Atlas)
Axios (for API requests)
Mongoose (for MongoDB object modeling)
node-cron (for scheduling tasks)
postman

Testing the APIs Using Postman and MongoDB:
 
 Get All Cryptocurrencies:
     GET http://localhost:3000/cryptos
 
 Get Latest Stats for a Cryptocurrency:
     GET http://localhost:3000/stats?coin=bitcoin

 Get Standard Deviation for a Cryptocurrency:
     GET http://localhost:3000/deviation?coin=bitcoin


I have successfully run these APIs and I am getting the desired output on Postman and the browser,using these APIs.
