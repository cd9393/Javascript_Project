const PubSub = require('../helpers/pub_sub')

const CoinView = function(coinObject){

}

CoinView.prototype.render = function(coinObject){
  // console.log(coinObject);
  // const coinBox = this.createDivBox("single-coin")

  const coinBox = document.createElement('div')
  coinBox.classList.add('single-coin')

  coinProperties = this.getProps(coinObject)

  const newList = document.createElement('ul')

  for (property in coinProperties) {
    const prop = document.createElement('li')
    prop.textContent = coinProperties[property]
    prop.value = "API call for symbol here"
    newList.appendChild(prop)
  }
  coinBox.appendChild(newList)
  return coinBox
}

CoinView.prototype.createDivBox = function (className){
  const divBox = document.createElement('div')
  divBox.classList.add(className)
  return divBox
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
