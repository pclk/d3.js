/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.7 - Loading external data
*/

d3.json("./data/ages.json").then(data => {
  data.forEach(d => {
    d.age = Number(d.age)
  })

  const svg = d3.select("#chart-area").append("svg")
    .attr("width", 400)
    .attr("height", 400)

  const circles = svg.selectAll("circle")
    .data(data)

  circles.enter().append("circle")
    .attr("cx", (d, i) => (i * 50) + 50)
    .attr("cy", 250)
    .attr("r", (d) => 2 * d.age)
    .attr("fill", d => {
      if (d.name === "Tony") {
        return "blue"
      }
      else {
        return "red"
      }
    })
}).catch(error => {
  console.log(error)
})


// d3.csv("/data/ages.csv", function(data) {
// 		for (var i = 0; i < data.length; i++) {
// 			console.log(data[i].name);
// 			console.log(Number(data[i].age));
// 		}
// 	});

// d3.csv("/data/ages.csv").then(data => {
// 	data.forEach(d => {
// 		console.log(Number(d.age))
// 	})
// })
