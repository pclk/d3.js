## Lab 4 Part 1 - Looping with Intervals
```js
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
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
  .attr("y", HEIGHT + 60)
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

  /*
    Answer for Lab 4 Part 1 - Looping with Intervals
    */
  d3.interval(() => {
    console.log("Hello World")
  }, 1000)
})
```
---

## Lab 4 Part 2 - Adding an update function

```js
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
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
  .attr("y", HEIGHT + 60)
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

const x = d3.scaleBand()
.range([0, WIDTH])
.paddingInner(0.3)
.paddingOuter(0.2)

const y = d3.scaleLinear()
.range([HEIGHT, 0])

const xAxisGroup = g.append("g")
.attr("class", "x axis")
.attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append("g")
.attr("class", "y axis")

d3.csv("data/revenues.csv").then(data => {
  data.forEach(d => {
    d.revenue = Number(d.revenue)
  })

  d3.interval(() => {
    update(data)
  }, 1000)

  update(data)
})

function update(data) {
  x.domain(data.map(d => d.month))
  y.domain([0, d3.max(data, d => d.revenue)])

  const xAxisCall = d3.axisBottom(x)
  xAxisGroup.call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
  .ticks(3)
  .tickFormat(d => d + "m")
  yAxisGroup.call(yAxisCall)

  // const rects = g.selectAll("rect")
  //   .data(data)

  // rects.enter().append("rect")
  //   .attr("y", d => y(d.revenue))
  //   .attr("x", (d) => x(d.month))
  //   .attr("width", x.bandwidth)
  //   .attr("height", d => HEIGHT - y(d.revenue))
  //   .attr("fill", "grey")
}
```
---

## Lab 4 Part 3 - D3 Update Pattern

```js
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
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
  .attr("y", HEIGHT + 60)
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

const x = d3.scaleBand()
.range([0, WIDTH])
.paddingInner(0.3)
.paddingOuter(0.2)

const y = d3.scaleLinear()
.range([HEIGHT, 0])

const xAxisGroup = g.append("g")
.attr("class", "x axis")
.attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append("g")
.attr("class", "y axis")

d3.csv("data/revenues.csv").then(data => {
  data.forEach(d => {
    d.revenue = Number(d.revenue)
  })

  d3.interval(() => {
    update(data)
  }, 1000)

  update(data)
})

function update(data) {
  x.domain(data.map(d => d.month))
  y.domain([0, d3.max(data, d => d.revenue)])

  const xAxisCall = d3.axisBottom(x)
  xAxisGroup.call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
  .ticks(3)
  .tickFormat(d => d + "m")
  yAxisGroup.call(yAxisCall)

  // JOIN new data with old elements.
  const rects = g.selectAll("rect")
  .data(data)

  // EXIT old elements not present in new data.
  rects.exit().remove()

  // UPDATE old elements present in new data.
  rects
    .attr("y", d => y(d.revenue))
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d.revenue))

  // ENTER new elements present in new data.  
  rects.enter().append("rect")
    .attr("y", d => y(d.revenue))
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d.revenue))
    .attr("fill", "grey")
}
```

---

## Lab 4 Part 4 - Making Our Chart Dynamic
```js
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

/*Lab 4 Part 4 - Making Our Chart Dynamic*/
let flag = true

const svg = d3.select("#chart-area").append("svg")
.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// X label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month")

// Y label
const yLabel = g.append("text")
.attr("class", "y axis-label")
.attr("x", - (HEIGHT / 2))
.attr("y", -60)
.attr("font-size", "20px")
.attr("text-anchor", "middle")
.attr("transform", "rotate(-90)")

const x = d3.scaleBand()
.range([0, WIDTH])
.paddingInner(0.3)
.paddingOuter(0.2)

const y = d3.scaleLinear()
.range([HEIGHT, 0])

const xAxisGroup = g.append("g")
.attr("class", "x axis")
.attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append("g")
.attr("class", "y axis")

d3.csv("data/revenues.csv").then(data => {
  data.forEach(d => {
    d.revenue = Number(d.revenue)
    d.profit = Number(d.profit)
  })

  /*Lab 4 Part 4 - Making Our Chart Dynamic*/
  console.log(data)

  d3.interval(() => {

    flag = !flag /*Lab 4 Part 4 - Making Our Chart Dynamic*/
    update(data)
  }, 1000)

  update(data)
})

function update(data) {
  const value = flag ? "profit" : "revenue" /*Lab 4 Part 4 - Making Our Chart Dynamic*/

  x.domain(data.map(d => d.month))
  y.domain([0, d3.max(data, d => d[value])])

  const xAxisCall = d3.axisBottom(x)
  xAxisGroup.call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
  .ticks(3)
  .tickFormat(d => d + "m")
  yAxisGroup.call(yAxisCall)

  // JOIN new data with old elements.
  const rects = g.selectAll("rect")
  .data(data)

  // EXIT old elements not present in new data.
  rects.exit().remove()

  // UPDATE old elements present in new data.
  rects
    .attr("y", d => y(d[value]))  /*Lab 4 Part 4 - Making Our Chart Dynamic*/
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d[value]))   /*Lab 4 Part 4 - Making Our Chart Dynamic*/

  // ENTER new elements present in new data.  
  rects.enter().append("rect")
    .attr("y", d => y(d[value]))
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("height", d => HEIGHT - y(d[value]))
    .attr("fill", "grey")

  const text = flag ? "Profit ($)" : "Revenue ($)"  /*Lab 4 Part 4 - Making Our Chart Dynamic*/
  yLabel.text(text)
}
```

---

## Lab 4 Part 5 - D3 Transitions

```js
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

let flag = true

const svg = d3.select("#chart-area").append("svg")
.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// X label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month")

// Y label
const yLabel = g.append("text")
.attr("class", "y axis-label")
.attr("x", - (HEIGHT / 2))
.attr("y", -60)
.attr("font-size", "20px")
.attr("text-anchor", "middle")
.attr("transform", "rotate(-90)")

const x = d3.scaleBand()
.range([0, WIDTH])
.paddingInner(0.3)
.paddingOuter(0.2)

const y = d3.scaleLinear()
.range([HEIGHT, 0])

const xAxisGroup = g.append("g")
.attr("class", "x axis")
.attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append("g")
.attr("class", "y axis")

d3.csv("data/revenues.csv").then(data => {
  data.forEach(d => {
    d.revenue = Number(d.revenue)
    d.profit = Number(d.profit)
  })

  d3.interval(() => {
    flag = !flag
    const newData = flag ? data : data.slice(1) /* Lab 4 Part 5 - D3 Transitions */
    update(newData) /* Lab 4 Part 5 - D3 Transitions */
  }, 1000)

  update(data)
})

function update(data) {
  const value = flag ? "profit" : "revenue"
  const t = d3.transition().duration(750) /* Lab 4 Part 5 - D3 Transitions */

  x.domain(data.map(d => d.month))
  y.domain([0, d3.max(data, d => d[value])])

  const xAxisCall = d3.axisBottom(x)
  xAxisGroup.transition(t).call(xAxisCall)  /* Lab 4 Part 5 - D3 Transitions */
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
  .ticks(3)
  .tickFormat(d => d + "m")
  yAxisGroup.transition(t).call(yAxisCall)  /* Lab 4 Part 5 - D3 Transitions */

  // JOIN new data with old elements.
  const rects = g.selectAll("rect")
  .data(data, d => d.month) /* Lab 4 Part 5 - D3 Transitions */

  // EXIT old elements not present in new data.
  rects.exit()
    .attr("fill", "red")
    .transition(t)
    .attr("height", 0)
    .attr("y", y(0))
    .remove()

  // ENTER new elements present in new data...
  rects.enter().append("rect")
    .attr("fill", "grey")
    .attr("y", y(0))
    .attr("height", 0)
    // AND UPDATE old elements present in new data.
    .merge(rects)
    .transition(t)
    .attr("x", (d) => x(d.month))
    .attr("width", x.bandwidth)
    .attr("y", d => y(d[value]))
    .attr("height", d => HEIGHT - y(d[value]))

  const text = flag ? "Profit ($)" : "Revenue ($)"
  yLabel.text(text)
}
```
---

## Lab 4 Part 6 - Scatter Plots in D3

```js
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 600 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 400 - MARGIN.TOP - MARGIN.BOTTOM

let flag = true

const svg = d3.select("#chart-area").append("svg")
.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

// X label
g.append("text")
  .attr("class", "x axis-label")
  .attr("x", WIDTH / 2)
  .attr("y", HEIGHT + 60)
  .attr("font-size", "20px")
  .attr("text-anchor", "middle")
  .text("Month")

// Y label
const yLabel = g.append("text")
.attr("class", "y axis-label")
.attr("x", - (HEIGHT / 2))
.attr("y", -60)
.attr("font-size", "20px")
.attr("text-anchor", "middle")
.attr("transform", "rotate(-90)")

const x = d3.scaleBand()
.range([0, WIDTH])
.paddingInner(0.3)
.paddingOuter(0.2)

const y = d3.scaleLinear()
.range([HEIGHT, 0])

const xAxisGroup = g.append("g")
.attr("class", "x axis")
.attr("transform", `translate(0, ${HEIGHT})`)

const yAxisGroup = g.append("g")
.attr("class", "y axis")

d3.csv("data/revenues.csv").then(data => {
  data.forEach(d => {
    d.revenue = Number(d.revenue)
    d.profit = Number(d.profit)
  })

  d3.interval(() => {
    flag = !flag
    const newData = flag ? data : data.slice(1)
    update(newData)
  }, 1000)

  update(data)
})

function update(data) {
  const value = flag ? "profit" : "revenue"
  const t = d3.transition().duration(750)

  x.domain(data.map(d => d.month))
  y.domain([0, d3.max(data, d => d[value])])

  const xAxisCall = d3.axisBottom(x)
  xAxisGroup.transition(t).call(xAxisCall)
    .selectAll("text")
    .attr("y", "10")
    .attr("x", "-5")
    .attr("text-anchor", "end")
    .attr("transform", "rotate(-40)")

  const yAxisCall = d3.axisLeft(y)
  .ticks(3)
  .tickFormat(d => d + "m")
  yAxisGroup.transition(t).call(yAxisCall)

  // JOIN new data with old elements.
  const rects = g.selectAll("circle") /* Lab 4 Part 6 - Scatter Plots in D3 */
  .data(data, d => d.month)

  // EXIT old elements not present in new data.
  rects.exit()
    .attr("fill", "red")
    .transition(t)
    .attr("cy", y(0)) /* Lab 4 Part 6 - Scatter Plots in D3 */
    .remove()

  // ENTER new elements present in new data...
  rects.enter().append("circle")
    .attr("fill", "grey")
    .attr("cy", y(0)) /* Lab 4 Part 6 - Scatter Plots in D3 */
    .attr("r", 5)
    // AND UPDATE old elements present in new data.
    .merge(rects)
    .transition(t)
    .attr("cx", (d) => x(d.month) + (x.bandwidth() / 2))     /* Lab 4 Part 6 - Scatter Plots in D3 */
    .attr("cy", d => y(d[value])) /* Lab 4 Part 6 - Scatter Plots in D3 */

  const text = flag ? "Profit ($)" : "Revenue ($)"
  yLabel.text(text)
}
```
---

## Project 2 - Gapminder Clone

```js
const MARGIN = { LEFT: 100, RIGHT: 10, TOP: 10, BOTTOM: 100 }
const WIDTH = 800 - MARGIN.LEFT - MARGIN.RIGHT
const HEIGHT = 500 - MARGIN.TOP - MARGIN.BOTTOM

const svg = d3.select("#chart-area").append("svg")
.attr("width", WIDTH + MARGIN.LEFT + MARGIN.RIGHT)
.attr("height", HEIGHT + MARGIN.TOP + MARGIN.BOTTOM)

const g = svg.append("g")
.attr("transform", `translate(${MARGIN.LEFT}, ${MARGIN.TOP})`)

let time = 0

// Scales
const x = d3.scaleLog()
.base(10)
.range([0, WIDTH])
.domain([142, 150000])
const y = d3.scaleLinear()
.range([HEIGHT, 0])
.domain([0, 90])
const area = d3.scaleLinear()
.range([25*Math.PI, 1500*Math.PI])
.domain([2000, 1400000000])
const continentColor = d3.scaleOrdinal(d3.schemePastel1)

// Labels
const xLabel = g.append("text")
.attr("y", HEIGHT + 50)
.attr("x", WIDTH / 2)
.attr("font-size", "20px")
.attr("text-anchor", "middle")
.text("GDP Per Capita ($)")
const yLabel = g.append("text")
.attr("transform", "rotate(-90)")
.attr("y", -40)
.attr("x", -170)
.attr("font-size", "20px")
.attr("text-anchor", "middle")
.text("Life Expectancy (Years)")
const timeLabel = g.append("text")
.attr("y", HEIGHT - 10)
.attr("x", WIDTH - 40)
.attr("font-size", "40px")
.attr("opacity", "0.4")
.attr("text-anchor", "middle")
.text("1800")

// X Axis
const xAxisCall = d3.axisBottom(x)
.tickValues([400, 4000, 40000])
.tickFormat(d3.format("$"));
g.append("g")
  .attr("class", "x axis")
  .attr("transform", `translate(0, ${HEIGHT})`)
  .call(xAxisCall)

// Y Axis
const yAxisCall = d3.axisLeft(y)
g.append("g")
  .attr("class", "y axis")
  .call(yAxisCall)

d3.json("data/data.json").then(function(data){
  // clean data
  const formattedData = data.map(year => {
    return year["countries"].filter(country => {
      const dataExists = (country.income && country.life_exp)
      return dataExists
    }).map(country => {
        country.income = Number(country.income)
        country.life_exp = Number(country.life_exp)
        return country
      })
  })

  // run the code every 0.1 second
  d3.interval(function(){
    // at the end of our data, loop back
    time = (time < 214) ? time + 1 : 0
    update(formattedData[time])
  }, 100)

  // first run of the visualization
  update(formattedData[0])
})

function update(data) {
  // standard transition time for the visualization
  const t = d3.transition()
  .duration(100)

  // JOIN new data with old elements.
  const circles = g.selectAll("circle")
  .data(data, d => d.country)

  // EXIT old elements not present in new data.
  circles.exit().remove()

  // ENTER new elements present in new data.
  circles.enter().append("circle")
    .attr("fill", d => continentColor(d.continent))
    .merge(circles)
    .transition(t)
    .attr("cy", d => y(d.life_exp))
    .attr("cx", d => x(d.income))
    .attr("r", d => Math.sqrt(area(d.population) / Math.PI))

  // update the time label
  timeLabel.text(String(time + 1800))
}
```
