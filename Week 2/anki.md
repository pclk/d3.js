# The 6 data types in d3 are {{Tabular data}}, {{Nested data}}, {{Network data}}, {{Geographical data}}, {{Raw data}}, and {{Objects}}

# The 3 ways to load tabular data into d3 is {{d3.csv()}}, {{d3.tsv()}, and {{d3.dsv()}}

# What is d3.dsv()?
Declare delimiter

# What is the definition of Tabular Data?
Data that appears in rows and columns typically found in spreadsheets or database tables.

# What is the definition of Nested Data?
Data with objects that recursively exist as children of other objects

# What is Network Data?
Data that are represented as node-link diagrams, and are the output of social networking streams, transportation networks, or a flowchart

# The 3 sources of Network data are {{social network streams}}, {{transportation networks}}, or {{flowchart}}

# The 2 standards for Network data are {{node/edge list}} and {{connected arrays}}

# How to transform network data into a node-link diagram?
Use freely available network tools like Gephi

# What is the definition of Geographical Data?
Data that refers to locations either as points or shapes.

# What is the definition of Raw Data?
Unstructured data like images, text and videos. 

# What is the definition of Literals?
A literal can be string literals ("Apple"), or number literals (23).

# The 5 step Working with Data process in d3 is {{Load}}, {{Format}}, {{Measure}}, {{Create}} and {{Update}}

# What's the difference between JSON and XML vs CSV?
JSON and XML allows you to encode nested relationships

# What's the difference between CSV vs XML?
CSV produces an array of objects, but XML creates an XML document.

Note that the lecture says both JSON and CSV produces an array of objects.

# What's the difference between JSON vs CSV?
CSV will always produce an array objects

# What's the similarity with d3.json() and d3.csv()?
They are asynchronous

# The two ways to get around async when loading data with d3.json() and d3.csv() is to {{nest the function operating on d3.json() or d3.csv()}}, or to {{use a helper library like queue.js, to trigger events upon completion of the loading of one or more files.}}

# Why is Format the next step after Load?
Make sure data is usable by JavaScript functions to create graphics

# The 6 data types defined in the Formatting Data step is {{Quantitative}}, {{Categorical}}, {{Topological}}, {{Geometric}}, {{Temporal}}, and {{Raw}}.

# What is the most common data type in data visualization?
Quantitative

# We can represent Quantitative data with {{size}}, {{position}}, or {{color}}.

# What do you usually have to do with Quantitative data in the Formatting Data step?
Normalize by defining scales using d3.scale()

# The 2 things we usually do with Quantitative data in the Formatting Data is to {{Normalize by defining scales using d3.scale()}}, or by {{transforming your quantitative data into categorical data using quantiles}}

# What are quantiles?
Group numerical values

# We can represent Categorical data with {{shapes}} or {{color}}.

# What is the definition of Topological data?
Data that describes relationship of one piece of data to another.

# Two examples of Topological data are the {{genealogical connection between two people}} and {{the distance of a shop from a train station}}.

# What is the definition of Geometric data?
Data that is most commonly associated with the boundaries and tracks of geometric data.

# We can represent Geometric data with {{shapes}} and {{size}}.

# What data type is SVG code considered to be, if it allows you to draw a particular desired icon? 
Geometric

# What is the most common Temporal data format?
ISO 8601

# We can utilize Raw data by {{measuring it}}, or using {{sophisticated text and image analysis to derive attributes more suited to data visualization}}.

# The unaltered form of Raw data can be used in the {{content fields of graphical elements, such as in labels or snippets}}

# The ways to transform data as part of the 5 step Working with Data workflow in d3 is with {{casting}}, {{normalising/scaling}}, {{binning/grouping}}, and {{nesting}} data. 

# What is casting data?
Turning one datatype into another

# Why do we do scaling?
Make numerical data directly correspond with the position and size of onscreen graphical element.

# We can create a color ramp by referencing {{CSS color names}}, {{RGB colors}}, or {{hex colors}} in the {{range}} field on d3.scale.linear()

# What is the d3 scale that is compatible with date datatypes?
d3.time.scale()

# How to we bin/group data?
d3.scale.quantile()

# Unlike other scales, d3.scale.quantile() gives no error if {{there's a mismatch between the number of .domain() and .range() values}}.

# How does d3.scale.quantile() split the data into the range parameter?
Ascending sort data and equally split by len(range).

# What is the concept behind nesting?
Shared attributes of data can be used to sort them into discrete categories.

# How do we nest in d3?
d3.nest().key(()=>{}).entries(\[{}\])

# Why is Measure after Format?
After formatting, you should proceed to understand distribution, minmax and names of attributes.

# The four ways stated in Format to measure data is {{d3.min()}}, {{d3.max()}}, {{d3.mean()}} and {{d3.extent()}}.

# How to measure non-numerical data?
str.length()

# How to measure Topological data?
Centrality and clustering

# How to measure Geometric data?
Calculate area and perimeter

# A selection consists of an amount of {{one or more}} elements in the DOM.

# The common selection and binding procedure for html elements are as follows: {{d3.selectAll()}}, {{.data()}}, {{.enter() / .exit()}}, {{.append() / .insert()}}, {{.attr()}} and {{.html()}}

# Why do you want to create an empty selection in the selection and binding procedure?
To create new elements with .enter()

# Note that a selection won't automatically {{generate a element}}. It must already exist, or you'll need to {{create one using .append()}}

# What does .data() do?
Associate an array with the DOM elements you selected.

# How do you manually access the binded data of the attribute element <circle class="cities"/>
document.getElementByClassName("cities")\[0\].__data__

# When does the .enter() function trigger?
When there are more data values than DOM elements.

# When does .exit() function trigger:
When there are less number of data values than DOM elements

# When will neither .enter() and .exit() trigger
When there are equal number of data values and DOM elements

# How do you add more elements?
.append()

# What's the difference between .append() and .insert()?
.insert() allows you to control where in the DOM you add the new element

# What do you need to do after .append()?
.attr()

# What does .html() do?
Set the content of a HTML element.
