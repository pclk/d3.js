const MARGIN = { left: 100, right: 10, top: 10, bottom: 130 }
const SVG_WIDTH = 600
const SVG_HEIGHT = 400
const X_VAR = "month"
const Y_VAR = "revenue"
function TICKFORMATcallback(d, _) {
  return "$" + d
}

const G_WIDTH = SVG_WIDTH - MARGIN.left - MARGIN.right
const G_HEIGHT = SVG_HEIGHT - MARGIN.top - MARGIN.bottom

const svg = d3.select("#chart-area").append("svg")
  .attr("width", SVG_WIDTH)
  .attr("height", SVG_HEIGHT)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`) // because can't be bothered to do proper css

g.append("text")
  .attr("class", "x axis label")
  .attr("x", G_WIDTH / 2)
  .attr("y", G_HEIGHT + 80) // need to play around
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("This graph shows my revenue over some amount of months. ($$$)")

g.append("text")
  .attr("class", "y axis label")
  .attr("x", - (G_HEIGHT / 2))
  .attr("y", -60) // need to play around
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue ($)")

d3.csv("./data/revenues.csv").then(data => {
  data.forEach(d => {
    d[Y_VAR] = Number(d[Y_VAR])
  })

  const x = d3.scaleBand()
    .domain(data.map(d => d[X_VAR]))
    .range([0, G_WIDTH])
    .paddingInner(0.2)
    .paddingOuter(0.2)

  const y = d3.scaleLinear()
    .domain([0, d3.max(data.map(d => d[Y_VAR]))])
    .range([G_HEIGHT, 0])

  const xAxisCallback = d3.axisBottom(x)
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${G_HEIGHT})`) // push to bottom
    .call(xAxisCallback)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)")

  const yAxisCallback = d3.axisLeft(y)
    .ticks(5)
    .tickFormat(TICKFORMATcallback)
  g.append("g")
    .attr("class", "y axis")
    .call(yAxisCallback)

  const rects = g.selectAll("rect")
    .data(data)

  rects.enter().append("rect")
    .attr("y", d => y(d[Y_VAR]))
    .attr("x", d => x(d[X_VAR]))
    .attr("width", x.bandwidth)
    .attr("height", d => G_HEIGHT - y(d[Y_VAR]))
    .attr("fill", "grey")
})
