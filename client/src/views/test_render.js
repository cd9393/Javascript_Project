const PubSub = require('../helpers/pub_sub.js')
const TotalValueView = require('./total_value_view.js')

const TestRender = function(container){
  this.container = container
};

TestRender.prototype.bindEvents = function () {
  PubSub.subscribe('Coin:Portfolio-Loaded',(event) => {

    const allCoins = event.detail;
    this.render(allCoins)
  })
};

TestRender.prototype.render = function (coins) {

  const containerDiv = document.createElement('div')
  containerDiv.classList.add('overall-div')
  const leftDiv = document.createElement('div')
  leftDiv.classList.add('left-div');

  leftDiv.appendChild(this.renderListHeader())
  coins.forEach((coin) => {
    leftDiv.appendChild(this.renderCoin(coin));
  })
  containerDiv.appendChild(leftDiv)
  this.container.appendChild(containerDiv)
  // const totalValueView = new TotalValueView(this.container)
  // totalValueView.bindEvents();
};

TestRender.prototype.renderCoin = function (coin) {
  const coinDiv = document.createElement('div')
  coinDiv.classList.add(`${coin.name}`);
  const coinList = document.createElement('ul');
  const nameLi = document.createElement('li');
  nameLi.textContent = coin.name;
  coinList.appendChild(nameLi)

  const symbolLi = document.createElement('li');
  symbolLi.textContent = coin.symbol;
  coinList.appendChild(symbolLi)

  const priceLi = document.createElement('li');
  priceLi.textContent = coin.price;
  coinList.appendChild(priceLi);

  const amountLi = document.createElement('li');
  amountLi.textContent = coin.amount;
  coinList.appendChild(amountLi);

  const valueLi = document.createElement('li');
  valueLi.textContent = coin.value;
  coinList.appendChild(valueLi);

  coinDiv.appendChild(coinList)
  return coinDiv;
};

TestRender.prototype.renderListHeader = function () {
  const headerDiv = document.createElement('div')
  headerDiv.classList.add("portfolio-header");
  const headerList = document.createElement('ul');
  const nameLi = document.createElement('li');
  nameLi.textContent = "Name";
  headerList.appendChild(nameLi)

  const symbolLi = document.createElement('li');
  symbolLi.textContent = "Symbol";
  headerList.appendChild(symbolLi)

  const priceLi = document.createElement('li');
  priceLi.textContent = "Price";
  headerList.appendChild(priceLi);

  const amountLi = document.createElement('li');
  amountLi.textContent = "Amount";
  headerList.appendChild(amountLi);

  const valueLi = document.createElement('li');
  valueLi.textContent = "Value";
  headerList.appendChild(valueLi);

  headerDiv.appendChild(headerList)
  return headerDiv;

};

module.exports = TestRender;
