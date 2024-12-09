# Singapore Commercial Property Visualization Project TODO

Global variables:
global filters slider:
- Sale date
- Transacted Price
- Area SQM
- Lease years
includes reset all button
includes presets: Luxury, Small Office spaces etc.
includes timeline tour: stepping through the data sequentially and animating the charts accordingly

select dropdown -> slider:
Slider notes: when value is chosen, timeline tour checkbox will be false. if checked, extra input to input step-size. This step-size is integer and unit will be hardcoded.

View value 
- Transacted Price (default)
- Area (SQM)
- Lease years

select dropdown -> categorization multiselect dropdown:
Group by
- Property Type (default)
- Postal district: could be combined with district name, they have 0.998 correlation
- Tenure type
- Type of area

tooltip considerations:
Project and street name.

Chart considerations:
Global note: they all will be affected by the global filters.
Global note: they will all have a gear icon on hover, which allows the chart to not inherit from global, and have their own X&Y& group by values

- Start with broad market composition (Stacked Area)
X: Sales date 
Y: View value (default Price: Transacted Price)
Stack: Group by (default Property Type)

- Dive into spatial patterns (Heatmap)
X: Group by (default Property Type)
Y: View value (default Price: Transacted Price)

- Examine price distributions (Violin Plot)
https://d3-graph-gallery.com/graph/violin_jitter.html
X: Group by (default Property Type)
Y: View value (default Price: Transacted Price)

- Explore detailed price-size relationships (Scatterplot)
https://observablehq.com/@d3/connected-scatterplot/2
X: View value (default Area (SQM)) ->
Y: View value (default Price: Transacted Price)
Color: Group by (default Property Type)


Step 1: Build and log the global filter
Step 2: Build and log the View value and Group by
Step 3: Build chart specific View value and Group by (looks like a gear on the top right)
Step 4: Build the charts
