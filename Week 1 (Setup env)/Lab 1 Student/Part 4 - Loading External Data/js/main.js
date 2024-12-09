/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.7 - Loading external data
*/

d3.json("data/ages.json").then(data => {
  data.forEach(row => {
    row.age = Number(row.age)
  });
  const svg = d3.select("#chart-area").append("svg")
    .attr("width", 400)
    .attr("height", 400)

  const binded_svg = svg.selectAll("circle")
    .data(data)

  binded_svg.enter().append("circle")
    .attr("cx", (d, i) => (i * 50) + 50)
    .attr("cy", 250)
    .attr("r", (d) => 2 * d.age)
    .attr("fill", d => {
      if (d.name === "Tony") {
        return "blue"
      } else {
        return "red"
      }
    })
}).catch(error => console.log(error))

