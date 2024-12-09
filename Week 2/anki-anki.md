model: Basic

# Note
model: Cloze

## Text
The 6 data types in d3 are {{c1::Tabular data}}, {{c2::Nested data}}, {{c3::Network data}}, {{c4::Geographical data}}, {{c5::Raw data}}, and {{c6::Objects}}

## Back Extra


# Note
model: Cloze

## Text
The 3 ways to load tabular data into d3 is {{c1::d3.csv()}}, {{c2::d3.tsv()}, and {{d3.dsv()}}

## Back Extra


# Note

## Front
What is d3.dsv()?

## Back
Declare delimiter

# Note

## Front
What is the definition of Tabular Data?

## Back
Data that appears in rows and columns typically found in spreadsheets or database tables.

# Note

## Front
What is the definition of Nested Data?

## Back
Data with objects that recursively exist as children of other objects

# Note

## Front
What is Network Data?

## Back
Data that are represented as node-link diagrams, and are the output of social networking streams, transportation networks, or a flowchart

# Note
model: Cloze

## Text
The 3 sources of Network data are {{c1::social network streams}}, {{c2::transportation networks}}, or {{c3::flowchart}}

## Back Extra


# Note
model: Cloze

## Text
The 2 standards for Network data are {{c1::node/edge list}} and {{c2::connected arrays}}

## Back Extra


# Note

## Front
How to transform network data into a node-link diagram?

## Back
Use freely available network tools like Gephi

# Note

## Front
What is the definition of Geographical Data?

## Back
Data that refers to locations either as points or shapes.

# Note

## Front
What is the definition of Raw Data?

## Back
Unstructured data like images, text and videos.

# Note

## Front
What is the definition of Literals?

## Back
A literal can be string literals ("Apple"), or number literals (23).

# Note
model: Cloze

## Text
The 5 step Working with Data process in d3 is {{c1::Load}}, {{c2::Format}}, {{c3::Measure}}, {{c4::Create}} and {{c5::Update}}

## Back Extra


# Note

## Front
What's the difference between JSON and XML vs CSV?

## Back
JSON and XML allows you to encode nested relationships

# Note

## Front
What's the difference between CSV vs XML?

## Back
CSV produces an array of objects, but XML creates an XML document.

Note that the lecture says both JSON and CSV produces an array of objects.

# Note

## Front
What's the difference between JSON vs CSV?

## Back
CSV will always produce an array objects

# Note

## Front
What's the similarity with d3.json() and d3.csv()?

## Back
They are asynchronous

# Note
model: Cloze

## Text
The two ways to get around async when loading data with d3.json() and d3.csv() is to {{c1::nest the function operating on d3.json() or d3.csv()}}, or to {{c2::use a helper library like queue.js, to trigger events upon completion of the loading of one or more files.}}

## Back Extra


# Note

## Front
Why is Format the next step after Load?

## Back
Make sure data is usable by JavaScript functions to create graphics

# Note
model: Cloze

## Text
The 6 data types defined in the Formatting Data step is {{c1::Quantitative}}, {{c2::Categorical}}, {{c3::Topological}}, {{c4::Geometric}}, {{c5::Temporal}}, and {{c6::Raw}}.

## Back Extra


# Note

## Front
What is the most common data type in data visualization?

## Back
Quantitative

# Note
model: Cloze

## Text
We can represent Quantitative data with {{c1::size}}, {{c2::position}}, or {{c3::color}}.

## Back Extra


# Note

## Front
What do you usually have to do with Quantitative data in the Formatting Data step?

## Back
Normalize by defining scales using d3.scale()

# Note
model: Cloze

## Text
The 2 things we usually do with Quantitative data in the Formatting Data is to {{c1::Normalize by defining scales using d3.scale()}}, or by {{c2::transforming your quantitative data into categorical data using quantiles}}

## Back Extra


# Note

## Front
What are quantiles?

## Back
Group numerical values

# Note
model: Cloze

## Text
We can represent Categorical data with {{c1::shapes}} or {{c2::color}}.

## Back Extra


# Note

## Front
What is the definition of Topological data?

## Back
Data that describes relationship of one piece of data to another.

# Note
model: Cloze

## Text
Two examples of Topological data are the {{c1::genealogical connection between two people}} and {{c2::the distance of a shop from a train station}}.

## Back Extra


# Note

## Front
What is the definition of Geometric data?

## Back
Data that is most commonly associated with the boundaries and tracks of geometric data.

# Note
model: Cloze

## Text
We can represent Geometric data with {{c1::shapes}} and {{c2::size}}.

## Back Extra


# Note

## Front
What data type is SVG code considered to be, if it allows you to draw a particular desired icon?

## Back
Geometric

# Note

## Front
What is the most common Temporal data format?

## Back
ISO 8601

# Note
model: Cloze

## Text
We can utilize Raw data by {{c1::measuring it}}, or using {{c2::sophisticated text and image analysis to derive attributes more suited to data visualization}}.

## Back Extra


# Note
model: Cloze

## Text
The unaltered form of Raw data can be used in the {{c1::content fields of graphical elements, such as in labels or snippets}}

## Back Extra


# Note
model: Cloze

## Text
The ways to transform data as part of the 5 step Working with Data workflow in d3 is with {{c1::casting}}, {{c2::normalising/scaling}}, {{c3::binning/grouping}}, and {{c4::nesting}} data.

## Back Extra


# Note

## Front
What is casting data?

## Back
Turning one datatype into another

# Note

## Front
Why do we do scaling?

## Back
Make numerical data directly correspond with the position and size of onscreen graphical element.

# Note
model: Cloze

## Text
We can create a color ramp by referencing {{c1::CSS color names}}, {{c2::RGB colors}}, or {{c3::hex colors}} in the {{c4::range}} field on d3.scale.linear()

## Back Extra


# Note

## Front
What is the d3 scale that is compatible with date datatypes?

## Back
d3.time.scale()

# Note

## Front
How to we bin/group data?

## Back
d3.scale.quantile()

# Note
model: Cloze

## Text
Unlike other scales, d3.scale.quantile() gives no error if {{c1::there's a mismatch between the number of .domain() and .range() values}}.

## Back Extra


# Note

## Front
How does d3.scale.quantile() split the data into the range parameter?

## Back
Ascending sort data and equally split by len(range).

# Note

## Front
What is the concept behind nesting?

## Back
Shared attributes of data can be used to sort them into discrete categories.

# Note

## Front
How do we nest in d3?

## Back
d3.nest().key(()=>{}).entries(\[{}\])

# Note

## Front
Why is Measure after Format?

## Back
After formatting, you should proceed to understand distribution, minmax and names of attributes.

# Note
model: Cloze

## Text
The four ways stated in Format to measure data is {{c1::d3.min()}}, {{c2::d3.max()}}, {{c3::d3.mean()}} and {{c4::d3.extent()}}.

## Back Extra


# Note

## Front
How to measure non-numerical data?

## Back
str.length()

# Note

## Front
How to measure Topological data?

## Back
Centrality and clustering

# Note

## Front
How to measure Geometric data?

## Back
Calculate area and perimeter

# Note
model: Cloze

## Text
A selection consists of an amount of {{c1::one or more}} elements in the DOM.

## Back Extra


# Note
model: Cloze

## Text
The common selection and binding procedure for html elements are as follows: {{c1::d3.selectAll()}}, {{c2::.data()}}, {{c3::.enter() / .exit()}}, {{c4::.append() / .insert()}}, {{c5::.attr()}} and {{c6::.html()}}

## Back Extra


# Note

## Front
Why do you want to create an empty selection in the selection and binding procedure?

## Back
To create new elements with .enter()

# Note
model: Cloze

## Text
Note that a selection won't automatically {{c1::generate a element}}. It must already exist, or you'll need to {{c2::create one using .append()}}

## Back Extra


# Note

## Front
What does .data() do?

## Back
Associate an array with the DOM elements you selected.

# Note

## Front
How do you manually access the binded data of the attribute element <circle class="cities"/>

## Back
document.getElementByClassName("cities")\[0\].__data__

# Note

## Front
When does the .enter() function trigger?

## Back
When there are more data values than DOM elements.

# Note

## Front
When does .exit() function trigger:

## Back
When there are less number of data values than DOM elements

# Note

## Front
When will neither .enter() and .exit() trigger

## Back
When there are equal number of data values and DOM elements

# Note

## Front
How do you add more elements?

## Back
.append()

# Note

## Front
What's the difference between .append() and .insert()?

## Back
.insert() allows you to control where in the DOM you add the new element

# Note

## Front
What do you need to do after .append()?

## Back
.attr()

# Note

## Front
What does .html() do?

## Back
Set the content of a HTML element.

