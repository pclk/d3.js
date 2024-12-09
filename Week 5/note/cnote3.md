# D3 Zoom and Pan Guide

## Core Concepts

### Zoom Behavior
**Definition**: A D3 functionality that handles zoom and pan interactions.
**Fact**: D3 provides a 'd3.zoom' module that can be applied to both HTML and SVG elements.

### Transform
**Definition**: An object containing scale and translate properties that defines element transformation.
**Fact**: When zoom/pan gestures occur, D3 computes a transform consisting of:
- x (horizontal translation)
- y (vertical translation)
- k (scale factor)
- Has a .toString method for which generates a string such as "translate(38.9,-4.1) scale(1.3)"
- Thus, e.toString can be directly passed into .attr method

## Implementation

### d3.zoom()
**Definition**: A core function that creates zoom behavior functionality.
**Fact**: Creating zoom behavior requires three steps:
1. Call d3.zoom() to create zoom behavior
2. Add an event handler
3. Attach zoom behavior to an element

### Event Handlers
**Definition**: Functions that process zoom and pan events using the .on() method.
**Facts**:
- Handlers receive an 'e' parameter containing transform information
- Three event types exist:
  - 'zoom': Indicates transform changes
  - 'start': Indicates beginning of interaction
  - 'end': Indicates completion of interaction

### .call()
**Definition**: Method used to attach zoom behavior to DOM elements.
**Fact**: The element receiving gestures should be different from elements being transformed for proper functionality.

## Constraints

### .scaleExtent()
**Definition**: Method to set minimum and maximum zoom scale constraints.
**Fact**: Controls how far users can zoom in and out using [min, max] parameters.

### .translateExtent()
**Definition**: Method to set boundaries for panning.
**Fact**: Defines the boundaries [[x0, y0], [x1, y1]] that users cannot pan beyond.


## Programmatic Control

### Transform Methods
**Definitions**:
- `.translateBy`: Adds offset to current transform
- `.translateTo`: Centers transform on specific coordinates
- `.scaleBy`: Multiplies current scale factor
- `.scaleTo`: Sets specific scale factor
- `d3.zoomIdentity`: Base transform object for zoom operations

**Facts**:
- Methods should be called on the element receiving zoom gestures
- Must be implemented through .call()
- Can be combined with transitions for smooth effects
