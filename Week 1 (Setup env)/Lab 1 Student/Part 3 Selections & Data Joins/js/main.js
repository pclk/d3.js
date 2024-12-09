/*
*   main.js
*   IT3382 - Advanced Data Visualisation
*   Part 3 -  Selections and data joins
*/

const data = [25, 20, 10, 12, 15]

const svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400)

svg.append("circle")
	.attr("cx", 100)
	.attr("cy", 250)
	.attr("r", 70)
	.attr("fill", "red")