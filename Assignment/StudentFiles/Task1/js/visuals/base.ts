import * as d3 from 'd3';

export interface ChartConfig {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}
export abstract class ChartBase {
  protected svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  protected config: ChartConfig;

  constructor(container: string, config: ChartConfig) {
    this.config = config;
    this.svg = this.initializeSVG(container);
  }

  private initializeSVG(container: string): d3.Selection<SVGGElement, unknown, HTMLElement, any> {
    return d3.select(container)
      .append('svg')
      .attr('width', this.config.width + this.config.margin.left + this.config.margin.right)
      .attr('height', this.config.height + this.config.margin.top + this.config.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.config.margin.left},${this.config.margin.top})`);
  }
}
