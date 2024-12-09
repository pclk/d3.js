# {{Quadtree}} is a tree data structure that recursively divides an area into smaller areas, making searching for items more efficient.

# {{d3.quadtree()}} refers to the method that creates a new quadtree.

# {{.add([x, y])}} refers to the quadtree method that adds a single point.

# {{.addAll(points)}} refers to the quadtree method that adds multiple points.

# {{.find(x, y, distance)}} refers to the quadtree method that finds the nearest point.

# {{.x(d => d.x)}} refers to the method that defines the x-coordinate accessor function in quadtree.

# {{.y(d => d.y)}} refers to the method that defines the y-coordinate accessor function in quadtree.

# {{distance}} refers to the optional parameter in quadtree search that sets radius limitation.

# {{d3.forceCollide}} refers to the force layout where quadtree is used for collision detection.

# {{Delaunay Triangulation}} is a method connecting points with triangles minimizing slivers.

# {{d3.Delaunay.from(points)}} refers to the method that creates a triangulation.

# {{.find(x, y)}} refers to the Delaunay method that returns the nearest point index.

# {{Quadtree}} refers to the structure that supports maximum distance parameters.

# {{Delaunay}} refers to the structure that returns index.

# {{Quadtree}} refers to the structure that returns coordinates.

# {{Delaunay}} refers to the structure that is better for geometric calculations

# {{Quadtree}} refers to the structure that is better for point searching operations.

# {{Drag}} refers to an interaction system for element movement that supports mouse and touch gestures.

# {{d3.drag()}} refers to the method that creates a drag behavior.

# {{drag}} refers to the event type that occurs during movement of dragging.

# {{start}} refers to the event type that occurs at the beginning of dragging.

# {{end}} refers to the event type that occurs upon completion of dragging.

# {{.x, .y}} refers to the event object properties that contain the new coordinates of the dragged element.

# {{.dx, .dy}} refers to the event object properties that contain the relative coordinate changes during dragging.

# {{e.subject}} refers to the property used to access the dragged element's data within the event handler.

# {{Brush}} refers to an area selection system that supports single and multi-dimensional selection with programmable control capabilities.

# {{d3.brush()}} refers to the method that creates a 2D brushing behavior.

# {{d3.brushX()}} refers to the method that creates horizontal-only brushing.

# {{d3.brushY()}} refers to the method that creates vertical-only brushing.

# {{.move(selection, extent)}} refers to the brush method that sets brush programmatically.

# {{.clear()}} refers to the brush method that removes selection.

# {{[[x0, y0], [x1, y1]]}} refers to the format for 2D brush selection.

# {{[min, max]}} refers to the format for 1D brush selection.

# {{brush}} refers to the event type that occurs during selection.

# {{start}} refers to the event type that occurs at brush initiation.

# {{end}} refers to the event type that occurs upon brush completion.

# {{.selection}} refers to the event object property that represents extent of brush and returns coordinates of opposite corners.

# {{.call(behavior)}} refers to the selection method used to attach behaviors.

# {{.join()}} refers to the selection method used to handle data binding.

# {{d3.pointer(event, container)}} refers to the event utility method that gets relative coordinates.
