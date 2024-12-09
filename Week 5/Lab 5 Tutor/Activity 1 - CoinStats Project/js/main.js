/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Lab 5 Activity 1 - CoinStats Project
*/
		
const MARGIN = { LEFT: 20, RIGHT: 100, TOP: 50, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// time parser for x-scale
const parseTime = d3.timeParse("%Y")

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
    
// y-axis label
yAxis.append("text")
	.attr("class", "axis-title")
	.attr("transform", "rotate(-90)")
	.attr("y", 6)
	.attr("dy", ".71em")
	.style("text-anchor", "end")
	.attr("fill", "#5D6971")
	.text("Population)")

// line path generator
const line = d3.line()
	.x(d => x(d.year))
	.y(d => y(d.value))

d3.json("data/example.json").then(data => {
	// clean data
	data.forEach(d => {
		d.year = parseTime(d.year)
		d.value = Number(d.value)
	})

	// set scale domains
	x.domain(d3.extent(data, d => d.year))
	y.domain([
		d3.min(data, d => d.value) / 1.005, 
		d3.max(data, d => d.value) * 1.005
	])

	// generate axes once scales have been set
	xAxis.call(xAxisCall.scale(x))
	yAxis.call(yAxisCall.scale(y))

	// add line to chart
	g.append("path")
		.attr("class", "line")
		.attr("fill", "none")
		.attr("stroke", "grey")
		.attr("stroke-width", "3px")
		.attr("d", line(data))

})
