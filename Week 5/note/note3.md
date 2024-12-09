D3 Zoom and Pan

D3 provides a module 'd3.zoom' that adds zoom and pan behaviour to an HTML or SVG element. This article shows how to create zoom behaviours, how to add zoom and pan constraints and how to zoom and pan programmatically.

D3 can add zoom and pan behaviour to an HTML or SVG element.


When zoom and pan gestures (such as dragging or a pinch gesture) occur, a transform (consisting of scale and translate) is computed by D3 and passed into an event handler. The event handler typically applies the transform to chart elements.

There's three steps to add zoom and pan behaviour to an element:

call d3.zoom() to create a zoom behaviour function
add an event handler that gets called when a zoom or pan event occurs. The event handler receives a transform which can be applied to chart elements
attach the zoom behaviour to an element that receives the zoom and pan gestures
It's helpful to distinguish between the HTML or SVG element that receives the zoom and pan gestures and the elements that get zoomed and panned (the elements that get transformed). It's important that these elements are different, otherwise the panning won't work properly.

Calling d3.zoom() creates a zoom behaviour:

let zoom = d3.zoom();
Although it's called d3.zoom, this module handles zoom and pan events.

A zoom behaviour is a function that adds event handlers (for drags, mouse wheel events and touch events etc.) to an element. It also has methods such as .on defined on it.

You can attach an event handler to your zoom behaviour by calling the .on method. This accepts two arguments:

the event type ('zoom', 'start' or 'end')
the name of your event handler function
function handleZoom(e) {
 // apply transform to the chart
}

let zoom = d3.zoom()
  .on('zoom', handleZoom);
The event types are 'zoom', 'start' and 'end'. 'zoom' indicates a change of transform (e.g. the user has zoomed or panned). 'start' indicates the start of the zoom or pan (e.g. the user has pressed the mouse button). 'end' indicates the end of the zoom or pan (e.g. the user has released the mouse button).

handleZoom receives a single parameter e which is an object representing the zoom event. The most useful property on this object is transform. This is an object that represents the latest zoom transform and is typically applied to the chart element(s):

function handleZoom(e) {
  d3.select('g.chart')
    .attr('transform', e.transform);
}
e.transform has three properties x, y and k. x and y specify the translate transform and k represents the scale factor. It also has a .toString method which generates a string such as "translate(38.9,-4.1) scale(1.3)". This means you can pass e.transform directly into .attr.

You attach the zoom behaviour to an element by selecting the element and passing the zoom behaviour into the .call method:

d3.select('svg')
  .call(zoom);
The zoom behaviour is a function that sets up event listeners on the selected element (svg in the above example). When zoom and pan events occur, a transform is computed and passed into the event handler (handleZoom in the above examples).

Example

Suppose you have an SVG element that contains a g element:

<svg width="600" height="400">
  <g></g>
</svg>
In the following code a zoom behaviour is created using d3.zoom() and attached to the svg element.

handleZoom is passed into the .on method. When a zoom or pan occurs, handleZoom gets called. This applies the transform e.transform to the g element.

function handleZoom(e) {
  d3.select('svg g')
    .attr('transform', e.transform);
}

let zoom = d3.zoom()
  .on('zoom', handleZoom);

d3.select('svg')
  .call(zoom);
Here's a full example where an array of random coordinates is joined to circle elements:

let data = [], width = 600, height = 400, numPoints = 100;

let zoom = d3.zoom()
  .on('zoom', handleZoom);

function handleZoom(e) {
  d3.select('svg g')
    .attr('transform', e.transform);
}

function initZoom() {
  d3.select('svg')
    .call(zoom);
}

function updateData() {
  data = [];
  for(let i=0; i<numPoints; i++) {
    data.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height
  	});
  }
}

function update() {
  d3.select('svg g')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', 3);
}

initZoom();
updateData();
update();
Use the mouse wheel and dragging, or touch gestures, to zoom and pan the circles:



Zoom and pan constraints

You can constrain the zoom and pan so that the user can only zoom and pan within specified bounds.

The zoom can be constrained using .scaleExtent into which you pass an array [min, max] where min is the minimum scale factor and max is the maximum scale factor:

let zoom = d3.zoom()
  .scaleExtent([1, 5]);
You can use .translateExtent to specify bounds [[x0, y0], [x1, y1]] that the user can't pan outside of:

let width = 600, height = 400;

let zoom = d3.zoom()
  .scaleExtent([1, 5])
  .translateExtent([[0, 0], [width, height]]);
Now you can only zoom in up to a scale factor of 5. Neither can you zoom out beyond the default scale factor of 1. In addition you cannot pan beyond the bounds of the chart:



Programmatic zoom control

You can also zoom and pan programmatically. For example you can create buttons that zoom the chart when clicked.

The zoom behaviour has the following methods for setting the zoom and pan programmatically:

Method name	Description
.translateBy	adds a given x, y offset to the current transform
.translateTo	sets the transform such that a given x, y coordinate is centered (or positioned on a given point [px, py])
.scaleBy	multiplies the current scale factor by a given value
.scaleTo	sets the scale factor to a given value
.transform	sets the transform to a given transform. (Use d3.zoomIdentity to create a zoom transform.)
The above methods shouldn't be called directly. Instead, they should be called on the element that receives the zoom and pan gestures. For example:

d3.select('svg')
  .call(zoom.scaleBy, 0.5);
You can also call these methods on a transition selection, which results in nice effects:

d3.select('svg')
  .transition()
  .call(zoom.translateBy, 50, 0);
Here's a full example using a few of the above methods:

