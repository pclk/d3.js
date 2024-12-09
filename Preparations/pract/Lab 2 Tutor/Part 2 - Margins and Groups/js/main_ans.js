/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Lab 2 Part 2 - Margins and groups
*/

/** Answer for Lab 2 Part 2  */
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT) /** Answer for Lab 2 Part 2  */
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM) /** Answer for Lab 2 Part 2  */

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)  /** Answer for Lab 2 Part 2  */

d3.json("./data/buildings.json").then(data => {
  data.forEach(d => {
    d.height = Number(d.height)
  })

  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, WIDTH]) /** Answer for Lab 2 Part 2  */
    .paddingInner(0.3)
    .paddingOuter(0.2)
  
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.height)])
    .range([0, HEIGHT]) /** Answer for Lab 2 Part 2  */

  const rects = g.selectAll("rect") /** Answer for Lab 2 Part 2  */
    .data(data)
  
  rects.enter().append("rect")
    .attr("y", 0)
    .attr("x", (d) => x(d.name))
    .attr("width", x.bandwidth)
    .attr("height", d => y(d.height))
    .attr("fill", "grey")
})