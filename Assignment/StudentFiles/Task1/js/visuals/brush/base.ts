import * as d3 from 'd3';
import { debounce, throttle } from 'lodash';

export interface BaseBrushConfig {
  container: string;
  height?: number;
  width?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  tickFormat?: (domainValue: d3.NumberValue, index: number) => string
  tickCount?: number;
}

export abstract class BaseBrush<T> {
  protected svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  protected brushG!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  protected brush!: d3.BrushBehavior<unknown>;
  protected scale!: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  protected height: number;
  protected width: number;
  protected margin: { top: number; right: number; bottom: number; left: number };
  protected onBrush!: (range: [T, T]) => void;
  protected dataPoints: T[] = [];
  protected brushTooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  protected tickFormat?: (domainValue: d3.NumberValue, index: number) => string
  private debouncedBrushEnd: (range: [T, T]) => void;
  private throttledTooltipUpdate: (event: MouseEvent, range: [T, T]) => void;

  constructor(config: BaseBrushConfig) {
    this.height = config.height || 50;
    this.width = config.width || 300;
    this.margin = config.margin || { top: 10, right: 20, bottom: 20, left: 40 };

    // Create SVG
    this.svg = d3.select(config.container)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    // Create tooltip
    this.brushTooltip = d3.select('body')
      .append('div')
      .attr('class', 'brush-tooltip')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .style('background', 'rgba(0,0,0,0.8)')
      .style('color', 'white')
      .style('padding', '8px')
      .style('border-radius', '4px')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', '1000')
      .style('line-height', '1.4')
      .style('white-space', 'nowrap');

    this.tickFormat = config.tickFormat

    // Debounce brush end callback
    this.debouncedBrushEnd = debounce((range: [T, T]) => {
      if (this.onBrush) this.onBrush(range);
    }, 150);

    // Throttle tooltip updates
    this.throttledTooltipUpdate = throttle((event: MouseEvent, range: [T, T]) => {
      const nearestStart = this.findNearestDataPoint(range[0]);
      const nearestEnd = this.findNearestDataPoint(range[1]);

      this.brushTooltip
        .style('visibility', 'visible')
        .style('left', `${event.pageX + 10}px`)
        .style('top', `${event.pageY + 10}px`)
        .html(this.formatTooltip([nearestStart, nearestEnd]));
    }, 50);
  }

  protected abstract initializeScale(extent: [T, T]): void;
  protected abstract formatTooltip(range: [T, T]): string;
  protected abstract getScaleValue(value: T): number;
  protected abstract parseScaleValue(value: number): T;

  protected setupBrush(extent: [T, T]): void {
    const g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Create axis
    const axis = d3.axisBottom(this.scale)
      .ticks(5);

    if (this.tickFormat) {
      axis.tickFormat(this.tickFormat)
    }

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .call(axis);

    // Create brush
    this.brush = d3.brushX()
      .extent([[0, 0], [this.width, this.height - this.margin.bottom]])
      .on('start brush end', this.brushed.bind(this));

    // Add brush to SVG
    this.brushG = g.append('g')
      .attr('class', 'brush')
      .call(this.brush);

    // Set initial brush selection
    const x0 = this.getScaleValue(extent[0]);
    const x1 = this.getScaleValue(extent[1]);

    this.brushG
      .call(this.brush.move, [x0, x1]);
  }

  protected addDataPointMarkers(): void {
    const g = this.svg.select('g');
    g.selectAll('.data-point-marker').remove();

    // Create groups for markers
    const markerGroup = g.append('g')
      .attr('class', 'data-point-markers');

    // Add base markers
    const markers = this.dataPoints.map((d, i) => {
      const x = this.getScaleValue(d);
      const prevPoint = i > 0 ? this.dataPoints[i - 1] : null;
      const nextPoint = i < this.dataPoints.length - 1 ? this.dataPoints[i + 1] : null;

      const prevGap = prevPoint ? this.calculateGap(d, prevPoint) : Infinity;
      const nextGap = nextPoint ? this.calculateGap(d, nextPoint) : Infinity;
      const minGap = Math.min(prevGap, nextGap);
      const densityRadius = this.calculateDensityRadius(minGap);

      return {
        x,
        densityRadius,
        value: d
      };
    });

    markerGroup.selectAll('line')
      .data(markers)
      .join('line')
      .attr('class', 'data-point-marker')
      .attr('transform', d => `translate(${d.x},0)`)
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', this.height / 2 + this.margin.bottom)
      .attr('y2', this.height - this.margin.bottom)
      .attr('stroke', '#999')
      .attr('stroke-width', 1)
      .append('title')
      .text(d => this.formatDataPointTooltip(d.value, d.densityRadius));
  }

  protected abstract calculateGap(a: T, b: T): number;
  protected abstract calculateDensityRadius(gap: number): number;
  protected abstract formatDataPointTooltip(value: T, density: number): string;

  protected findNearestDataPoint(value: T): T {
    if (this.dataPoints.length === 0) return value;

    const scaleValue = this.getScaleValue(value);

    return this.dataPoints.reduce((prev, curr) => {
      const prevValue = this.getScaleValue(prev);
      const currValue = this.getScaleValue(curr);

      const prevDiff = Math.abs(prevValue - scaleValue);
      const currDiff = Math.abs(currValue - scaleValue);

      return currDiff < prevDiff ? curr : prev;
    });
  }

  public setDataPoints(points: T[]): void {
    this.dataPoints = points;
    this.addDataPointMarkers();
  }

  protected brushed(event: d3.D3BrushEvent<unknown>): void {
    if (!event.selection || !event.sourceEvent) return;

    const [x0, x1] = event.selection as [number, number];
    let range: [T, T] = [
      this.parseScaleValue(x0),
      this.parseScaleValue(x1)
    ];

    // Show tooltip during brushing
    if (event.sourceEvent && (event.sourceEvent.type === 'mousemove' || event.sourceEvent.type === 'mousedown')) {
      this.throttledTooltipUpdate(event.sourceEvent as MouseEvent, range)
    }

    // Only snap when the brush drag ends
    if (event.sourceEvent.type === 'mouseup' || event.sourceEvent.type === 'touchend') {
      this.brushTooltip.style('visibility', 'hidden');

      // Find nearest data points
      const snappedRange: [T, T] = [
        this.findNearestDataPoint(range[0]),
        this.findNearestDataPoint(range[1])
      ];

      // Convert snapped values back to pixels
      const snappedX0 = this.getScaleValue(snappedRange[0])
      const snappedX1 = this.getScaleValue(snappedRange[1])

      // Move brush to snapped positions
      this.brushG
        .transition()
        .duration(200)
        .call(this.brush.move, [snappedX0, snappedX1]);

      // Trigger the callback with snapped values
      this.debouncedBrushEnd(snappedRange)
    } else {
      // During brushing, use unsnapped values
      this.debouncedBrushEnd(range)
    }
  }

  public destroy(): void {
    this.svg.remove();
    this.brushTooltip.remove();
  }

  public reset(): void {
    // Get the extent based on data points with proper typing
    let extent: [T, T];

    if (this.dataPoints.length >= 2) {
      extent = [
        this.dataPoints[0],
        this.dataPoints[this.dataPoints.length - 1]
      ];
    } else if (this.dataPoints.length === 1) {
      extent = [this.dataPoints[0], this.dataPoints[0]];
    } else {
      return; // No data points to reset to
    }

    // Animate the brush back to full extent
    this.brushG
      .transition()
      .duration(750)
      .call(this.brush.move, [
        this.getScaleValue(extent[0]),
        this.getScaleValue(extent[1])
      ]);

    // Trigger the callback with full extent
    if (this.onBrush) {
      this.onBrush(extent);
    }
  }
}
