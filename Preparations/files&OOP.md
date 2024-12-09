[toc]
## Lab 5 Part 1 - Adding a Legend
```js
/*
*    main.js
*    Taken from Mastering Data Visualization with D3.js
*    
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

let time = 0

// Scales
const x = d3.scaleLog()
	.base(10)
	.range([0, WIDTH])
	.domain([142, 150000])
const y = d3.scaleLinear()
	.range([HEIGHT, 0])
	.domain([0, 90])
const area = d3.scaleLinear()
	.range([25*Math.PI, 1500*Math.PI])
	.domain([2000, 1400000000])
const continentColor = d3.scaleOrdinal(d3.schemePastel1)

// Labels
const xLabel = g.append("text")
	.attr("y", HEIGHT + 50)
	.attr("x", WIDTH / 2)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("GDP Per Capita ($)")
const yLabel = g.append("text")
	.attr("transform", "rotate(-90)")
	.attr("y", -40)
	.attr("x", -170)
	.attr("font-size", "20px")
	.attr("text-anchor", "middle")
	.text("Life Expectancy (Years)")
const timeLabel = g.append("text")
	.attr("y", HEIGHT - 10)
	.attr("x", WIDTH - 40)
	.attr("font-size", "40px")
	.attr("opacity", "0.4")
	.attr("text-anchor", "middle")
	.text("1800")

// X Axis
const xAxisCall = d3.axisBottom(x)
	.tickValues([400, 4000, 40000])
	.tickFormat(d3.format("$"));
g.append("g")
	.attr("class", "x axis")
	.attr("transform", `translate(0, ${HEIGHT})`)
	.call(xAxisCall)

// Y Axis
const yAxisCall = d3.axisLeft(y)
g.append("g")
	.attr("class", "y axis")
	.call(yAxisCall)

const continents = ["europe", "asia", "americas", "africa"]  /* Lab 5 Part 1 - Adding a Legend */

/* Lab 5 Part 1 - Adding a Legend */
const legend = g.append("g")
	.attr("transform", `translate(${WIDTH - 10}, ${HEIGHT - 125})`)

/* Lab 5 Part 1 - Adding a Legend */
continents.forEach((continent, i) => {
	const legendRow = legend.append("g")
		.attr("transform", `translate(0, ${i * 20})`)

	legendRow.append("rect")
    .attr("width", 10)
    .attr("height", 10)
		.attr("fill", continentColor(continent))

	legendRow.append("text")
    .attr("x", -10)
    .attr("y", 10)
    .attr("text-anchor", "end")
    .style("text-transform", "capitalize")
    .text(continent)
})

d3.json("data/data.json").then(function(data){
	// clean data
	const formattedData = data.map(year => {
		return year["countries"].filter(country => {
			const dataExists = (country.income && country.life_exp)
			return dataExists
		}).map(country => {
			country.income = Number(country.income)
			country.life_exp = Number(country.life_exp)
			return country
		})
	})

	// run the code every 0.1 second
	d3.interval(function(){
		// at the end of our data, loop back
		time = (time < 214) ? time + 1 : 0
		update(formattedData[time])
	}, 100)

	// first run of the visualization
	update(formattedData[0])
})

function update(data) {
	// standard transition time for the visualization
	const t = d3.transition()
		.duration(100)

	// JOIN new data with old elements.
	const circles = g.selectAll("circle")
		.data(data, d => d.country)

	// EXIT old elements not present in new data.
	circles.exit().remove()

	// ENTER new elements present in new data.
	circles.enter().append("circle")
		.attr("fill", d => continentColor(d.continent))
		.merge(circles)
		.transition(t)
			.attr("cy", d => y(d.life_exp))
			.attr("cx", d => x(d.income))
			.attr("r", d => Math.sqrt(area(d.population) / Math.PI))

	// update the time label
	timeLabel.text(String(time + 1800))
}
```

## 6.8 - Line graphs in D3 (Updated for D3 v7)

```js
/*
*    main.js
*    Mastering Data Visualization with D3.js
*    
*/

const MARGIN = { LEFT: 20, RIGHT: 100, TOP: 50, BOTTOM: 100 };
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3.select("#chart-area").append("svg")
    .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
    .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg.append("g")
    .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// Time parser for x-scale
const parseTime = d3.timeParse("%Y");
// For tooltip
const bisectDate = d3.bisector(d => d.year).left;

// Scales
const x = d3.scaleTime().range([0, WIDTH]);
const y = d3.scaleLinear().range([HEIGHT, 0]);

// Axis generators
const xAxisCall = d3.axisBottom();
const yAxisCall = d3.axisLeft()
    .ticks(6)
    .tickFormat(d => `${parseInt(d / 1000)}k`);

// Axis groups
const xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`);
const yAxis = g.append("g")
    .attr("class", "y axis");

// y-axis label
yAxis.append("text")
    .attr("class", "axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 6)
    .attr("dy", ".71em")
    .style("text-anchor", "end")
    .attr("fill", "#5D6971")
    .text("Population");

// Line path generator
const line = d3.line()
    .x(d => x(d.year))
    .y(d => y(d.value));

d3.json("data/example.json").then(data => {
    // Clean data
    data.forEach(d => {
        d.year = parseTime(d.year);
        d.value = Number(d.value);
    });

    // Set scale domains
    x.domain(d3.extent(data, d => d.year));
    y.domain([
        d3.min(data, d => d.value) / 1.005,
        d3.max(data, d => d.value) * 1.005
    ]);

    // Generate axes once scales have been set
    xAxis.call(xAxisCall.scale(x));
    yAxis.call(yAxisCall.scale(y));

    // Add line to chart
    g.append("path")
        .attr("class", "line")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", "3px")
        .attr("d", line(data));

    /******************************** Tooltip Code ********************************/

    const focus = g.append("g")
        .attr("class", "focus")
        .style("display", "none");

    focus.append("line")
        .attr("class", "x-hover-line hover-line")
        .attr("y1", 0)
        .attr("y2", HEIGHT);

    focus.append("line")
        .attr("class", "y-hover-line hover-line")
        .attr("x1", 0)
        .attr("x2", WIDTH);

    focus.append("circle")
        .attr("r", 7.5);

    focus.append("text")
        .attr("x", 15)
        .attr("dy", ".31em");

    g.append("rect")
        .attr("class", "overlay")
        .attr("width", WIDTH)
        .attr("height", HEIGHT)
        .on("mouseover", () => focus.style("display", null))
        .on("mouseout", () => focus.style("display", "none"))
        .on("mousemove", mousemove);

    function mousemove(event) {
        const x0 = x.invert(d3.pointer(event, this)[0]); // Updated for D3 v7
        const i = bisectDate(data, x0, 1);
        const d0 = data[i - 1];
        const d1 = data[i];
        const d = x0 - d0.year > d1.year - x0 ? d1 : d0;
        focus.attr("transform", `translate(${x(d.year)}, ${y(d.value)})`);
        focus.select("text").text(d.value);
        focus.select(".x-hover-line").attr("y2", HEIGHT - y(d.value));
        focus.select(".y-hover-line").attr("x2", -x(d.year));
    }
    
    /******************************** Tooltip Code ********************************/
});
```

## 10.2 - File Separation

```js
/*
 *    main.js
 *    Mastering Data Visualization with D3.js
 *    
 */

// time parsers/formatters
const parseTime1 = d3.timeParse("%d/%m/%Y");
const formatTime1 = d3.timeFormat("%d/%m/%Y");

// event listeners
$("#coin-select").on("change", update);
$("#var-select").on("change", update);

// add jQuery UI slider
$("#date-slider").slider({
  range: true,
  max: parseTime1("31/10/2017").getTime(),
  min: parseTime1("12/5/2013").getTime(),
  step: 86400000, // one day
  values: [
    parseTime1("12/5/2013").getTime(),
    parseTime1("31/10/2017").getTime(),
  ],
  slide: (event, ui) => {
    $("#dateLabel1").text(formatTime1(new Date(ui.values[0])));
    $("#dateLabel2").text(formatTime1(new Date(ui.values[1])));
    update();
  },
});

d3.json("data/coins.json").then((data) => {
  // prepare and clean data
  filteredData = {};
  Object.keys(data).forEach((coin) => {
    filteredData[coin] = data[coin]
      .filter((d) => {
        return !(d["price_usd"] == null);
      })
      .map((d) => {
        d["price_usd"] = Number(d["price_usd"]);
        d["24h_vol"] = Number(d["24h_vol"]);
        d["market_cap"] = Number(d["market_cap"]);
        d["date"] = parseTime1(d["date"]);
        return d;
      });
  });

  // run the visualization for the first time
  update();
});
```
### lineChart.js
```js

const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 };
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3
  .select("#chart-area")
  .append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg
  .append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

// time parsers/formatters
const parseTime = d3.timeParse("%d/%m/%Y");
const formatTime = d3.timeFormat("%d/%m/%Y");
// for tooltip
const bisectDate = d3.bisector((d) => d.date).left;

// add the line for the first time
g.append("path")
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "grey")
  .attr("stroke-width", "3px");

// axis labels
const xLabel = g
  .append("text")
  .attr("class", "x axisLabel")
  .attr("y", HEIGHT + 50)
  .attr("x", WIDTH / 2)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Time");
const yLabel = g
  .append("text")
  .attr("class", "y axisLabel")
  .attr("transform", "rotate(-90)")
  .attr("y", -60)
  .attr("x", -170)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Price ($)");

// scales
const x = d3.scaleTime().range([0, WIDTH]);
const y = d3.scaleLinear().range([HEIGHT, 0]);

// axis generators
const xAxisCall = d3.axisBottom();
const yAxisCall = d3
  .axisLeft()
  .ticks(6)
  .tickFormat((d) => `${parseInt(d / 1000)}k`);

// axis groups
const xAxis = g
  .append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`);
const yAxis = g.append("g").attr("class", "y axis");

function update() {
  const t = d3.transition().duration(1000);

  // filter data based on selections
  const coin = $("#coin-select").val();
  const yValue = $("#var-select").val();
  const sliderValues = $("#date-slider").slider("values");
  const dataTimeFiltered = filteredData[coin].filter((d) => {
    return d.date >= sliderValues[0] && d.date <= sliderValues[1];
  });

  // update scales
  x.domain(d3.extent(dataTimeFiltered, (d) => d.date));
  y.domain([
    d3.min(dataTimeFiltered, (d) => d[yValue]) / 1.005,
    d3.max(dataTimeFiltered, (d) => d[yValue]) * 1.005,
  ]);

  // fix for format values
  const formatSi = d3.format(".2s");
  function formatAbbreviation(x) {
    const s = formatSi(x);
    switch (s[s.length - 1]) {
      case "G":
        return s.slice(0, -1) + "B"; // billions
      case "k":
        return s.slice(0, -1) + "K"; // thousands
    }
    return s;
  }

  // update axes
  xAxisCall.scale(x);
  xAxis.transition(t).call(xAxisCall);
  yAxisCall.scale(y);
  yAxis.transition(t).call(yAxisCall.tickFormat(formatAbbreviation));

  // clear old tooltips
  d3.select(".focus").remove();
  d3.select(".overlay").remove();

  /******************************** Tooltip Code ********************************/

  const focus = g.append("g").attr("class", "focus").style("display", "none");

  focus
    .append("line")
    .attr("class", "x-hover-line hover-line")
    .attr("y1", 0)
    .attr("y2", HEIGHT);

  focus
    .append("line")
    .attr("class", "y-hover-line hover-line")
    .attr("x1", 0)
    .attr("x2", WIDTH);

  focus.append("circle").attr("r", 7.5);

  focus.append("text").attr("x", 15).attr("dy", ".31em");

  g.append("rect")
    .attr("class", "overlay")
    .attr("width", WIDTH)
    .attr("height", HEIGHT)
    .on("mouseover", () => focus.style("display", null))
    .on("mouseout", () => focus.style("display", "none"))
    .on("mousemove", mousemove);

    // function mousemove() {
    //   const x0 = x.invert(d3.mouse(this)[0]);
    //   const i = bisectDate(dataTimeFiltered, x0, 1);
    //   const d0 = dataTimeFiltered[i - 1];
    //   const d1 = dataTimeFiltered[i];
    //   const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    //   focus.attr("transform", `translate(${x(d.date)}, ${y(d[yValue])})`);
    //   focus.select("text").text(d[yValue]);
    //   focus.select(".x-hover-line").attr("y2", HEIGHT - y(d[yValue]));
    //   focus.select(".y-hover-line").attr("x2", -x(d.date));
    // }

  function mousemove(event) {
    const [mx] = d3.pointer(event);
    const x0 = x.invert(mx);
    const i = bisectDate(dataTimeFiltered, x0, 1);
    const d0 = dataTimeFiltered[i - 1];
    const d1 = dataTimeFiltered[i];
    const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    focus.attr("transform", `translate(${x(d.date)}, ${y(d[yValue])})`);
    focus.select("text").text(d[yValue]);
    focus.select(".x-hover-line").attr("y2", HEIGHT - y(d[yValue]));
    focus.select(".y-hover-line").attr("x2", -x(d.date));
  }

  /******************************** Tooltip Code ********************************/

  // Path generator
  line = d3
    .line()
    .x((d) => x(d.date))
    .y((d) => y(d[yValue]));

  // Update our line path
  g.select(".line").transition(t).attr("d", line(dataTimeFiltered));

  // Update y-axis label
  const newText =
    yValue === "price_usd"
      ? "Price ($)"
      : yValue === "market_cap"
      ? "Market Capitalization ($)"
      : "24 Hour Trading Volume ($)";
  yLabel.text(newText);
}
```

## 10.4 - Converting our code to OOP

```js
/*
*    main.js
*    Mastering Data Visualization with D3.js
*    
*/

let lineChart1
let lineChart2
let lineChart3
let lineChart4
let lineChart5

// time parsers/formatters
const parseTime = d3.timeParse("%d/%m/%Y")
const formatTime = d3.timeFormat("%d/%m/%Y")

// event listeners
$("#coin-select").on("change", updateCharts)
$("#var-select").on("change", updateCharts)

// add jQuery UI slider
$("#date-slider").slider({
	range: true,
	max: parseTime("31/10/2017").getTime(),
	min: parseTime("12/5/2013").getTime(),
	step: 86400000, // one day
	values: [
		parseTime("12/5/2013").getTime(),
		parseTime("31/10/2017").getTime()
	],
	slide: (event, ui) => {
		$("#dateLabel1").text(formatTime(new Date(ui.values[0])))
		$("#dateLabel2").text(formatTime(new Date(ui.values[1])))
		updateCharts()
	}
})

d3.json("data/coins.json").then(data => {
	// prepare and clean data
	filteredData = {}
	Object.keys(data).forEach(coin => {
		filteredData[coin] = data[coin]
			.filter(d => {
				return !(d["price_usd"] == null)
			}).map(d => {
				d["price_usd"] = Number(d["price_usd"])
				d["24h_vol"] = Number(d["24h_vol"])
				d["market_cap"] = Number(d["market_cap"])
				d["date"] = parseTime(d["date"])
				return d
			})
	})

	lineChart1 = new LineChart("#chart-area1", "bitcoin")
	lineChart2 = new LineChart("#chart-area2", "ethereum")
	lineChart3 = new LineChart("#chart-area3", "bitcoin_cash")
	lineChart4 = new LineChart("#chart-area4", "litecoin")
	lineChart5 = new LineChart("#chart-area5", "ripple")
})

function updateCharts(){
	lineChart1.wrangleData()
	lineChart2.wrangleData()
	lineChart3.wrangleData()
	lineChart4.wrangleData()
	lineChart5.wrangleData()
}
```
### lineChart.js
```js
/*
 *    lineChart.js
 *    Mastering Data Visualization with D3.js
 *    10.4 - Converting our code to OOP
 */

class LineChart {
  // constructor function - make a new visualization object.
  constructor(_parentElement, _coin) {
    this.parentElement = _parentElement;
    this.coin = _coin;

    this.initVis();
  }

  // initVis method - set up static parts of our visualization.
  initVis() {
    const vis = this;

    vis.MARGIN = { LEFT: 50, RIGHT: 20, TOP: 50, BOTTOM: 50 };
    vis.WIDTH = 350 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT;
    vis.HEIGHT = 250 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM;

    vis.svg = d3
      .select(vis.parentElement)
      .append("svg")
      .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
      .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM);

    vis.g = vis.svg
      .append("g")
      .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`);

    // time parsers/formatters
    vis.parseTime = d3.timeParse("%d/%m/%Y");
    vis.formatTime = d3.timeFormat("%d/%m/%Y");
    // for tooltip
    vis.bisectDate = d3.bisector((d) => d.date).left;

    // add the line for the first time
    vis.g
      .append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", "3px");

    // axis labels
    vis.xLabel = vis.g
      .append("text")
      .attr("class", "x axisLabel")
      .attr("y", vis.HEIGHT + 50)
      .attr("x", vis.WIDTH / 2)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text(vis.coin);
    vis.yLabel = vis.g
      .append("text")
      .attr("class", "y axisLabel")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -170)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Price ($)");

    // scales
    vis.x = d3.scaleTime().range([0, vis.WIDTH]);
    vis.y = d3.scaleLinear().range([vis.HEIGHT, 0]);

    // axis generators
    vis.xAxisCall = d3.axisBottom().ticks(3);
    vis.yAxisCall = d3
      .axisLeft()
      .ticks(6)
      .tickFormat((d) => `${parseInt(d / 1000)}k`);

    // axis groups
    vis.xAxis = vis.g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${vis.HEIGHT})`);
    vis.yAxis = vis.g.append("g").attr("class", "y axis");

    vis.wrangleData();
  }

  // wrangleData method - selecting/filtering the data that we want to use.
  wrangleData() {
    const vis = this;

    // filter data based on selections
    vis.yValue = $("#var-select").val();
    vis.sliderValues = $("#date-slider").slider("values");
    vis.dataTimeFiltered = filteredData[vis.coin].filter((d) => {
      return d.date >= vis.sliderValues[0] && d.date <= vis.sliderValues[1];
    });

    vis.updateVis();
  }

  // updateVis method - updating our elements to match the new data.
  updateVis() {
    const vis = this;

    vis.t = d3.transition().duration(1000);

    // update scales
    vis.x.domain(d3.extent(vis.dataTimeFiltered, (d) => d.date));
    vis.y.domain([
      d3.min(vis.dataTimeFiltered, (d) => d[vis.yValue]) / 1.005,
      d3.max(vis.dataTimeFiltered, (d) => d[vis.yValue]) * 1.005,
    ]);

    // fix for format values
    const formatSi = d3.format(".2s");
    function formatAbbreviation(x) {
      const s = formatSi(x);
      switch (s[s.length - 1]) {
        case "G":
          return s.slice(0, -1) + "B"; // billions
        case "k":
          return s.slice(0, -1) + "K"; // thousands
      }
      return s;
    }

    // update axes
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t).call(vis.xAxisCall);
    vis.yAxisCall.scale(vis.y);
    vis.yAxis
      .transition(vis.t)
      .call(vis.yAxisCall.tickFormat(formatAbbreviation));

    // clear old tooltips
    vis.g.select(".focus").remove();
    vis.g.select(".overlay").remove();

    /******************************** Tooltip Code ********************************/

    vis.focus = vis.g
      .append("g")
      .attr("class", "focus")
      .style("display", "none");

    vis.focus
      .append("line")
      .attr("class", "x-hover-line hover-line")
      .attr("y1", 0)
      .attr("y2", vis.HEIGHT);

    vis.focus
      .append("line")
      .attr("class", "y-hover-line hover-line")
      .attr("x1", 0)
      .attr("x2", vis.WIDTH);

    vis.focus.append("circle").attr("r", 7.5);

    vis.focus.append("text").attr("x", 15).attr("dy", ".31em");

    vis.g
      .append("rect")
      .attr("class", "overlay")
      .attr("width", vis.WIDTH)
      .attr("height", vis.HEIGHT)
      .on("mouseover", () => vis.focus.style("display", null))
      .on("mouseout", () => vis.focus.style("display", "none"))
      .on("mousemove", mousemove);

    // function mousemove() {
    //   const x0 = vis.x.invert(d3.mouse(this)[0]);
    //   const i = vis.bisectDate(vis.dataTimeFiltered, x0, 1);
    //   const d0 = vis.dataTimeFiltered[i - 1];
    //   const d1 = vis.dataTimeFiltered[i];
    //   const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
    //   vis.focus.attr(
    //     "transform",
    //     `translate(${vis.x(d.date)}, ${vis.y(d[vis.yValue])})`
    //   );
    //   vis.focus.select("text").text(d[vis.yValue]);
    //   vis.focus
    //     .select(".x-hover-line")
    //     .attr("y2", vis.HEIGHT - vis.y(d[vis.yValue]));
    //   vis.focus.select(".y-hover-line").attr("x2", -vis.x(d.date));
    // }

    function mousemove(event) {
      const [mx] = d3.pointer(event);
      const x0 = vis.x.invert(mx);
      const i = vis.bisectDate(vis.dataTimeFiltered, x0, 1);
      const d0 = vis.dataTimeFiltered[i - 1];
      const d1 = vis.dataTimeFiltered[i];
      const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      vis.focus.attr(
        "transform",
        `translate(${vis.x(d.date)}, ${vis.y(d[vis.yValue])})`
      );
      vis.focus.select("text").text(d[vis.yValue]);
      vis.focus
        .select(".x-hover-line")
        .attr("y2", vis.HEIGHT - vis.y(d[vis.yValue]));
      vis.focus.select(".y-hover-line").attr("x2", -vis.x(d.date));
    }

    /******************************** Tooltip Code ********************************/

    // Path generator
    vis.line = d3
      .line()
      .x((d) => vis.x(d.date))
      .y((d) => vis.y(d[vis.yValue]));

    // Update our line path
    vis.g
      .select(".line")
      .transition(vis.t)
      .attr("d", vis.line(vis.dataTimeFiltered));

    // Update y-axis label
    const newText =
      vis.yValue === "price_usd"
        ? "Price ($)"
        : vis.yValue === "market_cap"
        ? "Market Capitalization ($)"
        : "24 Hour Trading Volume ($)";
    vis.yLabel.text(newText);
  }
}
```

## 10.5 - Handling events across objects
```js
let lineChart
let donutChart1
let donutChart2
let filteredData = {}
let donutData = []
const color = d3.scaleOrdinal(d3.schemePastel1)

// time parsers/formatters
const parseTime = d3.timeParse("%d/%m/%Y")
const formatTime = d3.timeFormat("%d/%m/%Y")

// event listeners
$("#coin-select").on("change", updateCharts)
$("#var-select").on("change", updateCharts)

// add jQuery UI slider
$("#date-slider").slider({
	range: true,
	max: parseTime("31/10/2017").getTime(),
	min: parseTime("12/5/2013").getTime(),
	step: 86400000, // one day
	values: [
		parseTime("12/5/2013").getTime(),
		parseTime("31/10/2017").getTime()
	],
	slide: (event, ui) => {
		$("#dateLabel1").text(formatTime(new Date(ui.values[0])))
		$("#dateLabel2").text(formatTime(new Date(ui.values[1])))
		updateCharts()
	}
})

d3.json("data/coins.json").then(data => {
	// prepare and clean data
	Object.keys(data).forEach(coin => {
		filteredData[coin] = data[coin]
			.filter(d => {
				return !(d["price_usd"] == null)
			}).map(d => {
				d["price_usd"] = Number(d["price_usd"])
				d["24h_vol"] = Number(d["24h_vol"])
				d["market_cap"] = Number(d["market_cap"])
				d["date"] = parseTime(d["date"])
				return d
			})
		donutData.push({
			"coin": coin,
			"data": filteredData[coin].slice(-1)[0]
		})
	})

	lineChart = new LineChart("#line-area")
	donutChart1 = new DonutChart("#donut-area1", "24h_vol")
	donutChart2 = new DonutChart("#donut-area2", "market_cap")
})

function arcClicked(arc) {
	$("#coin-select").val(arc.data.coin)
	updateCharts()
}

function updateCharts(){
	lineChart.wrangleData()
	donutChart1.wrangleData()
	donutChart2.wrangleData()
}
```

### lineChart.js
```js

class LineChart {
  // constructor function - make a new visualization object.
  constructor(_parentElement) {
    this.parentElement = _parentElement;

    this.initVis();
  }

  // initVis method - set up static parts of our visualization.
  initVis() {
    const vis = this;

    vis.MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 };
    vis.WIDTH = 800 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT;
    vis.HEIGHT = 500 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM;

    vis.svg = d3
      .select(vis.parentElement)
      .append("svg")
      .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
      .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM);

    vis.g = vis.svg
      .append("g")
      .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`);

    // time parsers/formatters
    vis.parseTime = d3.timeParse("%d/%m/%Y");
    vis.formatTime = d3.timeFormat("%d/%m/%Y");
    // for tooltip
    vis.bisectDate = d3.bisector((d) => d.date).left;

    // add the line for the first time
    vis.g
      .append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", "3px");

    // axis labels
    vis.xLabel = vis.g
      .append("text")
      .attr("class", "x axisLabel")
      .attr("y", vis.HEIGHT + 50)
      .attr("x", vis.WIDTH / 2)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text(vis.coin);
    vis.yLabel = vis.g
      .append("text")
      .attr("class", "y axisLabel")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -170)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Price ($)");

    // scales
    vis.x = d3.scaleTime().range([0, vis.WIDTH]);
    vis.y = d3.scaleLinear().range([vis.HEIGHT, 0]);

    // axis generators
    vis.xAxisCall = d3.axisBottom().ticks(5);
    vis.yAxisCall = d3
      .axisLeft()
      .ticks(6)
      .tickFormat((d) => `${parseInt(d / 1000)}k`);

    // axis groups
    vis.xAxis = vis.g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${vis.HEIGHT})`);
    vis.yAxis = vis.g.append("g").attr("class", "y axis");

    vis.wrangleData();
  }

  // wrangleData method - selecting/filtering the data that we want to use.
  wrangleData() {
    const vis = this;

    // filter data based on selections
    vis.coin = $("#coin-select").val();
    vis.yValue = $("#var-select").val();
    vis.sliderValues = $("#date-slider").slider("values");
    vis.dataTimeFiltered = filteredData[vis.coin].filter((d) => {
      return d.date >= vis.sliderValues[0] && d.date <= vis.sliderValues[1];
    });

    vis.updateVis();
  }

  // updateVis method - updating our elements to match the new data.
  updateVis() {
    const vis = this;

    vis.t = d3.transition().duration(1000);

    // update scales
    vis.x.domain(d3.extent(vis.dataTimeFiltered, (d) => d.date));
    vis.y.domain([
      d3.min(vis.dataTimeFiltered, (d) => d[vis.yValue]) / 1.005,
      d3.max(vis.dataTimeFiltered, (d) => d[vis.yValue]) * 1.005,
    ]);

    // fix for format values
    const formatSi = d3.format(".2s");
    function formatAbbreviation(x) {
      const s = formatSi(x);
      switch (s[s.length - 1]) {
        case "G":
          return s.slice(0, -1) + "B"; // billions
        case "k":
          return s.slice(0, -1) + "K"; // thousands
      }
      return s;
    }

    // update axes
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t).call(vis.xAxisCall);
    vis.yAxisCall.scale(vis.y);
    vis.yAxis
      .transition(vis.t)
      .call(vis.yAxisCall.tickFormat(formatAbbreviation));

    // clear old tooltips
    vis.g.select(".focus").remove();
    vis.g.select(".overlay").remove();

    /******************************** Tooltip Code ********************************/

    vis.focus = vis.g
      .append("g")
      .attr("class", "focus")
      .style("display", "none");

    vis.focus
      .append("line")
      .attr("class", "x-hover-line hover-line")
      .attr("y1", 0)
      .attr("y2", vis.HEIGHT);

    vis.focus
      .append("line")
      .attr("class", "y-hover-line hover-line")
      .attr("x1", 0)
      .attr("x2", vis.WIDTH);

    vis.focus.append("circle").attr("r", 7.5);

    vis.focus.append("text").attr("x", 15).attr("dy", ".31em");

    vis.g
      .append("rect")
      .attr("class", "overlay")
      .attr("width", vis.WIDTH)
      .attr("height", vis.HEIGHT)
      .on("mouseover", () => vis.focus.style("display", null))
      .on("mouseout", () => vis.focus.style("display", "none"))
      .on("mousemove", mousemove);

    function mousemove(event) {
      const [mx] = d3.pointer(event, this);
      const x0 = vis.x.invert(mx);
      const i = vis.bisectDate(vis.dataTimeFiltered, x0, 1);
      const d0 = vis.dataTimeFiltered[i - 1];
      const d1 = vis.dataTimeFiltered[i];
      const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      vis.focus.attr(
        "transform",
        `translate(${vis.x(d.date)}, ${vis.y(d[vis.yValue])})`
      );
      vis.focus.select("text").text(d[vis.yValue]);
      vis.focus
        .select(".x-hover-line")
        .attr("y2", vis.HEIGHT - vis.y(d[vis.yValue]));
      vis.focus.select(".y-hover-line").attr("x2", -vis.x(d.date));
    }

    /******************************** Tooltip Code ********************************/

    // Path generator
    vis.line = d3
      .line()
      .x((d) => vis.x(d.date))
      .y((d) => vis.y(d[vis.yValue]));

    // Update our line path
    vis.g
      .select(".line")
      .attr("stroke", color(vis.coin))
      .transition(vis.t)
      .attr("d", vis.line(vis.dataTimeFiltered));

    // Update y-axis label
    const newText =
      vis.yValue === "price_usd"
        ? "Price ($)"
        : vis.yValue === "market_cap"
        ? "Market Capitalization ($)"
        : "24 Hour Trading Volume ($)";
    vis.yLabel.text(newText);
  }
}
```
### donutChart
```js
class DonutChart {
	constructor(_parentElement, _variable) {
		this.parentElement = _parentElement
		this.variable = _variable

		this.initVis()
	}

	initVis() {
    const vis = this

		vis.MARGIN = { LEFT: 0, RIGHT: 0, TOP: 40, BOTTOM: 0 }
		vis.WIDTH = 250 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT
    vis.HEIGHT = 250 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM
    vis.RADIUS = Math.min(vis.WIDTH, vis.HEIGHT) / 2
		
		vis.svg = d3.select(vis.parentElement).append("svg")
			.attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
			.attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM)
		
		vis.g = vis.svg.append("g")
      .attr("transform", `translate(${vis.MARGIN.LEFT + (vis.WIDTH / 2)},
        ${vis.MARGIN.TOP + (vis.HEIGHT / 2)})`)
    
    vis.pie = d3.pie()
      .padAngle(0.03)
      .value(d => d.data[vis.variable])
      .sort(null)
    
    vis.arc = d3.arc()
      .innerRadius(vis.RADIUS - 60)
      .outerRadius(vis.RADIUS - 30)

    vis.g.append("text")
      .attr("y", -(vis.HEIGHT / 2))
      .attr("x", -(vis.WIDTH / 2))
      .attr("font-size", "15px")
      .attr("text-anchor", "start")
      .text(vis.variable == "market_cap" ? "Market Capitalization" 
        : "24 Hour Trading Volume")

		vis.wrangleData()
	}

	wrangleData() {
		const vis = this

    vis.activeCoin = $("#coin-select").val()

		vis.updateVis()
	}

	updateVis() {
    const vis = this

    vis.t = d3.transition().duration(750)
    vis.path = vis.g.selectAll("path")
    vis.data0 = vis.path.data()
    vis.data1 = vis.pie(donutData)
  
    // JOIN elements with new data.
    vis.path = vis.path.data(vis.data1, key)
  
    // EXIT old elements from the screen.
    vis.path.exit()
      .datum((d, i) => findNeighborArc(i, vis.data1, vis.data0, key) || d)
      .transition(vis.t)
        .attrTween("d", arcTween)
        .remove()
    
    // UPDATE elements still on the screen.
    vis.path.transition(vis.t)
      .attrTween("d", arcTween)
      .attr("fill-opacity", (d) => (d.data.coin === vis.activeCoin) ? 1 : 0.3)
  
    // ENTER new elements in the array.
    vis.path.enter().append("path")
      .each(function(d, i) { this._current = findNeighborArc(i, vis.data0, vis.data1, key) || d }) 
      .attr("fill", d => color(d.data.coin))
      .attr("fill-opacity", (d) => (d.data.coin === vis.activeCoin) ? 1 : 0.3)
      .on("click", arcClicked)
      .transition(vis.t)
        .attrTween("d", arcTween)
  
    function key(d) {
      return d.data.coin
    }
  
    function findNeighborArc(i, data0, data1, key) {
      let d
      return (d = findPreceding(i, data0, data1, key)) ? {startAngle: d.endAngle, endAngle: d.endAngle}
        : (d = findFollowing(i, data0, data1, key)) ? {startAngle: d.startAngle, endAngle: d.startAngle}
        : null
    }
  
    function findPreceding(i, data0, data1, key) {
      const m = data0.length
      while (--i >= 0) {
        const k = key(data1[i])
        for (let j = 0; j < m; ++j) {
          if (key(data0[j]) === k) return data0[j]
        }
      }
    }
  
    function findFollowing(i, data0, data1, key) {
      const n = data1.length
      const m = data0.length
      while (++i < n) {
        const k = key(data1[i])
        for (let j = 0; j < m; ++j) {
          if (key(data0[j]) === k) return data0[j]
        }
      }
    }
  
    function arcTween(d) {
      const i = d3.interpolate(this._current, d)
      this._current = i(1)
      return (t) => vis.arc(i(t))
    }
	}
}
```

## 10.6 - D3 Brushes

```js
// global variables
let lineChart;
let donutChart1;
let donutChart2;
let timeline;
let filteredData = {};
let donutData = [];
const color = d3.scaleOrdinal(d3.schemePastel1);

// time parsers/formatters
const parseTime = d3.timeParse("%d/%m/%Y");
const formatTime = d3.timeFormat("%d/%m/%Y");

// event listeners
$("#coin-select").on("change", updateCharts);
$("#var-select").on("change", updateCharts);

// add jQuery UI slider
$("#date-slider").slider({
  range: true,
  max: parseTime("31/10/2017").getTime(),
  min: parseTime("12/5/2013").getTime(),
  step: 86400000, // one day
  values: [parseTime("12/5/2013").getTime(), parseTime("31/10/2017").getTime()],
  slide: (event, ui) => {
    const dates = ui.values.map((val) => new Date(val));
    const xVals = dates.map((date) => timeline.x(date));

    timeline.brushComponent.call(timeline.brush.move, xVals);
  },
});

d3.json("data/coins.json").then((data) => {
  // prepare and clean data
  Object.keys(data).forEach((coin) => {
    filteredData[coin] = data[coin]
      .filter((d) => {
        return !(d["price_usd"] == null);
      })
      .map((d) => {
        d["price_usd"] = Number(d["price_usd"]);
        d["24h_vol"] = Number(d["24h_vol"]);
        d["market_cap"] = Number(d["market_cap"]);
        d["date"] = parseTime(d["date"]);
        return d;
      });
    donutData.push({
      coin: coin,
      data: filteredData[coin].slice(-1)[0],
    });
  });

  lineChart = new LineChart("#line-area");
  donutChart1 = new DonutChart("#donut-area1", "24h_vol");
  donutChart2 = new DonutChart("#donut-area2", "market_cap");
  timeline = new Timeline("#timeline-area");
});

function brushed({ selection }) {
  const newValues = selection.map(timeline.x.invert);

  $("#date-slider")
    .slider("values", 0, newValues[0])
    .slider("values", 1, newValues[1]);
  $("#dateLabel1").text(formatTime(newValues[0]));
  $("#dateLabel2").text(formatTime(newValues[1]));

  lineChart.wrangleData();
}

function arcClicked(arc) {
  $("#coin-select").val(arc.data.coin);
  updateCharts();
}

function updateCharts() {
  lineChart.wrangleData();
  donutChart1.wrangleData();
  donutChart2.wrangleData();
  timeline.wrangleData();
}
```

### lineChart.js

```js
class LineChart {
  // constructor function - make a new visualization object.
  constructor(_parentElement) {
    this.parentElement = _parentElement;

    this.initVis();
  }

  // initVis method - set up static parts of our visualization.
  initVis() {
    const vis = this;

    vis.MARGIN = { LEFT: 100, RIGHT: 100, TOP: 30, BOTTOM: 30 };
    vis.WIDTH = 800 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT;
    vis.HEIGHT = 350 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM;

    vis.svg = d3
      .select(vis.parentElement)
      .append("svg")
      .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
      .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM);

    vis.g = vis.svg
      .append("g")
      .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`);

    // time parsers/formatters
    vis.parseTime = d3.timeParse("%d/%m/%Y");
    vis.formatTime = d3.timeFormat("%d/%m/%Y");
    // for tooltip
    vis.bisectDate = d3.bisector((d) => d.date).left;

    // add the line for the first time
    vis.g
      .append("path")
      .attr("class", "line")
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", "3px");

    vis.yLabel = vis.g
      .append("text")
      .attr("class", "y axisLabel")
      .attr("transform", "rotate(-90)")
      .attr("y", -60)
      .attr("x", -170)
      .attr("font-size", "20px")
      .attr("text-anchor", "middle")
      .text("Price ($)");

    // scales
    vis.x = d3.scaleTime().range([0, vis.WIDTH]);
    vis.y = d3.scaleLinear().range([vis.HEIGHT, 0]);

    // axis generators
    vis.xAxisCall = d3.axisBottom().ticks(5);
    vis.yAxisCall = d3
      .axisLeft()
      .ticks(6)
      .tickFormat((d) => `${parseInt(d / 1000)}k`);

    // axis groups
    vis.xAxis = vis.g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${vis.HEIGHT})`);
    vis.yAxis = vis.g.append("g").attr("class", "y axis");

    vis.wrangleData();
  }

  // wrangleData method - selecting/filtering the data that we want to use.
  wrangleData() {
    const vis = this;

    // filter data based on selections
    vis.coin = $("#coin-select").val();
    vis.yValue = $("#var-select").val();
    vis.sliderValues = $("#date-slider").slider("values");
    vis.dataTimeFiltered = filteredData[vis.coin].filter((d) => {
      return d.date >= vis.sliderValues[0] && d.date <= vis.sliderValues[1];
    });

    vis.updateVis();
  }

  // updateVis method - updating our elements to match the new data.
  updateVis() {
    const vis = this;

    vis.t = d3.transition().duration(1000);

    // update scales
    vis.x.domain(d3.extent(vis.dataTimeFiltered, (d) => d.date));
    vis.y.domain([
      d3.min(vis.dataTimeFiltered, (d) => d[vis.yValue]) / 1.005,
      d3.max(vis.dataTimeFiltered, (d) => d[vis.yValue]) * 1.005,
    ]);

    // fix for format values
    const formatSi = d3.format(".2s");
    function formatAbbreviation(x) {
      const s = formatSi(x);
      switch (s[s.length - 1]) {
        case "G":
          return s.slice(0, -1) + "B"; // billions
        case "k":
          return s.slice(0, -1) + "K"; // thousands
      }
      return s;
    }

    // update axes
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t).call(vis.xAxisCall);
    vis.yAxisCall.scale(vis.y);
    vis.yAxis
      .transition(vis.t)
      .call(vis.yAxisCall.tickFormat(formatAbbreviation));

    // clear old tooltips
    vis.g.select(".focus").remove();
    vis.g.select(".overlay").remove();

    /******************************** Tooltip Code ********************************/

    vis.focus = vis.g
      .append("g")
      .attr("class", "focus")
      .style("display", "none");

    vis.focus
      .append("line")
      .attr("class", "x-hover-line hover-line")
      .attr("y1", 0)
      .attr("y2", vis.HEIGHT);

    vis.focus
      .append("line")
      .attr("class", "y-hover-line hover-line")
      .attr("x1", 0)
      .attr("x2", vis.WIDTH);

    vis.focus.append("circle").attr("r", 7.5);

    vis.focus.append("text").attr("x", 15).attr("dy", ".31em");

    vis.g
      .append("rect")
      .attr("class", "overlay")
      .attr("width", vis.WIDTH)
      .attr("height", vis.HEIGHT)
      .on("mouseover", () => vis.focus.style("display", null))
      .on("mouseout", () => vis.focus.style("display", "none"))
      .on("mousemove", mousemove);

    function mousemove(event) {
      const [mx] = d3.pointer(event, this);
      const x0 = vis.x.invert(mx);
      const i = vis.bisectDate(vis.dataTimeFiltered, x0, 1);
      const d0 = vis.dataTimeFiltered[i - 1];
      const d1 = vis.dataTimeFiltered[i];
      const d = x0 - d0.date > d1.date - x0 ? d1 : d0;
      vis.focus.attr(
        "transform",
        `translate(${vis.x(d.date)}, ${vis.y(d[vis.yValue])})`
      );
      vis.focus.select("text").text(d[vis.yValue]);
      vis.focus
        .select(".x-hover-line")
        .attr("y2", vis.HEIGHT - vis.y(d[vis.yValue]));
      vis.focus.select(".y-hover-line").attr("x2", -vis.x(d.date));
    }

    /******************************** Tooltip Code ********************************/

    // Path generator
    vis.line = d3
      .line()
      .x((d) => vis.x(d.date))
      .y((d) => vis.y(d[vis.yValue]));

    // Update our line path
    vis.g
      .select(".line")
      .attr("stroke", color(vis.coin))
      .transition(vis.t)
      .attr("d", vis.line(vis.dataTimeFiltered));

    // Update y-axis label
    const newText =
      vis.yValue === "price_usd"
        ? "Price ($)"
        : vis.yValue === "market_cap"
        ? "Market Capitalization ($)"
        : "24 Hour Trading Volume ($)";
    vis.yLabel.text(newText);
  }
}
```

### donutChart.js

```js
class DonutChart {
  constructor(_parentElement, _variable) {
    this.parentElement = _parentElement;
    this.variable = _variable;

    this.initVis();
  }

  initVis() {
    const vis = this;

    vis.MARGIN = { LEFT: 0, RIGHT: 0, TOP: 40, BOTTOM: 0 };
    vis.WIDTH = 250 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT;
    vis.HEIGHT = 250 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM;
    vis.RADIUS = Math.min(vis.WIDTH, vis.HEIGHT) / 2;

    vis.svg = d3
      .select(vis.parentElement)
      .append("svg")
      .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
      .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM);

    vis.g = vis.svg.append("g").attr(
      "transform",
      `translate(${vis.MARGIN.LEFT + vis.WIDTH / 2},
        ${vis.MARGIN.TOP + vis.HEIGHT / 2})`
    );

    vis.pie = d3
      .pie()
      .padAngle(0.03)
      .value((d) => d.data[vis.variable])
      .sort(null);

    vis.arc = d3
      .arc()
      .innerRadius(vis.RADIUS - 60)
      .outerRadius(vis.RADIUS - 30);

    vis.g
      .append("text")
      .attr("y", -(vis.HEIGHT / 2))
      .attr("x", -(vis.WIDTH / 2))
      .attr("font-size", "15px")
      .attr("text-anchor", "start")
      .text(
        vis.variable == "market_cap"
          ? "Market Capitalization"
          : "24 Hour Trading Volume"
      );

    vis.wrangleData();
  }

  wrangleData() {
    const vis = this;

    vis.activeCoin = $("#coin-select").val();

    vis.updateVis();
  }

  updateVis() {
    const vis = this;

    vis.t = d3.transition().duration(750);
    vis.path = vis.g.selectAll("path");
    vis.data0 = vis.path.data();
    vis.data1 = vis.pie(donutData);

    // JOIN elements with new data.
    vis.path = vis.path.data(vis.data1, key);

    // EXIT old elements from the screen.
    vis.path
      .exit()
      .datum((d, i) => findNeighborArc(i, vis.data1, vis.data0, key) || d)
      .transition(vis.t)
      .attrTween("d", arcTween)
      .remove();

    // UPDATE elements still on the screen.
    vis.path
      .transition(vis.t)
      .attrTween("d", arcTween)
      .attr("fill-opacity", (d) => (d.data.coin === vis.activeCoin ? 1 : 0.3));

    // ENTER new elements in the array.
    vis.path
      .enter()
      .append("path")
      .each(function (d, i) {
        this._current = findNeighborArc(i, vis.data0, vis.data1, key) || d;
      })
      .attr("fill", (d) => color(d.data.coin))
      .attr("fill-opacity", (d) => (d.data.coin === vis.activeCoin ? 1 : 0.3))
      .on("click", arcClicked)
      .transition(vis.t)
      .attrTween("d", arcTween);

    function key(d) {
      return d.data.coin;
    }

    function findNeighborArc(i, data0, data1, key) {
      let d;
      return (d = findPreceding(i, data0, data1, key))
        ? { startAngle: d.endAngle, endAngle: d.endAngle }
        : (d = findFollowing(i, data0, data1, key))
        ? { startAngle: d.startAngle, endAngle: d.startAngle }
        : null;
    }

    function findPreceding(i, data0, data1, key) {
      const m = data0.length;
      while (--i >= 0) {
        const k = key(data1[i]);
        for (let j = 0; j < m; ++j) {
          if (key(data0[j]) === k) return data0[j];
        }
      }
    }

    function findFollowing(i, data0, data1, key) {
      const n = data1.length;
      const m = data0.length;
      while (++i < n) {
        const k = key(data1[i]);
        for (let j = 0; j < m; ++j) {
          if (key(data0[j]) === k) return data0[j];
        }
      }
    }

    function arcTween(d) {
      const i = d3.interpolate(this._current, d);
      this._current = i(1);
      return (t) => vis.arc(i(t));
    }
  }
}
```

### timeline.js

```js
/*
 *    timeline.js
 *    Mastering Data Visualization with D3.js
 *    10.6 - D3 Brushes
 */

class Timeline {
  constructor(_parentElement) {
    this.parentElement = _parentElement;

    this.initVis();
  }

  initVis() {
    const vis = this;

    vis.MARGIN = { LEFT: 80, RIGHT: 100, TOP: 0, BOTTOM: 30 };
    vis.WIDTH = 800 - vis.MARGIN.LEFT - vis.MARGIN.RIGHT;
    vis.HEIGHT = 130 - vis.MARGIN.TOP - vis.MARGIN.BOTTOM;

    vis.svg = d3
      .select(vis.parentElement)
      .append("svg")
      .attr("width", vis.WIDTH + vis.MARGIN.LEFT + vis.MARGIN.RIGHT)
      .attr("height", vis.HEIGHT + vis.MARGIN.TOP + vis.MARGIN.BOTTOM);

    vis.g = vis.svg
      .append("g")
      .attr("transform", `translate(${vis.MARGIN.LEFT}, ${vis.MARGIN.TOP})`);

    // scales
    vis.x = d3.scaleTime().range([0, vis.WIDTH]);
    vis.y = d3.scaleLinear().range([vis.HEIGHT, 0]);

    // x-axis
    vis.xAxisCall = d3.axisBottom().ticks(4);
    vis.xAxis = vis.g
      .append("g")
      .attr("class", "x axis")
      .attr("transform", `translate(0, ${vis.HEIGHT})`);

    vis.areaPath = vis.g.append("path").attr("fill", "#ccc");

    // initialize brush component
    vis.brush = d3
      .brushX()
      .handleSize(10)
      .extent([
        [0, 0],
        [vis.WIDTH, vis.HEIGHT],
      ])
      .on("brush", brushed);

    // append brush component
    vis.brushComponent = vis.g
      .append("g")
      .attr("class", "brush")
      .call(vis.brush);

    vis.wrangleData();
  }

  wrangleData() {
    const vis = this;

    vis.coin = $("#coin-select").val();
    vis.yValue = $("#var-select").val();
    vis.data = filteredData[vis.coin];

    vis.updateVis();
  }

  updateVis() {
    const vis = this;

    vis.t = d3.transition().duration(1000);

    // update scales
    vis.x.domain(d3.extent(vis.data, (d) => d.date));
    vis.y.domain([0, d3.max(vis.data, (d) => d[vis.yValue]) * 1.005]);

    // update axes
    vis.xAxisCall.scale(vis.x);
    vis.xAxis.transition(vis.t).call(vis.xAxisCall);

    // area path generator
    vis.area = d3
      .area()
      .x((d) => vis.x(d.date))
      .y0(vis.HEIGHT)
      .y1((d) => vis.y(d[vis.yValue]));

    vis.areaPath.data([vis.data]).attr("d", vis.area);
  }
}
```
