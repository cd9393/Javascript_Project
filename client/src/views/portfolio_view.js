const PubSub = require('../helpers/pub_sub')
const CoinView = require('./coin_view')

const PortfolioView = function(portfolioElement){
  this.portfolioElement = portfolioElement;
}

PortfolioView.prototype.bindEvents = function(){

  // Load mongoDB data
  PubSub.subscribe('Coin:Portfolio-Loaded', (event) => {
    const portfolioDB = event.detail;
    this.render(portfolioDB);
  })
}

PortfolioView.prototype.render = function(portfolioDB){
  const portfolioWrapper = this.selectElement('#left-contents')
  // Clear div and render coins in MongoDB
  portfolioWrapper.innerHTML = '';
  this.assembleCoinList(portfolioDB, portfolioWrapper)
}

PortfolioView.prototype.assembleCoinList = function(db, wrapper){
  db.forEach((coin) => {
    const coinView = new CoinView()
    const newCoin = coinView.render(coin)
    wrapper.appendChild(newCoin)
  });
}

PortfolioView.prototype.selectElement = function(element){
  return document.querySelector(element)
}

module.exports = PortfolioView;