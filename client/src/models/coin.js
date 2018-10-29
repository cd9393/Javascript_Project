// https://www.alphavantage.co/query?function=${timeFrame}&symbol=apikey=${coin}&SZGMIHDEPWLBE9NI

const PubSub = require('../helpers/pub_sub')
const Request = require('../helpers/request')

const Coin = function(url){
  this.data = null;
  this.allCoins = null
  // this.request = new Request(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=SZGMIHDEPWLBE9NI`)
  this.portfolioDB = 'http://localhost:3000/api/coins'
  this.request = new Request(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=SZGMIHDEPWLBE9NI`)
}

Coin.prototype.bindEvents = function(){
  PubSub.subscribe("CryptoList: clicked-coin-symbol", (event) => {
    this.individualCoinPriceData(event.detail)
  })
  this.getPortfolioDB();
  this.getAllCoins();
  this.getData();
}


Coin.prototype.individualCoinPriceData = function (symbol) {
  const individualCoinData = new Request(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=${symbol}&market=USD&apikey=SZGMIHDEPWLBE9NI`);

  const todaysPrice = new Request(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=${symbol}&to_currency=USD&apikey=SZGMIHDEPWLBE9NI`);

  todaysPrice.get().then((data)=>{
    const realTimeInfo = {
      name: data["Realtime Currency Exchange Rate"]["2. From_Currency Name"],
      symbol: data["Realtime Currency Exchange Rate"]["1. From_Currency Code"] ,
      date: data["Realtime Currency Exchange Rate"]["6. Last Refreshed"],
      close: data["Realtime Currency Exchange Rate"]["5. Exchange Rate"] ,
    }
    PubSub.publish("coin: chosen-coin-real-time-price",realTimeInfo)
  })

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
    PubSub.publish("coin:chosen-coin-price-History",dateInfo)
  })
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

Coin.prototype.getPortfolioDB = function (){
  const request = new Request(this.portfolioDB);
  request.get()
  .then((data) => {
    PubSub.publish('Coin:Portfolio-Loaded', data)
  })
}





module.exports = Coin;
