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

