/*
*    main.js
*    IT3382 - Advanced Data Visualisation
*    Lab 1 Part 2 - Adding SVGs with D3
*/
const data = [25, 20, 10, 12, 15]

// So it seems like .attr is class names
const svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400)

const circles = svg.selectAll("circle")
  .data(data)

circles.enter().append("circle")
  .attr("cx", (d, i) => (i * 50) + 50)
  .attr("cy", 250)
  .attr("r", (d => d))
  .attr("fill", "red")
