const PubSub = require('../helpers/pub_sub')
const CoinView = require('./coin_view')
const IndividualCoinView = require("./individual_coin_view.js")

const PortfolioView = function(portfolioElement){
  this.portfolioElement = portfolioElement;
}

PortfolioView.prototype.bindEvents = function(){

  // Load mongoDB data
  PubSub.subscribe('Coin:Portfolio-Loaded', (event) => {
    console.log(event);
    const portfolioDB = event.detail;
    this.render(portfolioDB);
  })

}

PortfolioView.prototype.render = function(portfolioDB){
  const portfolioWrapper = document.querySelector('.left-div')
  // Clear div and render coins in MongoDB
  console.log(portfolioWrapper);
  portfolioWrapper.innerHTML = '';
  this.assembleCoinList(portfolioDB, portfolioWrapper)
}

PortfolioView.prototype.assembleCoinList = function(db, wrapper){
  console.log(db);
  db.forEach((coin) => {
    const coinView = new CoinView(wrapper)
    coinView.render(coin)
  });
}

PortfolioView.prototype.selectElement = function(element){
  return document.querySelector(element)
}

module.exports = PortfolioView;
