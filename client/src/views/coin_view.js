const PubSub = require('../helpers/pub_sub')
const Coin = require('../models/coin')

const CoinView = function(wrapper){
  this.wrapper = wrapper
  this.latestCoinData = null;
}

CoinView.prototype.render = function(coinObject){

  PubSub.subscribe("Coin:SortedCoins Ready", (event) => {
    console.log(event.detail);
    this.latestCoinData = event.detail;
    // This creates the div box holding single coin details
    const coinBox = this.createCoinBox(coinObject)
    this.wrapper.appendChild(coinBox);

  });
  // const coinBox = this.createCoinBox(coinObject)
  // this.wrapper.appendChild(coinBox);
}

CoinView.prototype.createCoinBox = function(coinObject){
  // console.log(coinObject.name);
  const coinBox = document.createElement('div')
  coinBox.classList.add(`coin-box`)

  const detailsBox = document.createElement('div')
  detailsBox.classList.add(`details-box`)
  detailsBox.id = `${coinObject.name}-itemId`
  detailsBox.value = coinObject._id

  // This grabs the latest coin property values from the DB
  coinProperties = this.getProps(coinObject)

  // Create list from the DB property values
  const newList = document.createElement('ul')
  newList.classList.add(`${coinObject.symbol}`)
  this.addListItems(newList, coinProperties)

  // Add and return the list details of a single coin
  detailsBox.appendChild(newList)

  coinBox.appendChild(detailsBox)

  const deleteBtn = this.createDeleteButton(coinObject)
  coinBox.appendChild(deleteBtn)


  // This event listener will link to the Google charts display div
  detailsBox.addEventListener('click', (event) => {
    const symbol = event.target.className;
    PubSub.publish("coinView: coin-clicked", symbol)
  });
  return coinBox
}

CoinView.prototype.addListItems = function(theList, coinProperties){
  for (property in coinProperties){
    const prop = document.createElement('li')
    prop.textContent = coinProperties[property]
    theList.appendChild(prop)
  }
}

CoinView.prototype.getProps = function(coin){

  // Get latest coin data from CoinMarketCap API before rendering
  // Use the DB coin name to search for the price on CoinMarketCap API
  const coinPrice = this.getCoinPrice(coin.name)
  console.log(coinPrice);

  const newObject = {
    name: coin.name,
    amount: coin.amount,
    price: coinPrice,
    value: coin.amount * coinPrice
  }

  return newObject
}

CoinView.prototype.getCoinPrice = function(coinName){
  // Find coin and get latest price


  console.log(this.latestCoinData);
  const coinFound = this.latestCoinData.find(function(coin){
    return coin.name === coinName
  })

  console.log(`Found ${coinFound.quotes.USD.price}`)
  return coinFound.quotes.USD.price

}

CoinView.prototype.createDeleteButton = function(coinObject){
  // Best to replace this div with an image/vector/SVG
  const deleteBtnElement = document.createElement('div');
  deleteBtnElement.textContent = "DELETE";
  deleteBtnElement.id = "deleteBtn"; // Use this for CSS styling
  deleteBtnElement.value = coinObject._id // Use this for delete request
  deleteBtnElement.addEventListener('click', (event) => this.handleDeleteBtn(event))
  return deleteBtnElement
}

CoinView.prototype.handleDeleteBtn = function(event){
  PubSub.publish('CoinView:Delete-Coin', event.target.value)
}

module.exports = CoinView;
