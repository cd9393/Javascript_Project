const PubSub = require('../helpers/pub_sub.js')
const Coin = require('../models/coin')

const TotalValueView = function(container){
  this.container = container;
};

TotalValueView.prototype.bindEvents = function () {
  PubSub.subscribe('Coin:Portfolio-Loaded', (event) => {
    const portfolio = event.detail;

    const portfolioValue = portfolio.map((coin) => {
      return parseFloat(coin.value)
    }).reduce((accumulator, currentValue) => accumulator + currentValue)

    this.render(portfolioValue)

  })

  const dashboardLink = document.querySelector('#dashboard')
 dashboardLink.addEventListener('click', (event) => {
   this.handleClick(event)
 })
};

TotalValueView.prototype.render = function (amount) {
  this.container.innerHTML = ''
  const valueDiv = document.createElement('div');
  valueDiv.classList.add('totalValue')
  const value = document.createElement('h1');
  value.textContent = `Portfolio Value :$ ${amount.toFixed(2)}`
  valueDiv.appendChild(value)
  this.container.appendChild(valueDiv)
};

TotalValueView.prototype.handleClick = function(){
 const coin = new Coin();
 coin.bindEvents();
}

module.exports = TotalValueView
