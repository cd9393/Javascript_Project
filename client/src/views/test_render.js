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

  const deleteBtn = this.createDeleteButton(coin)
  coinList.appendChild(deleteBtn)

  coinDiv.appendChild(coinList)

  coinDiv.addEventListener('click', (event) => {
    const symbol = event.target.className;
    PubSub.publish("coinView: coin-clicked", symbol)
  })
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

  const deleteLi = document.createElement('li')
deleteLi.textContent = "Delete"
headerList.appendChild(deleteLi)
  headerDiv.appendChild(headerList)
  return headerDiv;

};

TestRender.prototype.createDeleteButton = function(coinObject){
  // Best to replace this div with an image/vector/SVG
  const deleteBtnElement = document.createElement('div');
  deleteBtnElement.textContent = "DELETE";
  deleteBtnElement.id = "deleteBtn"; // Use this for CSS styling
  deleteBtnElement.value = coinObject._id // Use this for delete request
  deleteBtnElement.addEventListener('click', (event) => this.handleDeleteBtn(event))
  return deleteBtnElement
}

TestRender.prototype.handleDeleteBtn = function(event){
  PubSub.publish('CoinView:Delete-Coin', event.target.value)
}

module.exports = TestRender;
