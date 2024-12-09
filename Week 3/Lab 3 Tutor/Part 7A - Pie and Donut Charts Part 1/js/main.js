var width = 600,
height = 400,
radius = Math.min(width, height) / 2;

// Updated color scale for D3 v7
var color = d3.scaleOrdinal()
.range(["#98abc5", "#8a89a6", "#7b6888", "#6b486b", "#a05d56", "#d0743c", "#ff8c00"]);

// Arc generator for D3 v7
var arc = d3.arc()
.outerRadius(radius - 20)
.innerRadius(radius - 80);

// Pie layout for D3 v7
var pie = d3.pie()
.sort(null)
.value(function(d) { return d.population; });

// Append the SVG element
var svg = d3.select("body").append("svg")
.attr("width", width)
.attr("height", height)
.append("g")
.attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

// Load data using d3.csv for D3 v7
d3.csv("data/donut1.csv").then(function(data) {
// Convert population to a number
data.forEach(function(d) {
    d.population = +d.population;
});

// Create the arcs
var g = svg.selectAll(".arc")
    .data(pie(data))
    .enter().append("g")
    .attr("class", "arc");

// Append paths for each slice of the pie chart
g.append("path")
    .attr("d", arc)
    .style("fill", function(d) { return color(d.data.age); });
}).catch(function(error) {
console.error('Error loading the CSV file:', error);
});