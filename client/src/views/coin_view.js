const PubSub = require('../helpers/pub_sub')

const CoinView = function(){
  this.latestPrice =
}

CoinView.prototype.render = function(coinObject){
  // console.log(coinObject.name);

  // This creates the div box holding single coin details
  const coinBox = this.createCoinBox(coinObject)

  // This grabs the latest coin property values from the DB
  coinProperties = this.getProps(coinObject)

  // Create list from the DB property values
  const newList = document.createElement('ul')
  this.addListItems(newList, coinProperties)

  // Add and return the list details of a single coin
  coinBox.appendChild(newList)
  return coinBox
}

CoinView.prototype.createCoinBox = function(coinObject){
  // console.log(coinObject.name);
  console.log('this coinBox function works');
  const coinBox = document.createElement('div')
  coinBox.classList.add(`coin-box`)
  coinBox.id = `${coinObject.name}-itemId`

  // This event listener will link to the Google charts display div
  coinBox.addEventListener('click', (event) => {console.log('Trigger graph')});
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
  const newObject = {
    name: coin.name,
    amount: coin.amount,
    price: "current price",
    value: coin.amount * 3
  }
  return newObject
}

module.exports = CoinView;
