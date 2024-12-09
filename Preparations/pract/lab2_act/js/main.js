// Set margins and dimensions
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

console.log("Canvas dimensions:", { WIDTH, HEIGHT, MARGIN })

// Create SVG canvas
const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

if (!svg.empty()) {
  console.log("SVG created successfully with dimensions:", {
    width: WIDTH + MARGIN.LEFT + MARGIN.RIGHT,
    height: HEIGHT + MARGIN.TOP + MARGIN.BOTTOM
  })
} else {
  console.error("Failed to create SVG. Check if #chart-area exists")
}

// Create chart group
const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

console.log("Main group created with translation:", { left: MARGIN.LEFT, top: MARGIN.TOP })

// X label
const xLabel = g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 50)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month")

console.log("X label positioned at:", { x: WIDTH / 2, y: HEIGHT + 50 })

// Y label
const yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -(HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue ($)")

console.log("Y label positioned at:", { x: -(HEIGHT / 2), y: -60 })

// Load and process data
d3.csv("data/revenues.csv").then(data => {
  console.log("Raw data received:", data)

  // Process data
  data.forEach(d => {
    d.revenue = Number(d.revenue)
  })

  console.log("Processed data:", {
    dataPoints: data.length,
    samplePoint: data[0],
    revenues: data.map(d => d.revenue)
  })

  // Create scales
  const x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.revenue)])
    .range([HEIGHT, 0])

  console.log("Scales created:", {
    xDomain: x.domain(),
    xRange: x.range(),
    yDomain: y.domain(),
    yRange: y.range(),
    bandwidth: x.bandwidth()
  })

  // Create and add X axis
  const xAxisCall = d3.axisBottom(x)
  const xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)")

  console.log("X axis created at y:", HEIGHT)

  // Create and add Y axis
  const yAxisCall = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => d + "m")
  const yAxis = g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall)

  console.log("Y axis created with ticks:", yAxisCall.scale().ticks(3))

  // Create bars
  const rects = g.selectAll("rect")
    .data(data)

  console.log("Binding data to rectangles:", {
    dataPoints: data.length,
    boundElements: rects.size()
  })

  // Add bars to chart
  const bars = rects.enter().append("rect")
    .attr("y", d => y(d.revenue))
    .attr("x", d => x(d.month))
    .attr("width", x.bandwidth())
    .attr("height", d => HEIGHT - y(d.revenue))
    .attr("fill", "grey")

  console.log("Bars created:", {
    count: bars.size(),
    firstBar: {
      x: x(data[0].month),
      y: y(data[0].revenue),
      width: x.bandwidth(),
      height: HEIGHT - y(data[0].revenue)
    }
  })

}).catch(error => {
  console.error("Error loading or processing data:", error)
})

// Add error handling for D3 selections
const originalSelect = d3.select
d3.select = function (selector) {
  const selection = originalSelect.apply(this, arguments)
  if (selection.empty()) {
    console.warn(`No elements found for selector: ${selector}`)
  }
  return selection
}
