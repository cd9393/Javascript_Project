const PubSub = require('../helpers/pub_sub')

const CoinView = function(){
  // this.latestCoinData = null;
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
  const coinBox = document.createElement('div')
  coinBox.classList.add(`coin-box`)
  coinBox.id = `${coinObject.name}-itemId`

  // This event listener will link to the Google charts display div
  coinBox.addEventListener('click', (event) => {
    console.log(`Trigger ${coinObject.name} graph`)
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

  PubSub.subscribe("Coin:SortedCoins Ready", (event) => {
    this.latestCoinData = event.detail;

    const coinFound = this.latestCoinData.find(function(coin){
      return coin.name === coinName
    })

    console.log(`Found ${coinFound.quotes.USD.price}`)
    return coinFound.quotes.USD.price

  });
}


module.exports = CoinView;
