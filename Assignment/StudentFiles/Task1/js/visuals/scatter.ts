import * as d3 from 'd3';
import { DataManager } from '../data';
import { PropertyTransaction } from '../types/property';
import { formatCurrency } from '../utils/formatters';
import { ChartBase, ChartConfig } from './base';

export class ScatterPlot extends ChartBase {

  constructor(container: string, config: ChartConfig, dataManager: DataManager) {
    super(container, {
      ...config,
      width: config.width,
      height: config.height,
    }, dataManager);
  }

  public async update(): Promise<void> {
    const data = this.dataManager.getFilteredData();
    this.updateAxis();

    const points = this.svg.selectAll<SVGCircleElement, PropertyTransaction>('circle')
      .data(data, d => `${d[this.config.xAxis.key]}-${d[this.config.yAxis.key]}`);

    points.exit().remove();

    const pointsEnter = points.enter()
      .append('circle')
      .attr('r', 3)
      .attr('opacity', 0.3);

    const colorScale = d3.scaleSequential()
      .domain([
        d3.max(data, d => this.getScaledValue(this.yScale, d[this.config.yAxis.key], this.config.yAxis.scale)) || 0,
        d3.min(data, d => this.getScaledValue(this.yScale, d[this.config.yAxis.key], this.config.yAxis.scale)) || 0
      ])
      .interpolator(d3.interpolateViridis);

    points.merge(pointsEnter)
      .transition()
      .duration(750)
      .attr('cx', d => this.getScaledValue(this.xScale, d[this.config.xAxis.key], this.config.xAxis.scale))
      .attr('cy', d => this.getScaledValue(this.yScale, d[this.config.yAxis.key], this.config.yAxis.scale))
      .attr('fill', d => colorScale(this.getScaledValue(this.yScale, d[this.config.yAxis.key], this.config.yAxis.scale)))

    points.merge(pointsEnter)
      .on('mouseover', (event: MouseEvent, d) => {
        d3.select(event.currentTarget as SVGCircleElement)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('r', 5);

        const yKey = this.config.yAxis.key

        const tooltipContent = `
          <strong>${this.config.xAxis.key}:</strong> ${d[this.config.xAxis.key]}<br/>
          <strong>${yKey}:</strong> ${d[yKey] instanceof Date ? d3.timeFormat('%B %Y')(d[yKey] as Date) : formatCurrency(d[yKey] as number)}<br/>
        `;
        this.showTooltip(tooltipContent, event)
      })
      .on('mousemove', (event: MouseEvent) => this.positionTooltip(event))
      .on('mouseout', (event: MouseEvent) => {
        d3.select(event.currentTarget as SVGCircleElement)
          .transition()
          .duration(200)
          .style('opacity', 0.5)
          .attr('r', 3);

        this.hideTooltip()
      })


    // area chart
    // Define a type for our aggregated data
    type AggregatedPoint = {
      x: any;  // Keep as any since it could be Date, string, or number
      y: number;
    };


    // Group and aggregate data
    const groupedData: AggregatedPoint[] = Array.from(
      d3.rollups(
        data,
        v => d3.mean(v, d => Number(d[this.config.yAxis.key])) || 0,
        d => d[this.config.xAxis.key]
      )
    ).map(([x, y]) => ({
      x: x,
      y: y
    })).sort((a, b) => {
      // Handle different types of x values
      if (a.x instanceof Date && b.x instanceof Date) {
        return a.x.getTime() - b.x.getTime();
      }
      if (typeof a.x === 'number' && typeof b.x === 'number') {
        return a.x - b.x;
      }
      // For strings or mixed types, use string comparison
      return String(a.x).localeCompare(String(b.x));
    });

    // Create area generator with custom stroke handling
    const areaGenerator = d3.area<{ x: any, y: number }>()
      .x(d => this.getScaledValue(this.xScale, d.x, this.config.xAxis.scale))
      .y0(this.config.height)  // Bottom line
      .y1(d => this.getScaledValue(this.yScale, d.y, this.config.yAxis.scale))
      .curve(d3.curveCatmullRom);

    // Create line generator for the top stroke
    const lineGenerator = d3.line<{ x: any, y: number }>()
      .x(d => this.getScaledValue(this.xScale, d.x, this.config.xAxis.scale))
      .y(d => this.getScaledValue(this.yScale, d.y, this.config.yAxis.scale))
      .curve(d3.curveCatmullRom);

    // Update area path with proper typing
    const areaPath = this.svg.selectAll<SVGPathElement, AggregatedPoint[]>('.area-path')
      .data([groupedData]);

    areaPath.exit().remove();

    const areaPathEnter = areaPath.enter()
      .append('path')
      .attr('class', 'area-path');

    areaPath.merge(areaPathEnter)
      .transition()
      .duration(750)
      .attr('fill', '#440154')
      .attr('stroke', 'none')
      .attr('stroke-width', 1.5)
      .attr('opacity', 0.7)  // Make it semi-transparent
      .attr('d', areaGenerator);

    // Add top line
    const topLine = this.svg.selectAll<SVGPathElement, AggregatedPoint[]>('.area-line')
      .data([groupedData]);

    topLine.exit().remove();

    const topLineEnter = topLine.enter()
      .append('path')
      .attr('class', 'area-line');

    // Add the yellow stroke for top line only
    topLine.merge(topLineEnter)
      .transition()
      .duration(750)
      .attr('fill', 'none')
      .attr('stroke', '#fde724')  // Viridis yellow
      .attr('stroke-width', 1)
      .attr('d', lineGenerator);

  }
}
