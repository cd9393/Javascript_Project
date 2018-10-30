use coin_tracker
db.dropDatabase();

db.coins.insertMany([
  {
    name: "Ethereum",
    symbol: "ETH",
    amount: 5,
    price: 165,
    value: 825
  },

  {
    name: "Bitcoin",
    symbol: "BTC",
    amount: 1,
    price: 6000,
    value:6000
  },

  {
    name: "Litecoin",
    symbol: "LTC",
    amount: 100,
    price: 54,
    value: 5400
  }
])
