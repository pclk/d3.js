import { BaseBrush, BaseBrushConfig } from "./base";
import * as d3 from 'd3';

export interface TimeBrushConfig extends BaseBrushConfig {
  extent: [Date, Date];
  onBrush?: (range: [Date, Date]) => void;
}

export class TimeBrush extends BaseBrush<Date> {
  constructor(config: TimeBrushConfig) {
    super(config);
    this.onBrush = config.onBrush || (() => { });
    this.initializeScale(config.extent);
    this.setupBrush(config.extent);
  }

  protected initializeScale(extent: [Date, Date]): void {
    this.scale = d3.scaleTime()
      .domain(extent)
      .range([0, this.width - this.margin.left - this.margin.right]);
  }

  protected formatTooltip(range: [Date, Date]): string {
    return `Range: ${d3.timeFormat('%B %d, %Y')(range[0])} - ${d3.timeFormat('%B %d, %Y')(range[1])}`;
  }

  protected getScaleValue(value: Date): number {
    return this.scale(value);
  }

  protected parseScaleValue(value: number): Date {
    return this.scale.invert(value) as Date;
  }

  protected calculateGap(a: Date, b: Date): number {
    return Math.abs(a.getTime() - b.getTime());
  }

  protected calculateDensityRadius(gap: number): number {
    return Math.min(5, 20 / (gap / (1000 * 60 * 60 * 24)));
  }

  protected formatDataPointTooltip(value: Date, density: number): string {
    return `${d3.timeFormat('%B %Y')(value)}\nDensity: ${density.toFixed(2)}`;
  }
}
