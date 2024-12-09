/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Lab 2 Part 2 - Margins and groups
*/

const M = { top: 20, right: 10, bottom: 20, left: 10 }
const W = 500 - M.left - M.right
const H = 300 - M.top - M.bottom

const svg = d3.select("#chart-area").append("svg")
  .attr("width", W + M.left + M.right)
  .attr("height", H + M.top + M.right)
  .append("g")
  .attr("transform", `translate(${M.left}, ${M.top})`)

d3.json("./data/buildings.json").then(data => {
  data.forEach(d => {
    d.height = Number(d.height)
  })

  const x = d3.scaleBand()
    .domain(data.map(d => d.name))  /** Answer for Part 1C  */
    .range([0, W])
    .paddingInner(0.3)
    .paddingOuter(0.2)

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.height)])  /** Answer for Part 1C  */
    .range([0, H])

  const rects = svg.selectAll("rect")
    .data(data)

  rects.enter().append("rect")
    .attr("y", 0)
    .attr("x", (d) => x(d.name))
    .attr("width", x.bandwidth)
    .attr("height", d => y(d.height))
    .attr("fill", "grey")
})
