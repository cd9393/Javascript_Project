const PubSub = require('../helpers/pub_sub.js')

const TotalValueView = function(container){
  this.container = container;
};

TotalValueView.prototype.bindEvents = function () {
  PubSub.subscribe('Coin:Portfolio-Loaded', (event) => {
    const portfolio = event.detail;
    const portfolioValue = portfolio.map((coin) => {
      return coin.value
    }).reduce((accumulator, currentValue) => accumulator + currentValue)
  })
};

TotalValueView.prototype.render = function () {
  
};

module.exports = TotalValueView
