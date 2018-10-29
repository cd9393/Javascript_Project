const Coin = require('./models/coin')

const PortfolioView = require('./views/portfolio_view')
const CryptoList = require('./views/crypto_list.js')
const FormView = require('./views/form_view')
// >>>>>>> 6f634e4e7f22963e6fe5b19be9eed2076082ac3e

document.addEventListener('DOMContentLoaded', () => {

  console.log("Javascript Loaded");
  const listContainer = document.querySelector('.whole-page')
  const cryptoList = new CryptoList(listContainer)
  cryptoList.bindEvents();

  const leftDiv = document.querySelector('left-div')
  const portfolioView = new PortfolioView(leftDiv);
  portfolioView.bindEvents();

  const form = document.querySelector('#coin-quantity-form')
  const formView = new FormView(form)
  formView.bindEvents();


  const coin = new Coin();
  coin.bindEvents();

})
