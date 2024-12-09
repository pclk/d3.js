var svg = d3.select("svg"),
  margin = { top: 20, right: 20, bottom: 30, left: 50 },
  width = svg.attr("width") - margin.left - margin.right,
  height = svg.attr("height") - margin.top - margin.bottom;

var parseDate = d3.timeParse("%Y %b %d");

var x = d3.scaleTime().range([0, width]),
  y = d3.scaleLinear().range([height, 0]),
  z = d3.scaleOrdinal(d3.schemeTableau10); // Updated color scale

var stack = d3.stack();

var area = d3.area()
  .x(d => x(d.data.date))
  .y0(d => y(d[0]))
  .y1(d => y(d[1]));

var g = svg.append("g")
  .attr("transform", `translate(${margin.left},${margin.top})`);

// Loading data using Promises (d3.tsv returns a Promise)
d3.tsv("data/stacked_area1.tsv", type).then(data => {

  var keys = data.columns.slice(1);

  x.domain(d3.extent(data, d => d.date));
  z.domain(keys);
  stack.keys(keys);

  console.log(data);
  console.log(stack(data));

  var layer = g.selectAll(".layer")
    .data(stack(data))
    .enter().append("g")
    .attr("class", "layer");

  layer.append("path")
    .attr("class", "area")
    .style("fill", d => z(d.key))
    .attr("d", area);

  // Only label the layers left at the end (if one browser disappears)
  layer.filter(d => d[d.length - 1][1] - d[d.length - 1][0] > 0.01)
    .append("text")
    .attr("x", width - 6)
    .attr("y", d => y((d[d.length - 1][0] + d[d.length - 1][1]) / 2))
    .attr("dy", ".35em")
    .style("font", "10px sans-serif")
    .style("text-anchor", "end")
    .text(d => d.key);

  g.append("g")
    .attr("class", "axis axis--x")
    .attr("transform", `translate(0,${height})`)
    .call(d3.axisBottom(x));

  g.append("g")
    .attr("class", "axis axis--y")
    .call(d3.axisLeft(y).ticks(10, "%"));
}).catch(error => {
  console.error('Error loading the data:', error);
});

function type(d, i, columns) {
  d.date = parseDate(d.date);
  for (var i = 1, n = columns.length; i < n; ++i) d[columns[i]] = d[columns[i]] / 100;
  return d;
}
