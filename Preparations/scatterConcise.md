```js
/*
* D3.js Lab 4 - Complete Reference
* Contains all variations from basic interval to scatter plot
*/

const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

let flag = true // Used in later variations for toggling

// Basic chart setup - Common across all variations
const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// Labels - Common across all variations
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month")

const yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue ($)")

// Scales - Common across all variations
const x = d3.scaleBand()
  .range([0, WIDTH])
  .paddingInner(0.3)
  .paddingOuter(0.2)

const y = d3.scaleLinear()
  .range([HEIGHT, 0])

// Axes groups - Common across all variations
const xAxisGroup = g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append("g")
  .attr("class", "y axis")

/* VARIATION 1: Basic Interval
d3.csv("data/revenues.csv").then(data => {
  data.forEach(d => {
    d.revenue = Number(d.revenue)
  })

  d3.interval(() => {
    console.log("Hello World")
  }, 1000)
})
*/

/* VARIATION 2: Simple Update Function
d3.csv("data/revenues.csv").then(data => {
  data.forEach(d => {
    d.revenue = Number(d.revenue)
  })

  d3.interval(() => {
    update(data)
  }, 1000)

  update(data)
})

function update(data) {
  x.domain(data.map(d => d.month))
  y.domain([0, d3.max(data, d => d.revenue)])

  const xAxisCall = d3.axisBottom(x)
  xAxisGroup.call(xAxisCall)
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => d + "m")
  yAxisGroup.call(yAxisCall)

  const rects = g.selectAll("rect")
    .data(data)
  
  rects.enter().append("rect")
    .attr("y", d => y(d.revenue))
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d.revenue))
    .attr("fill", "grey")
}
*/

/* VARIATION 3: Full Update Pattern with Transitions
d3.csv("data/revenues.csv").then(data => {
  data.forEach(d => {
    d.revenue = Number(d.revenue)
    d.profit = Number(d.profit)
  })

  d3.interval(() => {
    flag = !flag
    const newData = flag ? data : data.slice(1)
    update(newData)
  }, 1000)

  update(data)
})

function update(data) {
  const value = flag ? "profit" : "revenue"
  const t = d3.transition().duration(750)

  x.domain(data.map(d => d.month))
  y.domain([0, d3.max(data, d => d[value])])

  const xAxisCall = d3.axisBottom(x)
  xAxisGroup.transition(t).call(xAxisCall)
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => d + "m")
  yAxisGroup.transition(t).call(yAxisCall)

  // JOIN new data with old elements
  const rects = g.selectAll("rect")
    .data(data, d => d.month)

  // EXIT old elements
  rects.exit()
    .attr("fill", "red")
    .transition(t)
      .attr("height", 0)
      .attr("y", y(0))
      .remove()

  // ENTER new elements
  rects.enter().append("rect")
    .attr("fill", "grey")
    .attr("y", y(0))
    .attr("height", 0)
    // UPDATE old elements
    .merge(rects)
    .transition(t)
      .attr("x", (d) => x(d.month))
      .attr("width", x.bandwidth)
      .attr("y", d => y(d[value]))
      .attr("height", d => HEIGHT - y(d[value]))

  const text = flag ? "Profit ($)" : "Revenue ($)"
  yLabel.text(text)
}
*/

/* VARIATION 4: Scatter Plot Version
// Same setup as Variation 3, but in update():
function update(data) {
  const value = flag ? "profit" : "revenue"
  const t = d3.transition().duration(750)

  // ... same axes setup ...

  // JOIN new data with old elements
  const circles = g.selectAll("circle")
    .data(data, d => d.month)

  // EXIT old elements
  circles.exit()
    .attr("fill", "red")
    .transition(t)
      .attr("cy", y(0))
      .remove()

  // ENTER new elements
  circles.enter().append("circle")
    .attr("fill", "grey")
    .attr("cy", y(0))
    .attr("r", 5)
    // UPDATE old elements
    .merge(circles)
    .transition(t)
      .attr("cx", (d) => x(d.month) + (x.bandwidth() / 2))
      .attr("cy", d => y(d[value]))
}
*/
```
