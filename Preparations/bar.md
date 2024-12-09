[toc]
## Complete Bar Chart with Axes and Labels

```javascript
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 };
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

/* ADD: Labels */
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 110)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("The word's tallest buildings");

g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -(HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Height (m)");

d3.json("data/buildings.json").then(data => {
  data.forEach(d => {
    d.height = Number(d.height);
  });

  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2);
  
  /* CHANGE: Y scale range for inverted axis */
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.height)])
    .range([HEIGHT, 0]);

  /* ADD: Axes */
  const xAxisCall = d3.axisBottom(x);
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(xAxisCall)
    .selectAll("text")
      .attr("y", "10")
      .attr("x", "-5")
      .attr("text-anchor", "end")
      .attr("transform", "rotate(-40)");

  const yAxisCall = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => d + "m");
  g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall);

  const rects = g.selectAll("rect")
    .data(data);
  
  rects.enter().append("rect")
    .attr("y", d => y(d.height))
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d.height))
    .attr("fill", "grey");
});
```

## Basic Bar Chart with Linear Scale
```javascript
const svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400);

d3.json("./data/buildings.json").then(data => {
  data.forEach(d => {
    d.height = Number(d.height);
  });

  /* ADD: Linear scale for height */
  const y = d3.scaleLinear()
    .domain([0, 828])
    .range([0, 400]);

  const rects = svg.selectAll("rect")
    .data(data);

  rects.enter().append("rect")
    .attr("y", 0)
    .attr("x", (d, i) => (i * 60))
    .attr("width", 40)
    /* CHANGE: Use scale for height */
    .attr("height", d => y(d.height))
    .attr("fill", "grey");
});
```

## Adding Band Scale
```javascript
const svg = d3.select("#chart-area").append("svg")
  .attr("width", 400)
  .attr("height", 400);

d3.json("./data/buildings.json").then(data => {
  data.forEach(d => {
    d.height = Number(d.height);
  });

  /* ADD: Band scale for x-axis */
  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, 400])
    .paddingInner(0.3)
    .paddingOuter(0.2);
  
  const y = d3.scaleLinear()
    .domain([0, 828])
    .range([0, 400]);

  const rects = svg.selectAll("rect")
    .data(data);
  
  rects.enter().append("rect")
    .attr("y", 0)
    /* CHANGE: Use band scale for x position */
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth)
    .attr("height", d => y(d.height))
    .attr("fill", "grey");
});
```

## Adding Margins and Group
```javascript
/* ADD: Margin convention */
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 };
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT;
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM;

/* CHANGE: SVG dimensions */
const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM);

/* ADD: Group element with margin transform */
const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`);

d3.json("./data/buildings.json").then(data => {
  data.forEach(d => {
    d.height = Number(d.height);
  });

  const x = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2);
  
  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.height)])
    .range([0, HEIGHT]);

  /* CHANGE: Append rectangles to group instead of svg */
  const rects = g.selectAll("rect")
    .data(data);
  
  rects.enter().append("rect")
    .attr("y", 0)
    .attr("x", d => x(d.name))
    .attr("width", x.bandwidth)
    .attr("height", d => y(d.height))
    .attr("fill", "grey");
});
```
## Starbucks Activity

### html
```html
<!doctype html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="description" content="">
	<title>Activity 1 - Star Break Coffee</title>
	<!-- Bootstrap -->
	<link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">
	<!-- Custom styling -->
	<link rel="stylesheet" href="css/style.css">
</head>
<body>
	<nav class="navbar navbar-light bg-light">
		<div class="container">
			<a class="navbar-brand" href="#"><img id="logo" src="img/logo.png"></a>      
		</div>
	</nav>

	<!-- Bootstrap grid setup -->
	<div class="container">
		<div class="row">
			<div id="chart-area"></div>
		</div>
	</div>

	<!-- External JS libraries -->
	<script src="https://d3js.org/d3.v7.min.js"></script>
	<script src="https://code.jquery.com/jquery-3.4.1.slim.min.js" integrity="sha384-J6qa4849blE2+poT4WnyKhv5vZF5SrPo0iEjwBvKU7imGFAV0wwj1yYfoRSJoZ+n" crossorigin="anonymous"></script>
	<script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
	<script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
	<!-- Custom JS -->
	<script src="js/main.js"></script>
</body>
</html>
```
### js
```js
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// X label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 50)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month")

// Y label
g.append("text")
  .attr("class", "y axis-label")
  .attr("x", - (HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue ($)")

d3.csv("data/revenues.csv").then(data => {
  data.forEach(d => {
    d.revenue = Number(d.revenue)
  })

  const x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.revenue)])
    .range([HEIGHT, 0])

  const xAxisCall = d3.axisBottom(x)
  g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => d + "m")
  g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall)

  const rects = g.selectAll("rect")
    .data(data)

  rects.enter().append("rect")
    .attr("y", d => y(d.revenue))
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d.revenue))
    .attr("fill", "grey")
})
```
### with logging
```js
// Set margins and dimensions
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 130 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

console.log("Canvas dimensions:", { WIDTH, HEIGHT, MARGIN })

// Create SVG canvas
const svg = d3.select("#chart-area").append("svg")
  .attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
  .attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

if (!svg.empty()) {
  console.log("SVG created successfully with dimensions:", {
    width: WIDTH + MARGIN.LEFT + MARGIN.RIGHT,
    height: HEIGHT + MARGIN.TOP + MARGIN.BOTTOM
  })
} else {
  console.error("Failed to create SVG. Check if #chart-area exists")
}

// Create chart group
const g = svg.append("g")
  .attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

console.log("Main group created with translation:", { left: MARGIN.LEFT, top: MARGIN.TOP })

// X label
const xLabel = g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 50)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month")

console.log("X label positioned at:", { x: WIDTH / 2, y: HEIGHT + 50 })

// Y label
const yLabel = g.append("text")
  .attr("class", "y axis-label")
  .attr("x", -(HEIGHT / 2))
  .attr("y", -60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .attr("transform", "rotate(-90)")
  .text("Revenue ($)")

console.log("Y label positioned at:", { x: -(HEIGHT / 2), y: -60 })

// Load and process data
d3.csv("data/revenues.csv").then(data => {
  console.log("Raw data received:", data)

  // Process data
  data.forEach(d => {
    d.revenue = Number(d.revenue)
  })

  console.log("Processed data:", {
    dataPoints: data.length,
    samplePoint: data[0],
    revenues: data.map(d => d.revenue)
  })

  // Create scales
  const x = d3.scaleBand()
    .domain(data.map(d => d.month))
    .range([0, WIDTH])
    .paddingInner(0.3)
    .paddingOuter(0.2)

  const y = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.revenue)])
    .range([HEIGHT, 0])

  console.log("Scales created:", {
    xDomain: x.domain(),
    xRange: x.range(),
    yDomain: y.domain(),
    yRange: y.range(),
    bandwidth: x.bandwidth()
  })

  // Create and add X axis
  const xAxisCall = d3.axisBottom(x)
  const xAxis = g.append("g")
    .attr("class", "x axis")
    .attr("transform", `translate(0, ${HEIGHT})`)
    .call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)")

  console.log("X axis created at y:", HEIGHT)

  // Create and add Y axis
  const yAxisCall = d3.axisLeft(y)
    .ticks(3)
    .tickFormat(d => d + "m")
  const yAxis = g.append("g")
    .attr("class", "y axis")
    .call(yAxisCall)

  console.log("Y axis created with ticks:", yAxisCall.scale().ticks(3))

  // Create bars
  const rects = g.selectAll("rect")
    .data(data)

  console.log("Binding data to rectangles:", {
    dataPoints: data.length,
    boundElements: rects.size()
  })

  // Add bars to chart
  const bars = rects.enter().append("rect")
    .attr("y", d => y(d.revenue))
    .attr("x", d => x(d.month))
    .attr("width", x.bandwidth())
    .attr("height", d => HEIGHT - y(d.revenue))
    .attr("fill", "grey")

  console.log("Bars created:", {
    count: bars.size(),
    firstBar: {
      x: x(data[0].month),
      y: y(data[0].revenue),
      width: x.bandwidth(),
      height: HEIGHT - y(data[0].revenue)
    }
  })

}).catch(error => {
  console.error("Error loading or processing data:", error)
})

// Add error handling for D3 selections
const originalSelect = d3.select
d3.select = function (selector) {
  const selection = originalSelect.apply(this, arguments)
  if (selection.empty()) {
    console.warn(`No elements found for selector: ${selector}`)
  }
  return selection
}
```
