[toc]
## Lab example
### html
```html
<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="description" content="">
	<title>Lab 5 Activity 1 - CoinStats Project</title>
	<!-- Bootstrap -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
	<!-- jQueryUI styling -->
	<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css">
	<!-- Custom styling -->
	<link rel="stylesheet" href="css/style.css">
</head>
<body>
	<nav class="navbar navbar-light bg-light">
		<div class="container">
			<a class="navbar-brand" href="#"><img id="logo" src="img/logo.png"></a>      
		</div>
	</nav>

	<!-- Bootstrap grid setup -->
	<div class="container">
		<div id="selections" class="row">
			<div class="col-md-4 col-sm-12">
				<div id="slider-div">
					<label>Date: <span id="dateLabel1">12/05/2013</span> - <span id="dateLabel2">31/10/2017</span></label>
					<div id="date-slider"></div>
				</div>
			</div>
			<div class="col-md-4 col-sm-12">
				<select id="coin-select" class="form-control">
					<option selected value="bitcoin">Bitcoin</option>
					<option value="ethereum">Ethereum</option>
					<option value="bitcoin_cash">Bitcoin Cash</option>
					<option value="litecoin">Litecoin</option>
					<option value="ripple">Ripple</option>
				</select>
			</div>
			<div class="col-md-4 col-sm-12">
				<select id="var-select" class="form-control">
					<option selected value="price_usd">Price in dollars</option>
					<option value="market_cap">Market capitalization</option>
					<option value="24h_vol">24 hour trading volume</option>
				</select>
			</div>
		</div>
		<div class="row">
			<div class="col-md-12">
				<div id="chart-area"></div>                  
			</div>
		</div>
	</div>

	<!-- External JS libraries -->
	<script src="https://d3js.org/d3.v7.min.js"></script>
	<script src="https://code.jquery.com/jquery-3.5.1.min.js" integrity="sha256-9/aliU8dGd2tb6OSsuzixeV4y/faTqgFtohetphbbj0=" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
	<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.min.js" integrity="sha256-VazP97ZCwtekAsvgPBSUwPFKdrwD3unUfSGVYrahUqU="crossorigin="anonymous"></script>
	<!-- Custom JS -->
	<script src="js/main.js"></script>
</body>
</html>
```

### js
```js
const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// time parsers/formatters
const parseTime = d3.timeParse("%d/%m/%Y")
// Lab 5 Activity 1 - CoinStats Project
const formatTime = d3.timeFormat("%d/%m/%Y")

// Lab 5 Activity 1 - CoinStats Project
// add the line for the first time
g.append("path")
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "grey")
  .attr("stroke-width", "3px")

// axis labels

const xLabel = g.append("text")
  .attr("class", "x axisLabel")
  .attr("y", HEIGHT + 50)
  .attr("x", WIDTH / 2)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Time")
const yLabel = g.append("text")
  .attr("class", "y axisLabel")
  .attr("transform", "rotate(-90)")
  .attr("y", -60)
  .attr("x", -170)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Price ($)")

// scales
const x = d3.scaleTime().range([0, WIDTH])
const y = d3.scaleLinear().range([HEIGHT, 0])

// axis generators
const xAxisCall = d3.axisBottom()
const yAxisCall = d3.axisLeft()
  .ticks(6)
  .tickFormat(d => `${parseInt(d / 1000)}k`)

// axis groups
const xAxis = g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`)
const yAxis = g.append("g")
  .attr("class", "y axis")

// event listeners
// Lab 5 Activity 1 - CoinStats Project
$("#coin-select").on("change", update)
$("#var-select").on("change", update)

// add jQuery UI slider
// Lab 5 Activity 1 - CoinStats Project
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
    update()
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

  // run the visualization for the first time
  update()
})

function update() {
  const t = d3.transition().duration(1000)

  // filter data based on selections
  const coin = $("#coin-select").val()
  const yValue = $("#var-select").val()
  const sliderValues = $("#date-slider").slider("values")
  const dataTimeFiltered = filteredData[coin].filter(d => {
    return ((d.date >= sliderValues[0]) && (d.date <= sliderValues[1]))
  })

  // update scales
  x.domain(d3.extent(dataTimeFiltered, d => d.date))
  y.domain([
    d3.min(dataTimeFiltered, d => d[yValue]) / 1.005,
    d3.max(dataTimeFiltered, d => d[yValue]) * 1.005
  ])

  // fix for format values
  const formatSi = d3.format(".2s")
  function formatAbbreviation(x) {
    const s = formatSi(x)
    switch (s[s.length - 1]) {
      case "G": return s.slice(0, -1) + "B" // billions
      case "k": return s.slice(0, -1) + "K" // thousands
    }
    return s
  }

  // Lab 5 Activity 1 - CoinStats Project
  // update axes
  xAxisCall.scale(x)
  xAxis.transition(t).call(xAxisCall)
  yAxisCall.scale(y)
  yAxis.transition(t).call(yAxisCall.tickFormat(formatAbbreviation))

  // Path generator
  line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d[yValue]))

  // Update our line path
  g.select(".line")
    .transition(t)
    .attr("d", line(dataTimeFiltered))

  // Update y-axis label
  const newText = (yValue === "price_usd") ? "Price ($)"
    : (yValue === "market_cap") ? "Market Capitalization ($)"
      : "24 Hour Trading Volume ($)"
  yLabel.text(newText)
}
```


## with logging

```js
// Set margins and dimensions
const MARGIN = { LEFT: 100, RIGHT: 100, TOP: 50, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

console.log("Canvas dimensions:", { WIDTH, HEIGHT, MARGIN })

// Create SVG canvas
const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

if (!svg.empty()) {
  console.log("SVG created successfully")
} else {
  console.error("Failed to create SVG")
}

// Create chart group
const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// Time parsing setup
const parseTime = d3.timeParse("%d/%m/%Y")
const formatTime = d3.timeFormat("%d/%m/%Y")

// Test time parsing
console.log("Time parsing test:", {
  parsed: parseTime("01/01/2017"),
  formatted: formatTime(new Date())
})

// Create initial line path
g.append("path")
  .attr("class", "line")
  .attr("fill", "none")
  .attr("stroke", "grey")
  .attr("stroke-width", "3px")

// Add labels
const xLabel = g.append("text")
  .attr("class", "x axis-label")
  .attr("y", HEIGHT + 50)
  .attr("x", WIDTH / 2)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Time")

const yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("transform", "rotate(-90)")
  .attr("y", -60)
  .attr("x", -170)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Price ($)")

// Create scales
const x = d3.scaleTime().range([0, WIDTH])
const y = d3.scaleLinear().range([HEIGHT, 0])

console.log("Scales initialized:", {
  xRange: x.range(),
  yRange: y.range()
})

// Create axes
const xAxisCall = d3.axisBottom()
const yAxisCall = d3.axisLeft()
  .ticks(6)
  .tickFormat(d => `${parseInt(d / 1000)}k`)

const xAxis = g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`)
const yAxis = g.append("g")
  .attr("class", "y axis")

// Add event listeners
$("#coin-select").on("change", update)
$("#var-select").on("change", update)

// Initialize slider
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
    update()
  }
})

console.log("Slider initialized with range:", {
  min: formatTime(new Date($("#date-slider").slider("values")[0])),
  max: formatTime(new Date($("#date-slider").slider("values")[1]))
})

// Load and process data
let chartData; // Declare chart data at top level

d3.json("data/coins.json").then(data => {
  console.log("Raw data received:", Object.keys(data))

  chartData = {}
  Object.keys(data).forEach(coin => {
    chartData[coin] = data[coin]
      .filter(d => {
        return !(d["price_usd"] == null)
      })
      .map(d => {
        return {
          price_usd: Number(d["price_usd"]),
          "24h_vol": Number(d["24h_vol"]),
          market_cap: Number(d["market_cap"]),
          date: parseTime(d["date"])
        }
      })

    console.log(`Processed ${coin} data:`, {
      dataPoints: chartData[coin].length,
      samplePoint: chartData[coin][0]
    })
  })

  update()
}).catch(error => {
  console.error("Error loading data:", error)
})

function update() {
  console.log("Update function called")

  const t = d3.transition().duration(1000)

  // Get current selections
  const coin = $("#coin-select").val()
  const yValue = $("#var-select").val()
  const sliderValues = $("#date-slider").slider("values")

  console.log("Current selections:", {
    coin, yValue, dateRange: [
      formatTime(new Date(sliderValues[0])),
      formatTime(new Date(sliderValues[1]))
    ]
  })

  // Filter data
  const dataTimeFiltered = chartData[coin].filter(d => {
    return ((d.date >= sliderValues[0]) && (d.date <= sliderValues[1]))
  })

  console.log("Filtered data:", {
    points: dataTimeFiltered.length,
    firstPoint: dataTimeFiltered[0],
    lastPoint: dataTimeFiltered[dataTimeFiltered.length - 1]
  })

  // Update scales
  x.domain(d3.extent(dataTimeFiltered, d => d.date))
  y.domain([
    d3.min(dataTimeFiltered, d => d[yValue]) / 1.005,
    d3.max(dataTimeFiltered, d => d[yValue]) * 1.005,
  ])

  console.log("Updated domains:", {
    xDomain: x.domain().map(formatTime),
    yDomain: y.domain()
  })

  // Format numbers
  const formatSi = d3.format(".2s")
  function formatAbbrevation(x) {
    const s = formatSi(x)
    switch (s[s.length - 1]) {
      case "G": return s.slice(0, -1) + "B"
      case "k": return s.slice(0, -1) + "K"
    }
    return s
  }

  // Update axes
  xAxisCall.scale(x)
  xAxis.transition(t).call(xAxisCall)
  yAxisCall.scale(y)
  yAxis.transition(t).call(yAxisCall.tickFormat(formatAbbrevation))

  // Update line
  const line = d3.line()
    .x(d => x(d.date))
    .y(d => y(d[yValue]))

  g.select(".line")
    .transition(t)
    .attr("d", line(dataTimeFiltered))

  // Update label
  const newText = (yValue === "price_usd") ? "Price ($)"
    : (yValue === "market_cap") ? "Market Capitalization ($)"
      : "24 Hour Trading Volume ($)"
  yLabel.text(newText)

  console.log("Update complete")
}
```
