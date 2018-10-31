const PubSub = require('../helpers/pub_sub.js')
const FormView = require('./form_view.js')


const IndividualCoinView = function(container){

  this.container = container;
  this.performance_container = document.createElement('div')

};

IndividualCoinView.prototype.bindEvents = function (priceHistory) {
  // PubSub.subscribe('coin:chosen-coin-price-History', (event) => {
  //   const priceHistory = event.detail;
    // this.render(priceHistory)
  // })
};

IndividualCoinView.prototype.render = function (priceHistory) {
  this.chartData = (this.priceHistoryFormat(priceHistory, 30));
console.log(priceHistory);

const leftDiv = document.querySelector('.left-div')
const rightDiv = document.querySelector('.right-div')
const table = document.querySelector('.table')
this.container.innerHTML = ''
// table.innerHTML = ''
// rightDiv.innerHTML = ''
// leftDiv.innerHTML = ''

  const header = document.createElement('h1');
  header.textContent = priceHistory[0].name;
  this.container.appendChild(header)

this.createForm(priceHistory);
this.performance_container.classList.add('performance')
  this.performance_container.appendChild(this.CurrentPrice(priceHistory));
  this.performance_container.appendChild(this.weeklyGain(priceHistory));
  this.performance_container.appendChild(this.weeklyChangePrice(priceHistory))
  this.CurrentPrice(priceHistory);
  this.container.appendChild(this.performance_container)
  this.makeChart(this.chartData);

};

IndividualCoinView.prototype.createForm = function (priceHistory) {
  const formDiv = document.createElement('div');
  const form = document.createElement('form');
  form.id = "coin-quantity-form";
  const label = document.createElement('label');
  label.for = "number";
  label.textContent = "Add To Portfolio";
  form.appendChild(label);
  const input = document.createElement('input');
  input.type = "number";
  input.id = "number";
  input.step = "any";
  form.appendChild(input);
  const submit = document.createElement('input');
  submit.type = "submit";
  submit.value = priceHistory[0].symbol;
  submit.value2 = priceHistory[0].name;
  submit.value3 = priceHistory[0].close;
  form.appendChild(submit);

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    PubSub.publish('FormView:coin-submitted', event);
    form.reset();
  })
  formDiv.appendChild(form);

  this.container.appendChild(formDiv);


  // <label for="number">Enter quantity</label>
  // <input type="number" id="number" step="any"/ required>
  // <input type="submit" value="submit"/>
};

IndividualCoinView.prototype.CurrentPrice = function (priceHistory) {
  const todaysPrice = parseFloat(priceHistory[0].close).toFixed(2);
  const todaysPriceContainer = document.createElement('div');
  todaysPriceContainer.textContent = `$ ${todaysPrice}  ${priceHistory[0].name} Price`
  return todaysPriceContainer;
};

IndividualCoinView.prototype.weeklyChangePrice = function (priceHistory) {

  const weeklyChange = (priceHistory[0].close - priceHistory[7].close).toFixed(2) ;
  const weeklyChangecontainer = document.createElement('div')
  weeklyChangecontainer.textContent = `$ ${weeklyChange} Since Last Week`;
  return weeklyChangecontainer

};


IndividualCoinView.prototype.weeklyGain = function (priceHistory) {

  const weeklyChange = (((priceHistory[0].close - priceHistory[7].close) / priceHistory[7].close)*100).toFixed(2) ;

  const weeklyChangePercentageContainer = document.createElement('div')
  weeklyChangePercentageContainer.textContent = `% ${weeklyChange} Since Last Week`
  return weeklyChangePercentageContainer

};

IndividualCoinView.prototype.makeChart = function () {
  const chartDiv = document.createElement('div')
  chartDiv.id = "price-history";
  this.container.appendChild(chartDiv)

  const chartFunction = document.createElement('script')
  chartFunction.textContent = google.charts.load('current', {'packages':['corechart']});

  const drawChart = () => {
    var data = google.visualization.arrayToDataTable(this.chartData);

    // Optional; add a title and set the width and height of the chart
    var options = {
      title: 'Coin Price USD',
      curveType: 'function',
      legend: { position: 'bottom' }
    };

    // Display the chart inside the <div> element with id="piechart"
    var chart = new google.visualization.LineChart(document.getElementById('price-history'));
    chart.draw(data, options);
  }

  google.charts.setOnLoadCallback(drawChart);
};


IndividualCoinView.prototype.priceHistoryFormat = function (priceHistory,timeFrame = 365) {
  const priceHistoryClone = JSON.parse(JSON.stringify( priceHistory));
  const priceHistoryTime = priceHistoryClone.splice(0, timeFrame)
  let priceHistoryArray = [];
  let priceHistoryArrayHeaders = ["Date","close"];
  priceHistoryArray.push(priceHistoryArrayHeaders);
  priceHistoryTime.forEach((priceEvent) => {
    let dailyPrice = [];
    dailyPrice.push(new Date(priceEvent.date))
    dailyPrice.push(parseFloat(priceEvent.close))
    priceHistoryArray.push(dailyPrice)
  })
  priceHistoryArray = priceHistoryArray.sort((a,b) => {
    return a[0]-b[0];
  })
  return priceHistoryArray;
};


module.exports = IndividualCoinView;
