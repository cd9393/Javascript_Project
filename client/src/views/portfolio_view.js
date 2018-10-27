const PubSub = require('../helpers/pub_sub')
const CoinView = require('./coin_view')

const PortfolioView = function(portfolioElement){
  this.portfolioElement = portfolioElement;
}

PortfolioView.prototype.bindEvents = function(){
  PubSub.subscribe('Coin:Portfolio-Loaded', (event) => {
    const portfolioData = event.detail;
    this.render(portfolioData);
  })
}

PortfolioView.prototype.render = function(portfolioData){
  const portfolioContent = this.selectElement('#left-contents')
  portfolioContent.innerHTML = '';
  portfolioData.forEach((coin) => {
    const coinView = new CoinView()
    const newCoin = coinView.render(coin)
    portfolioContent.appendChild(newCoin)
  });
}

PortfolioView.prototype.selectElement = function(element){
  return document.querySelector(element)
}

module.exports = PortfolioView;
