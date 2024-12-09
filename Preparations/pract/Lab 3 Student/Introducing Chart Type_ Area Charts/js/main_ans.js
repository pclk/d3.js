/*
*    main.js
*    Mastering Data Visualization with D3.js
*    2.7 - Loading external data
*/


var svg = d3.select("svg"),
margin = {top: 20, right: 20, bottom: 30, left: 50},
width = +svg.attr("width") - margin.left - margin.right,
height = +svg.attr("height") - margin.top - margin.bottom,
g = svg.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%d-%b-%y");

d3.tsv("data/area.tsv").then(data => {
data.forEach(d => {
	d.date = parseTime(d.date);
	d.close = +d.close;
})

const x = d3.scaleTime()
.rangeRound([0, width])
.domain(d3.extent(data, d=> d.date));
const y = d3.scaleLinear()
.rangeRound([height, 0])
.domain([0, d3.max(data, d=> d.close)]);

var area = d3.area()
.x(d=>x(d.date))
.y0(y(0))
.y1(d=> y(d.close));

g.append("path")
.attr("fill", "steelblue")
.attr("d", area(data));

g.append("g")
.attr("transform", "translate(0," + height + ")")
.call(d3.axisBottom(x));

g.append("g")
.call(d3.axisLeft(y))
.append("text")
.attr("fill", "#000")
.attr("transform", "rotate(-90)")
.attr("y", 6)
.attr("dy", "0.71em")
.attr("text-anchor", "end")
.text("Price ($)");
}).catch(function(error){
console.log(error);
});