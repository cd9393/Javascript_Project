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

    this.render(portfolioValue)

  })
};

TotalValueView.prototype.render = function (amount) {
  const valueDiv = document.createElement('div');
  const value = document.createElement('h1');
  value.textContent = `Portfolio Value :$ ${amount}`
  valueDiv.appendChild(value)
  this.container.insertBefore(valueDiv,this.container.firstChild)
};

module.exports = TotalValueView
