# {{Layouts}} are a {{preprocessing}} step that {{formats}} your data so that it's ready to be {{displayed}} in the form you've chosen.

# You pass {{d3.histogram}} an {{data array}}, a {{number of bins}}, and a {{scale}}, and it returns you an array of {{bins}} filled with the data that has been extended with {{x0 and x1}} values.

# The more {{thresholds}}, the {{smoother}} any distribution chart will look.

# d3.histograms can not only generate histograms but also {{violin}} plots.

# You pass {{d3.pie}} an {{data array}} and returns you an array of {{objects}} filled with the values by the name of {{startAngle and endAngle}}, which can be used by the {{generator}} {{d3.arc}}.

# When the pie layout measures data, it also {{sorts}} it in {{descending}} order. And when you call the layout again, it {{re-sorts}} the data.

# .attrTween expects a function that takes the {{current}} {{transition}} value, which is a {{float}} between {{0}} and {{1}}, and returns the {{interpolated}} value.

# To use a layout, {{process}} the data to match {{requirements}}, set the {{accessor}} functions of layout, call the {{layout}} on the data, and either send the layout data directly to {{SVG}} or paired with a {{generator}}.

# You pass {{d3.stack}} an {{array of objects}} with a {{categorical}} data and a {{array of quantitative}} data, and it returns an array where each {{key}} represents a {{series}}, containing an array of [y0, y1] values.

# To produce the best streamgraph effect, use {{d3.stackOffsetSilhouette}} for the {{.offset()}} method and use {{d3.stackOrderInsideOut}} for the {{.order()}} method.

# d3.stack() can produce {{stacked area}} charts, {{stacked bar}} charts, and {{stream graphs}}.
