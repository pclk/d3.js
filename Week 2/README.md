# Scaling data to pixels
> How to scale?

Let's define some things.
```js
const svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400);
```
Notice that the height of the svg is quite low, at 400 pixels.
```js
d3.json("./data/buildings.json").then(data => {
  data.forEach(d => {
    d.height = Number(d.height)
  })
```
`./data/buildings.json` has data with domain of around 550 to 828.
```js
  const binded_svg = svg.selectAll("rect")
    .data(data)

  binded_svg.enter().append("rect")
    .attr("y", 0)
    .attr("x", (d, i) => (i * 60))
    .attr("width", 40)
    .attr("height", d => d.height)
    .attr("fill", "grey")
})
```
After plotting out the above, the chart seems to have the same height. But the behaviour is more of the SVG's short height cutting off the bottom of the rectangles, who are all more than 400 pixels tall.

To solve this, we can scale the data down to the SVG's height.
```js 
  // const binded_svg = svg.selectAll("rect")
  //   .data(data)

  // <add>  
  const y = d3.scaleLinear()
    .domain([0, 828])
    .range([0, 400])
  // </add>  

  // binded_svg.enter().append("rect")
  //   .attr("y", 0)
  //   .attr("x", (d, i) => (i * 60))
  //   .attr("width", 40)
    // <add>  
        .attr("height", d => y(d.height))
    // <del>.attr("height", d => d.height)</del>
    // </add>  
    // .attr("fill", "grey")
```
We start at 0 like most graphs for the domain of the y axis. The max will be the data's max value.

Range will be according to the SVG's height.

We then apply the scaling to the rectangle's height.

# Assignment
