d3.json("data/buildings.json").then(data => {
  data.forEach(row => row.height = Number(row.height))

  const svg = d3.select("#chart-area").append("svg")
    .attr("width", 1200)
    .attr("height", 1200)

  // inside the svg element that i just created, i want all circles inside of my svg to be binded to my data.
  const binded_svg = svg.selectAll("rect").data(data)

  // and going through each data instance, append a new circle with the following attributes
  binded_svg.enter().append("rect")
    .attr("x", (_, i) => (i * 200) + 200)
    .attr("y", 0)
    .attr("width", 100)
    .attr("height", d => d.height)
    .attr("fill", d => {
      if (d.name === "Burj Khalifa") {
        return "green"
      } else {
        return "red"
      }
    })
}).catch(e => console.log(e))
