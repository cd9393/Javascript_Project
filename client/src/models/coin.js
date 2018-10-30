// https://www.alphavantage.co/query?function=${timeFrame}&symbol=apikey=${coin}&SZGMIHDEPWLBE9NI

const PubSub = require('../helpers/pub_sub')
const Request = require('../helpers/request')
const PortfolioView = require('../views/portfolio_view')

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
  this.deleteBtn();
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
Coin.prototype.getPortfolioDB = function(){
  // This return allows you to call a .then() elsewhere if required.
  return this.requestDB.get()
  .then((allCoins) => {
    this.portfolio = allCoins
    console.log(allCoins);
    PubSub.publish('Coin:Portfolio-Loaded', allCoins)
  })
}

Coin.prototype.getFormSubmitted = function(){
  // if coin exists in DB then update quantity, else create new coin
  PubSub.subscribe('FormView:coin-submitted', async (event) => {

    const formCoin = this.createCoin(event.detail);

    await this.getPortfolioDB()

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
    amount: existingCoin.amount + formCoinData.amount
  }

  this.requestDB.put(id, coinUpdated)
  .then((coins) => {
    PubSub.publish('Coin:Portfolio-Loaded', coins)
  })
}

Coin.prototype.createCoin = function(formInput){
  // May need to add total value and price entry points later
  const newCoin = {
    name: formInput.select.value,
    amount: parseFloat(formInput.number.value)
  }
  return newCoin
}

Coin.prototype.deleteBtn = function(){
  PubSub.subscribe('CoinView:Delete-Coin', (event) => {
    const delete_id = event.detail;
    console.log(delete_id);
    this.requestDB.delete(delete_id)
    .then((coins) => {
      PubSub.publish('Coin:Portfolio-Loaded', coins)
    })
  })
}

module.exports = Coin;
