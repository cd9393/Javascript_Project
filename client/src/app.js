const Coin = require('./models/coin')
const CryptoList = require('./views/crypto_list.js')

document.addEventListener('DOMContentLoaded', () => {

  console.log("Javascript Loaded");
const listContainer = document.querySelector('.whole-page')
const cryptoList = new CryptoList(listContainer)
cryptoList.bindEvents();

  const coin = new Coin();
  coin.bindEvents();



})
