Circles have three mandatory attributes: cx, cy, and rx.
Incorrect Response
	True
Correct Answer
	False

D3 graphics are vector-based, which means they are based on bitmaps.
Incorrect Response
	True
Correct Answer
	False


 A page that utilising D3 is typically built in such a way that the page loads with styles, data, and content as defined in traditional HTML development. In this question, you are required to sort the sequence events on how D3 works when a HTML with D3 page is loaded.
	__5__		User Interaction
	__4__		Create/update/remove elements
Incorrect Response	__3__	(2)	Select elements
Incorrect Response	__2__	(3)	Bind data
	__1__		Load web page

You want to create a bar chart in D3 with a width of 800px and a height of 500px.


Which of these lines could you use to set the domain of your y-scale based on a given dataset?
Correct Answer
var scale = d3.scaleLinear()
            .domain([0, d3.max(data,function (d) {return d.value})])
            .range([0, 500]);
 
var scale = d3.scaleLinear()
            .domain([d3.extend(data,function (d) {return d.value})])
            .range([0, 500]);
 Incorrect Response
var scale = d3.scaleLinear()
            .domain(d3.extend(data,function (d) {return d.value}))
            .range([0, 500]);
 
var scale = d3.scaleLinear()
            .domain([d3.max(data,function (d) {return d.value}), d3.min(data,function (d) {return d.value})])
            .range([0, 500]);

Geometric data describes the relationship of one piece of data with another, which can also be another form of location data. 
Incorrect Response
	True
Correct Answer
	False

Which of the following statement is CORRECT?
 
There are four categories of scale: numeric, ordinal, quantize and sequential. Different ordinal scales position the labels differently.
 
There are four categories of scale: continuous, ordinal, quantize and sequential. Different ordinal scales multiply input data differently.
 
> There are four categories of scale: continuous, ordinal, quantize and sequential. Different ordinal scales position the labels differently.
 
There are four categories of scale: numeric, ordinal, quantize and sequential. Different ordinal scales multiply input data differently.
