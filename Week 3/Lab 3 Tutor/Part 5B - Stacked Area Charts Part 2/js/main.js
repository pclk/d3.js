const margin = { top: 20, right: 100, bottom: 30, left: 50 },
  width = 600 - margin.left - margin.right,
  height = 400 - margin.top - margin.bottom;

const parseDate = d3.timeParse('%Y');
const formatBillion = d3.format(".1f");
const color = d3.scaleOrdinal(d3.schemeCategory10);

const x = d3.scaleTime().range([0, width]);
const y = d3.scaleLinear().range([height, 0]);

const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y).tickFormat(d => formatBillion(d / 1e9));

const area = d3.area()
  .x(d => x(d.data.date))
  .y0(d => y(d[0]))
  .y1(d => y(d[1]));

const stack = d3.stack();

const svg = d3.select('body').append('svg')
  .attr('width', width + margin.left + margin.right)
  .attr('height', height + margin.top + margin.bottom)
  .append('g')
  .attr('transform', `translate(${margin.left},${margin.top})`);

d3.csv('data/stacked_area2.csv', d3.autoType).then(data => {
  const keys = data.columns.filter(key => key !== 'date');

  data.forEach(d => {
    d.date = parseDate(d.date);
  });

  const maxDateVal = d3.max(data, d =>
    d3.sum(keys, key => +d[key])
  );

  // Set domains for axes
  x.domain(d3.extent(data, d => d.date));
  y.domain([0, maxDateVal]);

  stack.keys(keys);

  const layers = svg.selectAll('.layer')
    .data(stack(data))
    .join('g')
    .attr('class', d => `layer ${d.key}`)
    .attr('fill-opacity', 0.5);

  layers.append('path')
    .attr('class', 'area')
    .attr('d', area)
    .style('fill', d => color(d.key));

  layers.append('text')
    .datum(d => d)
    .attr('transform', (d) => `translate(${x(data[13].date)},${y(d[13][1])})`)
    .attr('x', -6)
    .attr('dy', '.35em')
    .style("text-anchor", "start")
    .text(d => d.key)
    .attr('fill-opacity', 1);

  svg.append('g')
    .attr('class', 'x axis')
    .attr('transform', `translate(0,${height})`)
    .call(xAxis);

  svg.append('g')
    .attr('class', 'y axis')
    .call(yAxis);

  svg.append("text")
    .attr("x", 0 - margin.left)
    .text("Billions of liters");
}).catch(error => {
  console.error(error);
});
