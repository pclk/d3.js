import * as d3 from 'd3';
import { ChartBase, ChartConfig } from "../base";
import { HeatMapScales } from "./scales";
import { HeatMapTooltip } from "./tooltip";
import { HeatMapCell } from "./types";

export class TimeDistrictHeatMap extends ChartBase {
  private scales: HeatMapScales;
  private tooltip: HeatMapTooltip;
  private cells!: d3.Selection<SVGRectElement, HeatMapCell, SVGGElement, unknown>;
  private axes!: {
    x: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
    y: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  };

  constructor(container: string, config: ChartConfig) {
    super(container, config);
    this.scales = new HeatMapScales(config.width, config.height);
    this.tooltip = new HeatMapTooltip();
    this.createAxes();
  }

  private createAxes(): void {
    this.axes = {
      x: this.svg.append('g')
        .attr('class', 'x-axis')
        .attr('transform', `translate(0,${this.config.height})`),
      y: this.svg.append('g')
        .attr('class', 'y-axis')
    };
  }

  public update(data: HeatMapCell[]): void {
    // Calculate dimensions
    const isTimeX = data.length > 0 && data[0].xValue instanceof Date;

    this.scales.updateDomains(data, isTimeX);

    this.updateCells(data);
    this.updateAxes(isTimeX)
  }

  private updateAxes(isTimeX: boolean): void {
    // X Axis
    const xAxis = isTimeX
      ? d3.axisBottom(this.scales.x as d3.ScaleTime<number, number>)
      : d3.axisBottom(this.scales.x as d3.ScaleBand<any>);

    this.axes.x
      .transition()
      .duration(750)
      .call(xAxis)
      .selectAll("text")
      .attr("y", 10)
      .attr("x", -5)
      .attr("dy", ".35em")
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end");

    // Y Axis
    const yAxis = d3.axisLeft(this.scales.y);

    this.axes.y
      .transition()
      .duration(750)
      .call(yAxis);
  }

  private updateCells(data: HeatMapCell[]): void {
    // Data join
    this.cells = this.svg.selectAll<SVGRectElement, HeatMapCell>('.cell')
      .data(data, (d) => {
        const yKey = d.yValue instanceof Date ? d.yValue.getTime() : d.yValue;
        return `${d.xValue}-${yKey}`;
      });

    // Exit
    this.cells.exit().remove();

    // Enter
    const cellsEnter = this.cells.enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('x', d => this.scales.getX(d.xValue) || 0)
      .attr('y', d => this.scales.getY(d.yValue) || 0)
      .attr('width', () => this.scales.getBandwidth())  // Dynamic width
      .attr('height', () => this.scales.y.bandwidth())  // Dynamic height
      .attr('opacity', '0');

    // Update + Enter
    this.cells = cellsEnter.merge(this.cells);

    // Transition
    this.cells.transition()
      .duration(750)
      .attr('x', d => this.scales.getX(d.xValue) || 0)
      .attr('y', d => this.scales.getY(d.yValue) || 0)
      .attr('width', () => this.scales.getBandwidth())  // Dynamic width
      .attr('height', () => this.scales.y.bandwidth())  // Dynamic height
      .attr('fill', d => {
        const value = d.mean
        return this.scales.color(value);
      })
      .attr('opacity', '1');

    // Interactivity
    this.cells
      .on('mouseover', (event: MouseEvent, d: HeatMapCell) => {
        this.tooltip.show(event, d);
        this.cells.style('opacity', '0.5');
        d3.select(event.currentTarget as Element).style('opacity', '1');
      })
      .on('mousemove', (event: MouseEvent, d: HeatMapCell) => {
        this.tooltip.show(event, d);
      })
      .on('mouseout', () => {
        this.tooltip.hide();
        this.cells.style('opacity', '1');
      });
  }
}
