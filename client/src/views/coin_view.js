const PubSub = require('../helpers/pub_sub')

const CoinView = function(coinObject){

}

CoinView.prototype.render = function(coinObject){
  // console.log(coinObject);
  const newBox = this.createDivBox("single-coin")
  coinProperties = this.getProps(coinObject)
  const newList = document.createElement('ul')

  coinProperties.forEach((property) => {
    const nameProp = document.createElement('li')
    nameProp.textContent(coinProperties.name)
    const amountProp = document.createElement('li')
    amountProp.textContent(coinProperties.name)
  })
  newBox.appendChild(newList)


  // const coinBox = this.createDivBox("coinBox");
  // const table =
}


CoinView.prototype.createDivBox = function (className){
  const divBox = document.createElement('div')
  divBox.classList.add(className)
}

CoinView.prototype.getProps = function(coin){
  const newObject = {
    name: coin.name,
    amount: coin.amount,
    price: "current price",
    value: "amount * price"
  }
  return newObject
}

module.exports = CoinView;
