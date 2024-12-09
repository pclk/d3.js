/*
*    main.js
*    Mastering Data Visualization with D3.js
*    Lab 2 Part 1B - Band scales
*/

const svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400)

d3.json("./data/buildings.json").then(data => {
  data.forEach(d => {
    d.height = Number(d.height)
  })

  /**Answer for Part 1B */
  const x = d3.scaleBand()
    .domain(["Burj Khalifa", "Shanghai Tower", 
      "Abraj Al-Bait Clock Tower", "Ping An Finance Centre", 
      "Lotte World Tower", "One World Trade Center",  "CTF Finance Centre"]) /** add "One World Trade Center",  "CTF Finance Centre"*/
    .range([0, 400]) 
    .paddingInner(0.3) /***change this from 0.2 to 0.3 */
    .paddingOuter(0.2)
  
  const y = d3.scaleLinear()
    .domain([0, 828])
    .range([0, 400])

  const rects = svg.selectAll("rect")
    .data(data)
  
  rects.enter().append("rect")
    .attr("y", 0)
    .attr("x", (d) => x(d.name))  /**Answer for Part 1B */
    .attr("width", x.bandwidth) /**Answer for Part 1B */
    .attr("height", d => y(d.height))
    .attr("fill", "grey")
})