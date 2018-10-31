// https://www.alphavantage.co/query?function=${timeFrame}&symbol=apikey=${coin}&SZGMIHDEPWLBE9NI

const PubSub = require('../helpers/pub_sub')
const Request = require('../helpers/request')
const PortfolioView = require('../views/portfolio_view')

const Coin = function(url){
  this.data = null;
  this.allCoins = null
  this.portfolioDB = 'http://localhost:3000/api/coins'
  this.requestDB = new Request(this.portfolioDB)
  this.request = new Request(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=SZGMIHDEPWLBE9NI`)
}

Coin.prototype.bindEvents = function(){
  PubSub.subscribe("CryptoList: clicked-coin-symbol", (event) => {
    this.individualCoinPriceData(event.detail)
  })

  PubSub.subscribe("coinView: coin-clicked", (event) => {
    this.individualCoinPriceData(event.detail)
    console.log(event.detail);
  })

const db = this.getPortfolioDB()
db.then((data) => {
  this.updatePrice(data)
})
  this.getAllCoins();
  // this.getData();
  this.getFormSubmitted();
  this.deleteBtn();

}

Coin.prototype.updatePrice = function (allCoins) {
  allCoins.forEach((coin) => {
    const todaysPrice = new Request(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${coin.symbol}&to_currency=USD&apikey=SZGMIHDEPWLBE9NI`);

    todaysPrice.get().then((data) => {
      console.log("Update", data);
      const updateObject = {
        name: data["Realtime Currency Exchange Rate"]["2. From_Currency Name"],
        symbol: data["Realtime Currency Exchange Rate"]["1. From_Currency Code"] ,
        price: parseFloat(data["Realtime Currency Exchange Rate"]["5. Exchange Rate"]),
        amount: 0
      }
      this.updateCoin(coin, updateObject)
    })
})

};

Coin.prototype.individualCoinPriceData = function (symbol) {
  const individualCoinData = new Request(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=SZGMIHDEPWLBE9NI`);

  const todaysPrice = new Request(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=SZGMIHDEPWLBE9NI`);

  const realTimeInfo = todaysPrice.get().then((data)=>{
    const realTimeInfo = {
      name: data["Realtime Currency Exchange Rate"]["2. From_Currency Name"],
      symbol: data["Realtime Currency Exchange Rate"]["1. From_Currency Code"] ,
      date: data["Realtime Currency Exchange Rate"]["6. Last Refreshed"],
      close: data["Realtime Currency Exchange Rate"]["5. Exchange Rate"] ,
    }
    return realTimeInfo;
  })

  realTimeInfo.then((data) => {
    this.realtime = data;
    individualCoinData.get().then((data) => {
      this.singleCoinData = data["Time Series (Digital Currency Daily)"]
      this.singleCoinResult = data
      const dates = Object.keys(this.singleCoinData)
      dateInfo = []
      dates.forEach((date) => {
        const closePrice = this.singleCoinData[date]["4b. close (USD)"]
        const info = {
          name: this.singleCoinResult["Meta Data"]["3. Digital Currency Name"],
          symbol: this.singleCoinResult["Meta Data"]["2. Digital Currency Code"],
          date: date,
          close: closePrice
        };
        dateInfo.push(info)
      })
      dateInfo.unshift(this.realtime)
      console.log(dateInfo);
      PubSub.publish("coin:chosen-coin-price-History",dateInfo)
    })
  })

  // individualCoinData.get().then((data) => {
  //   this.singleCoinData = data["Time Series (Digital Currency Daily)"]
  //   this.singleCoinResult = data
  //   const dates = Object.keys(this.singleCoinData)
  //   dateInfo = []
  //   dates.forEach((date) => {
  //     const closePrice = this.singleCoinData[date]["4b. close (USD)"]
  //     const info = {
  //       name: this.singleCoinResult["Meta Data"]["3. Digital Currency Name"],
  //       symbol: this.singleCoinResult["Meta Data"]["2. Digital Currency Code"],
  //       date: date,
  //       close: closePrice
  //     };
  //     dateInfo.push(info)
  //   })
  //   PubSub.publish("coin:chosen-coin-price-History",dateInfo)
  // })
};

Coin.prototype.getAllCoins = function () {
  const allCoinRequest = new Request("https://api.coinmarketcap.com/v2/ticker/?sort=rank")
  allCoinRequest.get()
  .then((data) => {
    this.allCoins = data.data;
    const sortedCoins = Object.values(this.allCoins);

    sortedCoins.sort(function(a,b){
      return a.rank - b.rank;
    })
    console.log(sortedCoins);
    PubSub.publish("Coin:SortedCoins Ready", sortedCoins)
  })
};

Coin.prototype.getData = function(){
  this.request.get()
  .then((data) => {
    this.data = data;
    PubSub.publish('Coin:Data-Loaded', this.data)
  })
}

// Get latest portfolio record in DB
Coin.prototype.getPortfolioDB = function(){
  // This return allows you to call a .then() elsewhere if required.
  return this.requestDB.get()
  .then((allCoins) => {
    this.portfolio = allCoins
    return this.portfolio
    PubSub.publish('Coin:Portfolio-Loaded', allCoins)
  })
}

Coin.prototype.getFormSubmitted = function(){
  // if coin exists in DB then update quantity, else create new coin
  PubSub.subscribe('FormView:coin-submitted', async (event) => {
    const coin = {
      name: event.detail.target[1].value2,
      symbol: event.detail.target[1].value,
      price: parseFloat(event.detail.target[1].value3),
      amount: parseFloat(event.detail.target[0].value)
    }
    console.log(coin);

    const formCoin = this.createCoin(event);

    await this.getPortfolioDB() // await for this to finish before doing anything else.

    // this.coinExists() depends on this.getPortfolioDB completing first.
    const status = this.coinExists(formCoin.name);

    if(status){
      const coinToUpdate = this.searchCoin(formCoin.name)
      this.updateCoin(coinToUpdate, formCoin)
    }else{
      this.requestDB.post(formCoin).then((coins) => {
        PubSub.publish('Coin:Portfolio-Loaded', coins)
      });
    }
  });
}

Coin.prototype.postPortfolioDB = function(coin){
  this.requestDB.post(coin)
  .then((allCoins) => {
    console.log(allCoins);
    PubSub.publish('Coin:Portfolio-Loaded', allCoins)
  })
  .catch(console.error)
}

Coin.prototype.coinExists = function(coinName){

  console.log('This coin search function works');
  let status = null;
  const coinFound = this.searchCoin(coinName);
  if(coinFound === undefined){
    console.log(coinFound);
    status = false
  }else{
    console.log(coinFound);
    status = true
  }
  return status
}

Coin.prototype.searchCoin = function(coinName){
  const coinFound = this.portfolio.find(function(coin){
    return coin.name === coinName;
  });
  return coinFound
}

Coin.prototype.updateCoin = function(existingCoin, formCoinData){
  const id = existingCoin._id;
  console.log(formCoinData);
  // update coin quantity
  const coinUpdated = {
    name: existingCoin.name,
    symbol:formCoinData.symbol,
    amount: parseFloat(existingCoin.amount) + parseFloat(formCoinData.amount),
    price:formCoinData.price,
    value: parseFloat((parseFloat(existingCoin.amount) + parseFloat(formCoinData.amount))* formCoinData.price ).toFixed(2)
  }

  this.requestDB.put(id, coinUpdated)
  .then((coins) => {
    PubSub.publish('Coin:Portfolio-Loaded', coins)
  })
}

Coin.prototype.createCoin = function(event){
  // May need to add total value and price entry points later
  const newCoin = {
    name: event.detail.target[1].value2,
    symbol: event.detail.target[1].value,
    price: parseFloat(event.detail.target[1].value3).toFixed(2),
    amount: parseFloat(event.detail.target[0].value).toFixed(2),
    value: (parseFloat(event.detail.target[0].value)*(parseFloat(event.detail.target[1].value3))).toFixed(2)
  }
  return newCoin
}

Coin.prototype.deleteBtn = function(){
  PubSub.subscribe('CoinView:Delete-Coin', (event) => {
    const delete_id = event.detail;
    console.log(delete_id);
    this.requestDB.delete(delete_id)
    .then((coins) => {
      console.log(coins);
      PubSub.publish('Coin:Portfolio-Loaded', coins)
    })
  })
}

module.exports = Coin;
