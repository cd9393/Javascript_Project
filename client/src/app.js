const Coin = require('./models/coin')

const FormView = require('./views/form_view')
const PortfolioView = require('./views/portfolio_view')
const CryptoList = require('./views/crypto_list.js')
const TotalValueView = require('./views/total_value_view.js')
const IndividualCoinView = require('./views/individual_coin_view.js')


document.addEventListener('DOMContentLoaded', () => {

  console.log("Javascript Loaded");


  const listContainer = document.querySelector('.whole-page')

  const totalValueView = new TotalValueView(listContainer);
  totalValueView.bindEvents();

  const cryptoList = new CryptoList(listContainer)
  cryptoList.bindEvents();

  const leftDiv = document.querySelector('left-div')
  const portfolioView = new PortfolioView(leftDiv);
  portfolioView.bindEvents();



  const coin = new Coin();
  coin.bindEvents();

})
