use coin_tracker
db.dropDatabase();

db.coins.insertMany([
  {
    name: "Ethereum",
    amount: 5,

  },

  {
    name: "Bitcoin",
    amount: 1,

  },

  {
    name: "Litecoin",
    amount: 100,

  }
])
