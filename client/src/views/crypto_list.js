const PubSub = require("../helpers/pub_sub.js")

const CryptoList = function(container){
  this.container = container;
  this.coins = null
};

CryptoList.prototype.bindEvents = function () {
  PubSub.subscribe("Coin:SortedCoins Ready", (event) => {
    this.coins = event.detail;
    this.render();
  })

};

CryptoList.prototype.render = function () {
  const button = document.querySelector("#coin-prices")
  button.addEventListener("click", () => {
    this.container.innerHTML = ''
    const table = this.createTable();
    this.container.appendChild(table)
  })
};

CryptoList.prototype.createTable = function () {
  const headerKeys = ["Rank","Name","Symbol","Price  (USD)",,"Change (24hrs)","Market Size  (USD)"]
  const keys = ["rank", "name", "symbol","quotes"]
  const table = document.createElement("table")
  const tableHeader = document.createElement('thead')
  const headerRow = document.createElement('TR');


  headerKeys.forEach((key) => {
    const title = document.createElement('TD')
    title.innerHTML = `${key}`
    headerRow.appendChild(title);
  })


  tableHeader.appendChild(headerRow)
  const tableBody = document.createElement('tbody')
  this.coins.forEach((coin) => {
    const tableRow = document.createElement('TR');
    keys.forEach((key) => {
      if(key === "quotes"){
        const usd = coin[`${key}`].USD
        const usdKeys = ["price","percent_change_24h","market_cap"]
        usdKeys.forEach((key) => {
          const valueCell = document.createElement('TD')
          valueCell.id = key
          valueCell.innerHTML = usd[`${key}`].toFixed(2)
          tableRow.appendChild(valueCell)
        })

      }else{
        const cell = document.createElement('TD')
        cell.id = coin[`${key}`]
        cell.innerHTML = coin[`${key}`]
        tableRow.appendChild(cell)
      }})
      tableRow.id = coin.symbol
      tableRow.addEventListener('click', (event) => {
        data = event.path[1].id;
        PubSub.publish('CryptoList: clicked-coin-symbol', data)
      })
      tableBody.appendChild(tableRow)

    })

    table.appendChild(tableHeader);
    table.appendChild(tableBody);
    return table;
  };

  module.exports = CryptoList;
