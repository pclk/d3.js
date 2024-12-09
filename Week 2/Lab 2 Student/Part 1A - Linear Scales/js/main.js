/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Lab 2 Part 1A - Linear scales
*/

const svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400);

d3.json("./data/buildings.json").then(data => {
  data.forEach(d => {
    d.height = Number(d.height)
  })

  const binded_svg = svg.selectAll("rect")
    .data(data)

  // scaleLinear used in practical.
  const y = d3.scaleLinear(
    [0, d3.max(data.map(d => d.height))],
    [0, 400]
  )

  binded_svg.enter().append("rect")
    .attr("y", 0)
    .attr("x", (d, i) => (i * 60))
    .attr("width", 40)
    .attr("height", d => y(d.height))
    .attr("fill", "grey")
})
