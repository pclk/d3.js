/*
*    main.js
*    IT3382 - Advanced Data Visualisation
*    Lab 1 Part 2 - Adding SVGs with D3
*/

//canvas
const svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400)

svg.append("circle")
  .attr("cx", 200)
  .attr("cy", 200)
  .attr("r", 100)
  .attr("fill", "blue")

// svg.append("circle")
//   .attr("cx", 100)
//   .attr("cy", 250)
//   .attr("r", 70)
//   .attr("fill", "red")