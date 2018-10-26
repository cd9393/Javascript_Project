const Coin = require('./models/coin')

document.addEventListener('DOMContentLoaded', () => {

  console.log("Javascript Loaded");

  const coin = new Coin();
  coin.bindEvents();



})
