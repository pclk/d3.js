/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Lab 2 Part 1A - Linear scales
*/

const svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400)

d3.json("./data/buildings.json").then(data => {
  data.forEach(d => {
    d.height = Number(d.height)
  })

  /**Answer for Part 1A */
  const y = d3.scaleLinear()
    .domain([0, 828])
    .range([0, 400])

  const rects = svg.selectAll("rect")
    .data(data)

  rects.enter().append("rect")
    .attr("y", 0)
    .attr("x", (d, i) => (i * 60))
    .attr("width", 40)
    /**Answer for Part 1A */
    .attr("height", d => y(d.height))
    .attr("fill", "grey")
})
