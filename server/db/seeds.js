use coin_tracker
db.dropDatabase();

db.coins.insertMany([
  {
    name: "Ethereum",
    amount: 5,
    price: 165,
    value: 825
  },

  {
    name: "Bitcoin",
    amount: 1,
    price: 6000,
    value:6000
  },

  {
    name: "Litecoin",
    amount: 100,
    price: 54,
    value: 5400
  }
])
