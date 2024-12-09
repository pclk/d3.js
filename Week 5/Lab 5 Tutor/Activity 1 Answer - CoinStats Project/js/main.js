/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Lab 5 Activity 1 - CoinStats Project
*/

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

