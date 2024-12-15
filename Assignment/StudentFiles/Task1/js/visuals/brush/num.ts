import { BaseBrush, BaseBrushConfig } from "./base";
import * as d3 from 'd3';

export interface PriceBrushConfig extends BaseBrushConfig {
  extent: [number, number];
  onBrush?: (range: [number, number]) => void;
}

export class NumberBrush extends BaseBrush<number> {
  constructor(config: PriceBrushConfig) {
    super(config);
    this.onBrush = config.onBrush || (() => { });
    this.initializeScale(config.extent);
    this.tickFormat = (d) => { return `$${d3.format(".1f")(d as number / 1000000)}M`; }
    this.setupBrush(config.extent);
  }

  protected initializeScale(extent: [number, number]): void {
    this.scale = d3.scaleLinear()
      .domain(extent)
      .range([0, this.width - this.margin.left - this.margin.right]);
  }

  protected formatTooltip(range: [number, number]): string {
    return `Price Range: $${d3.format(".1f")(range[0] / 1000000)}M - $${d3.format(".1f")(range[1] / 1000000)}M`;
  }

  protected getScaleValue(value: number): number {
    return this.scale(value);
  }

  protected parseScaleValue(value: number): number {
    return Math.round(this.scale.invert(value) as number);
  }
  protected calculateGap(a: number, b: number): number {
    return Math.abs(a - b);
  }

  protected calculateDensityRadius(gap: number): number {
    return Math.min(5, 20 / (gap / 10000));
  }

  protected formatDataPointTooltip(value: number, density: number): string {
    return `$${d3.format(",.0f")(value)}\nDensity: ${density.toFixed(2)}`;
  }
}
