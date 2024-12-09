/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Project 2 - Gapminder Clone
*/

const MARGIN = { left: 100, right: 10, top: 10, bottom: 100 }
const SVG_WIDTH = 800
const SVG_HEIGHT = 500

const G_WIDTH = SVG_WIDTH - MARGIN.right - MARGIN.left
const G_HEIGHT = SVG_HEIGHT - MARGIN.top - MARGIN.bottom

const svg = d3.select("#chart-area").append("svg")
  .attr("width", SVG_WIDTH)
  .attr("height", SVG_HEIGHT)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.left}, ${MARGIN.top})`)

let time = 0

const x = d3.scaleLog()
  .base(10)
  .range([0, G_WIDTH])
  .domain([100, 150000])

const y = d3.scaleLinear()
  .range([G_HEIGHT, 0])
  .domain([0, 90])

const area = d3.scaleLinear()
  .range([25 * Math.PI, 1500 * Math.PI])
  .domain([2000, 1400000000])
const continentalColor = d3.scaleOrdinal(d3.schemePastel1)

const xLabel = g.append("text")
  .attr("class", "x axis label")
  .attr("x", G_WIDTH / 2)
  .attr("y", G_HEIGHT + 50)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("GDP Per Capita ($)")

const yLabel = g.append("text")
  .attr("class", "y axis label")
  .attr("transform", "rotate(-90)")
  .attr("x", -40)
  .attr("y", -170)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Life expectancy (Years")

const timeLabel = g.append("text")
  .attr("class", "time axis label")
  .attr("y", G_HEIGHT - 10)
  .attr("x", G_WIDTH - 40)
  .attr("font-size", "40px")
  .attr("opacity", "0.4")
  .attr("text-anchor", "middle")
  .text("1800")


const xAxisCall = d3.axisBottom(x)
  .tickValues([400, 4000, 40000])
  .tickFormat(d3.format("$"))

g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${G_HEIGHT}`)
  .call(xAxisCall)

const yAxisCall = d3.axisLeft(y)
g.append("g")
  .attr("class", "y axis")
  .call(yAxisCall)

d3.json("data/data.json").then(function (data) {
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

  d3.interval(() => {
    time = (time < 214) ? time + 1 : 0
    update(formattedData[time])
  }, 100)
  update(formattedData[0])
})

function update(data) {

  const t = d3.transition().duration(100)

  const circles = g.selectAll("circle").data(data, d => d.country)
  console.log(circles)

  circles.exit().remove()

  circles.enter().append("circle")
    .attr("fill", d => continentalColor(d.continent))
    .merge(circles)
    .transition(t)
    .attr("cy", d => y(d.life_exp))
    .attr("cx", d => x(d.income))
    .attr("r", d => Math.sqrt(area(d.population) / Math.PI))

  timeLabel.text(String(time + 1800))
}
