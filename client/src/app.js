const Coin = require('./models/coin')
const PortfolioView = require('./views/portfolio_view')

document.addEventListener('DOMContentLoaded', () => {

  console.log("Javascript Loaded");

  const leftDiv = document.querySelector('left-div')
  const portfolioView = new PortfolioView(leftDiv);
  portfolioView.bindEvents();

  const coin = new Coin();
  coin.bindEvents();

})
