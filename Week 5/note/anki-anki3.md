model: Basic

# Note
model: Cloze

## Text
{{c1::Zoom Behavior}} refers to a D3 functionality that handles zoom and pan interactions.

## Back Extra


# Note
model: Cloze

## Text
{{c1::d3.zoom module}} is what D3 provides to apply zoom and pan interactions to both HTML and SVG elements.

## Back Extra


# Note
model: Cloze

## Text
{{c1::Transform}} refers to an object containing scale and translate properties that defines element transformation.

## Back Extra


# Note
model: Cloze

## Text
When zoom/pan gestures occur, D3 computes a transform where {{c1::x}} refers to horizontal translation.

## Back Extra


# Note
model: Cloze

## Text
When zoom/pan gestures occur, D3 computes a transform where {{c1::y}} refers to vertical translation.

## Back Extra


# Note
model: Cloze

## Text
When zoom/pan gestures occur, D3 computes a transform where {{c1::k}} refers to scale factor.

## Back Extra


# Note
model: Cloze

## Text
{{c1::.toString}} is a transform method that generates a string such as "translate(38.9,-4.1) scale(1.3)" which can be directly passed into .attr method.

## Back Extra


# Note
model: Cloze

## Text
{{c1::d3.zoom()}} is a core function that creates zoom behavior functionality.

## Back Extra


# Note
model: Cloze

## Text
The first step to create zoom behavior is to {{c1::call d3.zoom() to create zoom behavior}}.

## Back Extra


# Note
model: Cloze

## Text
The second step to create zoom behavior is to {{c1::add an event handler}}.

## Back Extra


# Note
model: Cloze

## Text
The third step to create zoom behavior is to {{c1::attach zoom behavior to an element}}.

## Back Extra


# Note
model: Cloze

## Text
{{c1::Event Handlers}} are functions that process zoom and pan events using the .on() method.

## Back Extra


# Note
model: Cloze

## Text
{{c1::The 'e' parameter}} is what handlers receive containing transform information.

## Back Extra


# Note
model: Cloze

## Text
{{c1::zoom}} is the event type that indicates transform changes in zoom behavior.

## Back Extra


# Note
model: Cloze

## Text
{{c1::start}} is the event type that indicates beginning of interaction in zoom behavior.

## Back Extra


# Note
model: Cloze

## Text
{{c1::end}} is the event type that indicates completion of interaction in zoom behavior.

## Back Extra


# Note
model: Cloze

## Text
The element {{c1::receiving gestures}} should be different from elements {{c2::being transformed}} for proper functionality when implementing zoom behavior.

## Back Extra


# Note
model: Cloze

## Text
{{c1::.scaleExtent()}} is the method used to set minimum and maximum zoom scale constraints.

## Back Extra


# Note
model: Cloze

## Text
{{c1::[min, max] parameters}} are what controls how far users can zoom in and out in scaleExtent().

## Back Extra


# Note
model: Cloze

## Text
{{c1::.translateExtent()}} is the method used to set boundaries for panning.

## Back Extra


# Note
model: Cloze

## Text
{{c1::[[x0, y0], [x1, y1]]}} refers to the boundaries that users cannot pan beyond in translateExtent().

## Back Extra


# Note
model: Cloze

## Text
{{c1::.translateBy}} is the transform method that adds offset to current transform.

## Back Extra


# Note
model: Cloze

## Text
{{c1::.translateTo}} is the transform method that centers transform on specific coordinates.

## Back Extra


# Note
model: Cloze

## Text
{{c1::.scaleBy}} is the transform method that multiplies current scale factor.

## Back Extra


# Note
model: Cloze

## Text
{{c1::.scaleTo}} is the transform method that sets specific scale factor.

## Back Extra


# Note
model: Cloze

## Text
{{c1::d3.zoomIdentity}} refers to the base transform object for zoom operations.

## Back Extra


# Note
model: Cloze

## Text
Transform Methods must be implemented through {{c1::.call()}} for proper functionality.

## Back Extra


# Note
model: Cloze

## Text
{{c1::Transform methods}} are what should be called on the element receiving zoom gestures.

## Back Extra


# Note
model: Cloze

## Text
Transform methods can be combined with {{c1::transitions}} for smooth effects.

## Back Extra


