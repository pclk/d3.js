import * as d3 from 'd3';
import { PropertyTransaction } from '../types/property';
import { ChartBase, ChartConfig } from './base';

export class ScatterPlot extends ChartBase {
  private xScale!: d3.ScaleLinear<number, number>;
  private yScale!: d3.ScaleLinear<number, number>;
  private xAxis!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private yAxis!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private dots!: d3.Selection<SVGCircleElement, PropertyTransaction, SVGGElement, unknown>;
  private labels!: {
    x: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
    y: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
  };

  constructor(container: string, config: ChartConfig) {
    super(container, {
      ...config,
      width: config.width - config.margin.left - config.margin.right,
      height: config.height - config.margin.top - config.margin.bottom
    });
    this.initializeAxes();
    this.initializeLabels();
  }

  private initializeAxes(): void {
    this.xAxis = this.svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.config.height})`);

    this.yAxis = this.svg.append('g')
      .attr('class', 'y-axis');
  }

  private initializeLabels(): void {
    this.svg.append('text')
      .attr('class', 'x-label')
      .attr('x', this.config.width / 2)
      .attr('y', this.config.height + 40)
      .style('text-anchor', 'middle')
      .text('Area (SQM)'),

      this.svg.append('text')
        .attr('class', 'y-label')
        .attr('transform', 'rotate(-90)')
        .attr('x', -this.config.height / 2)
        .attr('y', -90)
        .style('text-anchor', 'middle')
        .text('Transacted Price ($)')
  }

  public update(data: PropertyTransaction[]): void {
    // Update scales
    this.xScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d["Area (SQM)"]) || 0])
      .range([0, this.config.width]);

    this.yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d["Transacted Price ($)"]) || 0])
      .range([this.config.height, 0]);

    // Update axes
    this.xAxis.transition().duration(750).call(d3.axisBottom(this.xScale));
    this.yAxis.transition().duration(750).call(d3.axisLeft(this.yScale));

    // Data join for dots
    this.dots = this.svg.selectAll<SVGCircleElement, PropertyTransaction>('circle')
      .data(data);

    // Remove old dots
    this.dots.exit().remove();

    // Add new dots
    const dotsEnter = this.dots.enter()
      .append('circle')
      .attr('r', 3)
      .style('fill', 'steelblue')
      .style('opacity', 0);

    // Update + Enter
    this.dots = dotsEnter.merge(this.dots);

    // Transition for all dots
    this.dots.transition()
      .duration(750)
      .attr('cx', d => this.xScale(d["Area (SQM)"]))
      .attr('cy', d => this.yScale(d["Transacted Price ($)"]))
      .style('opacity', 0.5);

    // Add interactivity
    this.dots
      .on('mouseover', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('r', 5);
      })
      .on('mouseout', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .style('opacity', 0.5)
          .attr('r', 3);
      });
  }
}
