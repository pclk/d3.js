import * as d3 from 'd3';
import { DataManager } from '../data';
import { ChartBase, ChartConfig } from '../visuals/base';

export class StackedBarChart extends ChartBase {
  private colorScale: d3.ScaleOrdinal<string, string>;
  private legend: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

  constructor(container: string, config: ChartConfig, dataManager: DataManager) {
    super(container, config, dataManager);
    this.colorScale = d3.scaleOrdinal(d3.schemeCategory10);
    // First, make the chart container relative
    d3.select(container)
      .style('position', 'relative');
    // Create legend container outside the main chart area
    this.legend = d3.select(container)
      .append('div')
      .attr('class', 'chart-legend')
      .style('position', 'absolute')
      .style('right', '10px')
      .style('top', '10px');
  }

  public update(): void {
    const data = this.dataManager.getFilteredData();

    // Group data by primary category (x-axis) and secondary category (stacks)
    const xKey = this.config.xAxis.key;
    const stackKey = this.config.thirdAxis?.key || 'Property Type';

    // Create nested grouping of data
    const nestedData = d3.group(data, d => String(d[xKey]));

    // Transform data for stacking
    type StackData = { [key: string]: number } & { category: string };
    const stackData: StackData[] = Array.from(nestedData, ([key, values]) => {
      const counts = d3.group(values, d => String(d[stackKey]));
      const obj: any = { category: key };
      counts.forEach((v, k) => {
        obj[k] = v.length;
      });
      return obj;
    });

    // Get unique stack keys (excluding 'category')
    const keys = Object.keys(stackData[0] || {}).filter(k => k !== 'category');

    // Create stack generator
    const stack = d3.stack<StackData>()
      .keys(keys)
      .value((d, key) => d[key] || 0);

    // Generate stacked data
    const series = stack(stackData);

    // Update scales
    const xScale = this.xScale as d3.ScaleBand<string>;
    const yScale = this.yScale as d3.ScaleLinear<number, number>;

    // Set domains
    xScale.domain(stackData.map(d => d.category).sort((a, b) => a.localeCompare(b)) as any);

    // Calculate max height from series data
    const maxHeight = d3.max(series, layer => d3.max(layer, d => d[1])) || 0;
    yScale.domain([0, maxHeight]);

    // Update only the display of the axes
    this.xAxis.transition()
      .duration(750)
      .call(d3.axisBottom(xScale));

    this.yAxis.transition()
      .duration(750)
      .call(d3.axisLeft(yScale).tickFormat(this.config.yAxis.format || d3.format(',d')));
    // Update color scale domain
    this.colorScale.domain(keys);

    // Update axes
    // this.updateAxis();
    this.updateAxisDisplay(this.xAxis, d3.axisBottom(xScale), this.config.xAxis)
    this.updateAxisDisplay(this.yAxis, d3.axisLeft(yScale), this.config.yAxis)

    // Add these logs in the update method to debug scale issues
    console.log('Stack Data:', stackData);
    console.log('Series:', series);
    console.log('Y Scale Domain:', yScale.domain());
    console.log('X Scale Domain:', xScale.domain());

    // Create/update bars
    const layers = this.svg.selectAll<SVGGElement, d3.Series<StackData, string>>('.layer')
      .data(series);

    layers.exit().remove();

    const layersEnter = layers.enter()
      .append('g')
      .attr('class', 'layer');

    const categories = Array.from(new Set(data.map(d => d[this.config.thirdAxis!.key])));

    // Create viridis color scale for the categories
    this.colorScale = d3.scaleOrdinal<string, string>()  // Specify input and output types
      .domain(categories as string[])
      .range(d3.quantize(t => d3.interpolateViridis(t), categories.length));

    const layersMerged = layers.merge(layersEnter)
      .attr('fill', d => this.colorScale(d.key))  // Apply color based on category

    // Create/update rectangles within each layer
    const bars = layersMerged.selectAll<SVGRectElement, d3.SeriesPoint<StackData>>('rect')
      .data(d => d);

    bars.exit().remove();

    const barsEnter = bars.enter()
      .append('rect')
      .attr('x', d => String(xScale(d.data.category)))
      .attr('y', yScale(0))
      .attr('height', 0);

    const barsMerged = bars.merge(barsEnter);

    // Update all bars with proper error checking
    barsMerged.transition()
      .duration(750)
      .attr('x', d => {
        const xPos = xScale(d.data.category);
        return xPos !== undefined ? xPos : 0;
      })
      .attr('y', d => {
        const yPos = yScale(d[1]);
        return Number.isFinite(yPos) ? yPos : 0;
      })
      .attr('height', d => {
        const height = yScale(d[0]) - yScale(d[1]);
        return Number.isFinite(height) ? Math.max(0, height) : 0;
      })
      .attr('width', xScale.bandwidth());

    const hoverGroups = this.svg.selectAll('.hover-group')
      .data(stackData.map(d => d.category))
      .join('rect')
      .attr('class', 'hover-group')
      .attr('x', d => xScale(d) || 0)
      .attr('y', 0)
      .attr('width', xScale.bandwidth())
      .attr('height', this.config.height)
      .style('fill', 'transparent')
      .style('pointer-events', 'all');

    // Add interactivity to hover groups
    hoverGroups
      .on('mouseover', (event: MouseEvent, category) => {

        // Highlight all bars in the stack
        barsMerged
          .filter(d => d.data.category === category)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('x', d => {
            const xPos = xScale(d.data.category);
            return (xPos !== undefined ? xPos : 0) - 2; // Expand slightly
          })
          .attr('width', xScale.bandwidth() + 4);

        // Dim other bars
        barsMerged
          .filter(d => d.data.category !== category)
          .transition()
          .duration(200)
          .style('opacity', 0.3);

        // Show tooltip with stack information
        const stackData = series.map(layer => ({
          category: layer.key,
          value: layer.find(d => d.data.category === category)?.data[layer.key] || 0
        }));

        const total = stackData.reduce((sum, item) => sum + item.value, 0);

        const tooltipContent = `
            <div class="bg-[#17011C]">
                <strong>${category}</strong><br/>
                ${stackData.map(item => `
                    <div class="tooltip-row">
                        <span>${item.category}:</span> 
                        <span>${item.value} (${((item.value / total) * 100).toFixed(1)}%)</span>
                    </div>
                `).join('')}
                <div class="tooltip-total">
                    <strong>Total: ${total}</strong>
                </div>
            </div>
        `;
        this.showTooltip(tooltipContent, event);
      })
      .on('mousemove', (event: MouseEvent) => this.positionTooltip(event))
      .on('mouseout', (event: MouseEvent, category) => {
        // Reset all bars
        barsMerged
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('x', d => xScale(d.data.category) || 0)
          .attr('width', xScale.bandwidth());

        this.hideTooltip();
      });

    // Optional: Add hover effect to individual bars for additional feedback
    barsMerged
      .style('cursor', 'pointer')
      .on('mouseover', function (event: MouseEvent, d) {
        d3.select(this)
          .style('filter', 'brightness(1.1)');
      })
      .on('mouseout', function (event: MouseEvent, d) {
        d3.select(this)
          .style('filter', 'none');
      });

    // Update legend
    this.updateLegend(keys);
  }

  private updateLegend(keys: string[]): void {
    // Clear existing legend
    this.legend.html('');

    // Create legend items
    const legendItems = this.legend.selectAll<HTMLDivElement, string>('.legend-item')
      .data(keys)
      .enter()
      .append('div')
      .attr('class', 'legend-item')
      .style('margin-bottom', '5px')
      .style('display', 'flex')
      .style('align-items', 'center');

    // Add color boxes
    legendItems.append('div')
      .style('width', '12px')
      .style('height', '12px')
      .style('margin-right', '5px')
      .style('background-color', d => this.colorScale(d));

    // Add text
    legendItems.append('span')
      .text(d => d)
      .style('font-size', '12px');
  }
}
