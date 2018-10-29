// https://www.alphavantage.co/query?function=${timeFrame}&symbol=apikey=${coin}&SZGMIHDEPWLBE9NI

const PubSub = require('../helpers/pub_sub')
const Request = require('../helpers/request')

const Coin = function(url){
  this.data = null;
  this.allCoins = null
  // this.request = new Request(`https://www.alphavantage.co/query?function=CURRENCY_EXCHANGE_RATE&from_currency=BTC&to_currency=USD&apikey=SZGMIHDEPWLBE9NI`)
  this.portfolioDB = 'http://localhost:3000/api/coins'
  this.requestDB = new Request(this.portfolioDB)
  this.request = new Request(`https://www.alphavantage.co/query?function=DIGITAL_CURRENCY_DAILY&symbol=BTC&market=USD&apikey=SZGMIHDEPWLBE9NI`)
}

Coin.prototype.bindEvents = function(){
  this.getPortfolioDB();
  this.getAllCoins();
  // this.getData();
  this.getFormSubmitted();
}

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

// Get latest portfolio record in DB
Coin.prototype.getPortfolioDB = function (){
  this.requestDB.get()
  .then((allCoins) => {
    this.portfolio = allCoins
    console.log(allCoins);
    PubSub.publish('Coin:Portfolio-Loaded', allCoins)
  })
}

Coin.prototype.getFormSubmitted = function(){
  // if coin exists in DB then update quantity, else create new coin
  PubSub.subscribe('FormView:coin-submitted', (event) => {
    const coinName = event.detail.select.value
    console.log(coinName);
    const status = this.coinExists(coinName);
    console.log("status", status);
    if(this.coinExists(coinName)){
      console.log("this coin exists in the DB")
    }else{
      console.log("this coin doesn't exist in DB");
      // const newObject = this.createCoin(event.detail)
      // this.postPortfolioDB(newObject)
    }
  })
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
    var status = null;
    const coinFound = this.searchCoin(this.portfolio, coinName);
    console.log(this.portfolio);
    console.log(coinName);
    console.log(coinFound);
    if(coinFound === undefined){
      console.log(coinFound);
      status = false
    }else{
      console.log(coinFound);
      status = true
    }
    console.log(status);
    return status
  }



Coin.prototype.searchCoin = function(allCoins, coinName){
  const coinFound = allCoins.find(function(coin){
    // console.log(`coin.name gives ${coin.name}`);
    // console.log(`coinName gives ${coinName}`);
    // console.log(coin.name === coinName);
    return coin.name === coinName;
  })

  return coinFound

}


module.exports = Coin;
