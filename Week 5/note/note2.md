Picking, Dragging and Brushing with D3

D3 provides a number of modules that help you add interactivity such as zooming, panning and brushing.

In this chapter we cover:

quadtree and Delaunay triangulation (to make picking small items easier)
dragging (for moving elements)
brushing (for selecting regions)
Zoom and pan are covered in a separate chapter.

Quadtrees

If your chart contains items sized according to a data variable (such as a bubble chart) hovering over (or clicking) tiny items can be difficult.

You can make picking small items easier by searching for the closest item to the mouse pointer each time the mouse is moved. This can be an expensive operation but can be made more efficient using D3's quadtree module.

A quadtree is a tree data structure that recursively divides an area into smaller and smaller areas and can make searching for items more efficient.

Line charts can also benefit from quadtrees for picking points along a line.

With D3's quadtree module you can create a quadtree, add some points to it, then find the closest point within the quadtree to a given coordinate.

You can create a quadtree by calling d3.quadtree(). You can then add single points to it using .add:

let quadtree = d3.quadtree();

quadtree.add([50, 100]);
quadtree.add([100, 100]);
In the above example two points have been added: 50, 100 and 100, 100.

Given a coodinate x, y you can find the nearest point in the quadtree using .find(x, y):

quadtree.find(55, 105); // returns [50, 100]
quadtree.find(90, 95); // returns [100, 100]
You can also add a distance (as the third argument) so that only points within that distance are returned:

quadtree.find(60, 100, 20); // returns [50, 100]
quadtree.find(60, 100, 5); // returns undefined
The first .find returns [50, 100] because this is the closest point and is within a distance of 20. The second .find returns undefined because the closest point [50, 100] is more than 5 away. This is useful for ensuring the returned point is close to the requested point. Without this constraint, outlier points can get selected even though the pointer isn't very close.

You can add an array of points using .addAll:

quadtree.addAll([[10, 50], [60, 30], [80, 20]]);
The .add and .addAll methods are cumulative i.e. the existing quadtree points persist.

If you've an array of objects, you can specify accessor functions using the .x and .y methods:

let data = [
  { x: 50, y: 100 },
  { x: 100, y: 100 }
];

let quadtree = d3.quadtree()
  .x(function(d) {return d.x;})
  .y(function(d) {return d.y;});

quadtree.addAll(data);

quadtree.find(60, 100); // returns {x: 50, y: 100}
Example

Let's look at an example where we create some randomised points (updateData) and add them to a quadtree (updateQuadtree). We draw the points (update) and set up a mousemove event on the svg element (initEvents).

When the mouse moves (see handleMousemove) we search for the nearest point to the mouse pointer using the quadtree. We update hoveredId with the found point's id then call update again so that the hovered point is coloured red:

let data = [], width = 600, height = 400, numPoints = 100;

let quadtree = d3.quadtree()
  .x(function(d) {return d.x;})
  .y(function(d) {return d.y;});

let hoveredId;

function updateData() {
  data = [];
  for(let i=0; i<numPoints; i++) {
    data.push({
      id: i,
      x: Math.random() * width,
      y: Math.random() * height,
      r: 1 + Math.random() * 20
    });
  }
}

function handleMousemove(e) {
  let pos = d3.pointer(e, this);
  let d = quadtree.find(pos[0], pos[1], 20);
  hoveredId = d ? d.id : undefined;
  update();
}

function initEvents() {
  d3.select('svg')
    .on('mousemove', handleMousemove);
}

function updateQuadtree() {
  quadtree.addAll(data);
}

function update() {
  d3.select('svg')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', function(d) { return d.r; })
    .style('fill', function(d) { return d.id === hoveredId ? 'red' : null;});
}

updateData();
updateQuadtree();
update();
initEvents();
In handleMousemove we use d3.pointer which given the event object e and an HTML/SVG element, returns the mouse position relative to the HTML/SVG element. In our example, this is the SVG element because this is the element .on was called on (see initEvents).

Now your mouse pointer only needs to be within 20 pixels of its nearest circle:



D3's quadtree is also used by d3.forceCollide when detecting collisions in the force layout.

Delaunay triangles

You can also use D3's Delaunay module for finding closest points. Given an array of points, a Delaunay triangulation connects all the points with triangles in such a way that slivers are minimised.

As with the quadtree, Delaunay triangles have several uses but we'll just demonstrate how they can be used to find nearest points.

You can create Delaunay triangles using the .from method on d3.Delaunay:

let triangles = d3.Delaunay.from([[50, 100], [100, 100]]);
You can then search for the nearest point to a coordinate x, y using:

let i = triangles.find(55, 105); // returns 0
The .find method returns the array index of the nearest point. Unlike the quadtree, adding a maximum distance as the third argument isn't supported.

Here's a full example that uses Delaunay triangulation to find the closest point (click 'Edit in CodePen' to view the code):



Dragging

D3 has a module for adding drag behaviour to elements. Dragging is where you hover over an element, press the mouse button, move the pointer, then release the mouse button, in order to move the element. D3's drag module also supports touch gestures.

(I rarely need to add drag behaviour to data visualizations so feel free to skip this section if it isn't important to you!)

There's three steps to making HTML/SVG elements draggable:

call d3.drag() to create a drag behaviour function
add an event handler that's called when a drag event occurs. The event handler receives an event object with which you can update the position of the dragged element
attach the drag behaviour to the elements you want to make draggable
Calling d3.drag() creates a drag behaviour:

let drag = d3.drag();
A drag behaviour is a function that adds event listeners to elements. It also has methods such as .on defined on it.

You can attach an event handler to the drag behaviour by calling the .on method. This accepts two arguments:

the event type ('drag', 'start' or 'end')
the name of your event handler function
function handleDrag(e) {
 // update the dragged element with its new position
}

let drag = d3.drag()
  .on('drag', handleDrag);
The event types are 'drag', 'start' and 'end'. 'drag' indicates a drag. 'start' indicates the start of the drag (e.g. the user has pressed the mouse button). 'end' indicates the end of the drag (e.g. the user has released the mouse button).

handleDrag receives a single parameter e which is an object representing the drag event. The drag event object has several properties, the most useful of which are:

Property name	Description
.subject	The joined data of the dragged element (or a fallback object)
.x & .y	The new coordinates of the dragged element
.dx & .dy	The new coordinates of the dragged element, relative to the previous coordinates
You can see a full list of drag event properties in the official documentation.

If the dragged element was created by a data join and the joined data has x and y properties, the x and y properties of the drag event object are computed such that the relative position of the element and pointer are maintained. (This prevents the element's center 'snapping' to the pointer position.) Otherwise x and y are the pointer position relative to the dragged element's parent element.

You attach the drag behaviour to elements by selecting the elements and passing the drag behaviour into the .call method.

For example to add drag behaviour to circle elements:

d3.select('svg')
  .selectAll('circle')
  .call(drag);
The drag behaviour is a function that sets up event listeners on the selected elements (each circle element in the above example). When drag events occur the event handler (handleDrag in the above examples) is called.

Examples

In the following code an array of random coordinates is joined to circle elements (updateData and update).

A drag behaviour is created using d3.drag() and attached to the circle elements (initDrag).

When a circle is dragged, handleDrag gets called and an event object e is passed in as the first argument. e.subject represents the joined data of the dragged element. The x and y properties of the joined data are updated to e.x and e.y. update is then called to update the circle positions.

let data = [], width = 600, height = 400, numPoints = 10;

let drag = d3.drag()
  .on('drag', handleDrag);

function handleDrag(e) {
  e.subject.x = e.x;
  e.subject.y = e.y;
  update();
}

function initDrag() {
  d3.select('svg')
    .selectAll('circle')
    .call(drag);
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
  d3.select('svg')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', 40);
}

updateData();
update();
initDrag();
Notice that the relative position of the pointer and dragged circle is maintained (try initiating a drag near the edge of a circle):



Brushing

Brushing lets you user specify an area (by pressing the mouse button, moving the mouse, then releasing) in order to, for example, select a group of elements.

Try selecting circles by pressing the mouse button, dragging, then releasing the button:



D3 has a module for adding brushing behaviour to an element (or, less commonly, multiple elements).

There's three steps to adding brush behaviour to an HTML or SVG element:

call d3.brush() to create a brush behaviour function
add an event handler that's called when a brush event occurs. The event handler receives the brush extent which can then be used to select elements, define a zoom area etc.
attach the brush behaviour to an element (or elements)
Calling d3.brush() creates a brush behaviour:

let brush = d3.brush();
A brush behaviour is a function that has methods such as .on defined on it. The function itself adds event listeners to an element as well as additional elements (mainly rect elements) for rendering the brush extent.

You can attach an event handler to a brush behaviour by calling the .on method. This accepts two arguments:

the event type ('brush', 'start' or 'end')
the name of your event handler function
function handleBrush(e) {
 // get the brush extent and use it to, for example, select elements
}

let brush = d3.brush()
  .on('brush', handleBrush);
The event types are 'brush', 'start' and 'end'. 'brush' indicates that the brush extent has changed. 'start' indicates the brushing has started (e.g. the user has pressed the mouse button). 'end' indicates the end of brushing (e.g. the user has released the mouse button).

handleBrush receives a single parameter e which is an object representing the brush event. The most useful property on the brush event is .selection which represents the extent of the brush as an array [[x0, y0], [x1, y1]] where x0, y0 and x1, y1 are the opposite corners of the brush. Typically handleBrush will compute which elements are within the brush extent and update them accordingly.

You attach the brush behaviour to an element by selecting the element and passing the brush behaviour into the .call method:

d3.select('svg')
  .call(brush);
Examples

Basic example

In the following example a brush is created using d3.brush(). An event handler handleBrush is added to the brush behaviour using the .on method.

handleBrush gets called whenever brushing starts (the 'start' event type) or the brush extent changes (the 'brush' event type).

The brush behaviour is attached to the svg element by calling .call and passing in the brush behaviour (see initBrush).

let brush = d3.brush()
  .on('start brush', handleBrush);

function handleBrush(e) {
  // Use the brush extent e.selection to compute, for example, which elements to select
}

function initBrush() {
  d3.select('svg')
    .call(brush);
}

initBrush();
Full example

Here's a complete example where an array of random coordinates is joined to circle elements (updateData and update). When the brush is active, the circles within the brush extent are coloured red.

The brush is initialised in initBrush. (Note that it's attached to a g element within the svg element, in order to keep the elements used to render the brush separate to the circles.)

When brushing occurs, handleBrush is called. This receives a brush event object e which has a property selection that defines the extent of the brush. This is saved to the variable brushExtent and update is called.

update performs the data join and colours circles red if they're within the extent defined by brushExtent (see isInBrushExtent):

let data = [], width = 600, height = 400, numPoints = 100;

let brush = d3.brush()
  .on('start brush', handleBrush);

let brushExtent;

function handleBrush(e) {
  brushExtent = e.selection;
  update();
}

function initBrush() {
  d3.select('svg g')
    .call(brush);
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

function isInBrushExtent(d) {
  return brushExtent &&
    d.x >= brushExtent[0][0] &&
    d.x <= brushExtent[1][0] &&
    d.y >= brushExtent[0][1] &&
    d.y <= brushExtent[1][1];
}

function update() {
  d3.select('svg')
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', function(d) { return d.x; })
    .attr('cy', function(d) { return d.y; })
    .attr('r', 4)
    .style('fill', function(d) {
      return isInBrushExtent(d) ? 'red' : null;
    });
}

initBrush();
updateData();
update();


One dimensional brushes

D3 also provides brushes d3.brushX and d3.brushY that constrain the brush to a single dimension.

They work in a simlar fashion to d3.brush, the main difference being the event object's .selection property which is an array of two numbers [min, max] which represent the extent of the brush.

Here's an example using d3.brushX:



Programmatic control of brushing

You can also set the brush extent programmatically. For example you can create a button that sets the brush to maximum size.

The brush behaviour has two methods for setting the brush extent .move and .clear. The first sets the brush extent to [[x0, y0], [x1, y1]] and the second clears the brush.

.move and .clear should be called on the element that receives the brush gestures. For example:

d3.select('svg g')
  .call(brush.move, [[50, 50], [100, 100]]);
Here's an example that has two buttons. One button sets the brush extent to the size of the svg element and the other button clears the brush:
