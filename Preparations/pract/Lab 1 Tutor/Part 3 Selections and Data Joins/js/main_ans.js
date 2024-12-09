/*
*   main.js
*   IT3382 - Advanced Data Visualisation
*   Part 3 -  Selections and data joins
*/

const data = [25, 20, 10, 12, 15]

const svg = d3.select("#chart-area").append("svg")
	.attr("width", 400)
	.attr("height", 400)

const circles = svg.selectAll("circle")
	.data(data)

// circles.enter().append("circle")
// 	.attr("cx", (d, i) => {
// 		console.log("Item: " + d, "Index: " +i)
// 	})
// 	.attr("cy", 250)
// 	.attr("r", (d) => {
// 		console.log(d)
// 	})
// 	.attr("fill", "red")


circles.enter().append("circle")
	.attr("cx", (d, i) => (i * 50) + 50)
	.attr("cy", 250)
	.attr("r", (d) => d)
	.attr("fill", "red")





