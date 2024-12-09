import * as d3 from 'd3';
import { HeatMapCell } from './types';

export class HeatMapScales {
  public x: d3.ScaleTime<number, number> | d3.ScaleBand<any>;
  public y: d3.ScaleBand<string | number>;
  public color: d3.ScaleSequential<string>;

  constructor(width: number, height: number) {
    this.x = d3.scaleTime().range([0, width]);
    this.y = d3.scaleBand<string | number>().range([0, height]).padding(0.1);
    this.color = d3.scaleSequential(d3.interpolateRdYlBu).domain([0, 1]);
  }

  updateDomains(data: HeatMapCell[], isTimeX: boolean): void {
    if (isTimeX) {
      this.x = d3.scaleTime()
        .domain(d3.extent(data, d => d.xValue as Date) as [Date, Date])
        .range([0, this.x.range()[1]]);
    } else {
      this.x = d3.scaleBand()
        .domain(Array.from(new Set(data.map(d => d.xValue))))
        .range([0, this.x.range()[1]])
        .padding(0.1);
    }
    const yDomain = Array.from(new Set(data.map(d => String(d.yValue))))
      .sort((a, b) => a.localeCompare(b));

    this.y.domain(yDomain);

    // For prices, we might want to reverse the color scale
    // so that higher prices are shown in warmer colors
    const [minPrice, maxPrice] = d3.extent(data, d => d.mean) as [number, number];
    this.color.domain([maxPrice, minPrice]); // Reversed domain for prices
  }

  getX(value: any): number | undefined {
    if (this.x instanceof d3.scaleTime) {
      return this.x(value);
    }
    return (this.x as d3.ScaleBand<any>)(value) || 0;
  }

  getY(value: any): number {
    return this.y(value) || 0;
  }

  getBandwidth(): number {
    if (this.x instanceof d3.scaleTime) {
      // Calculate approximate bandwidth for time scale
      const domain = this.x.domain();
      const range = this.x.range();
      const timeSpan = domain[1].getTime() - domain[0].getTime();
      return (range[1] - range[0]) / (timeSpan / (24 * 60 * 60 * 1000)); // daily bandwidth
    } else {
      // Handle band scale - check if bandwidth exists
      const bandScale = this.x as d3.ScaleBand<any>;
      return bandScale.bandwidth ? bandScale.bandwidth() : 0;
    }
  }
}
