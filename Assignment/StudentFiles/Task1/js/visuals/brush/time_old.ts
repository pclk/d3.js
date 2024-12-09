import * as d3 from 'd3';

export interface BrushConfig<T extends Date | number> {
  container: string;
  extent: [T, T];
  scale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  height?: number;
  width?: number;
  margin?: { top: number; right: number; bottom: number; left: number };
  tickFormat?: (d: d3.NumberValue) => string;  // Updated type
  tickCount?: number;
  onBrush?: (range: [T, T]) => void;
}

export class GenericBrush<T extends Date | number> {
  private svg: d3.Selection<SVGSVGElement, unknown, HTMLElement, any>;
  private brushG: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  private brush: d3.BrushBehavior<unknown>;
  private scale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number>;
  private height: number;
  private width: number;
  private margin: { top: number; right: number; bottom: number; left: number };
  private onBrush: (range: [T, T]) => void;
  private dataPoints: T[] = []; // Store available data points
  private brushTooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

  constructor(config: BrushConfig<T>) {
    this.height = config.height || 50;
    this.width = config.width || 300;
    this.margin = config.margin || { top: 10, right: 20, bottom: 20, left: 20 };
    this.scale = config.scale;
    this.onBrush = config.onBrush || (() => { });

    // Create SVG
    this.svg = d3.select(config.container)
      .append('svg')
      .attr('width', this.width + this.margin.left + this.margin.right)
      .attr('height', this.height + this.margin.top + this.margin.bottom);

    const g = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left},${this.margin.top})`);

    // Ensure the scale's domain is set correctly
    const fullDomain = this.scale.domain();

    // Create axis
    const axis = d3.axisBottom(this.scale)
      .ticks(config.tickCount || 5);

    if (config.tickFormat) {
      axis.tickFormat(config.tickFormat);
    }

    g.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.height - this.margin.bottom})`)
      .call(axis);

    // Create brush with correct extent
    this.brush = d3.brushX()
      .extent([[0, 0], [this.width, this.height - this.margin.bottom]])
      .on('start brush end', this.brushed.bind(this));  // Changed this line

    // Add brush to SVG
    this.brushG = g.append('g')
      .attr('class', 'brush')
      .call(this.brush);

    // Set initial brush selection to full domain
    const x0 = this.scale(fullDomain[0]);
    const x1 = this.scale(fullDomain[1]);

    this.brushG
      .call(this.brush.move, [x0, x1]);

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

    this.addDataPointMarkers();
  }

  public updateBrush(extent: [T, T]) {
    const timeExtent = extent.map(d => d instanceof Date ? d.getTime() : d) as [T, T];
    this.scale.domain(timeExtent);

    const axis = d3.axisBottom(this.scale);

    this.svg.select<SVGGElement>('.x-axis')
      .transition()
      .duration(750)
      .call(axis as any);
  }

  public setBrushExtent(range: [T, T]) {
    // Ensure the scale's domain is updated
    this.scale.domain(range);

    // Update axis
    this.svg.select<SVGGElement>('.x-axis')
      .transition()
      .duration(750)
      .call(d3.axisBottom(this.scale) as any);

    // Set brush to full range
    const x0 = this.scale(range[0]);
    const x1 = this.scale(range[1]);

    this.brushG
      .call(this.brush.move, [x0, x1]);
  }

  // Update the setDataPoints method to ensure the scale is updated
  public setDataPoints(points: T[]) {
    this.dataPoints = points;

    // Optionally update the scale domain to match the data points
    const extent = d3.extent(points) as [T, T];
    if (extent[0] && extent[1]) {
      this.scale.domain(extent);

      // Update the axis
      this.svg.select('.x-axis')
        .transition()
        .duration(750)
        .call(d3.axisBottom(this.scale) as any);
    }

    this.addDataPointMarkers();
  }


  private calculateTimeDifference(a: T, b: T): number {
    const timeA = a instanceof Date ? a.getTime() : Number(a);
    const timeB = b instanceof Date ? b.getTime() : Number(b);
    return Math.abs(timeA - timeB);
  }

  private addDataPointMarkers() {
    const g = this.svg.select('g');
    g.selectAll('.data-point-marker').remove();

    // Create groups for markers
    const markerGroups = g.append('g')
      .attr('class', 'data-point-markers');

    // Add base markers
    markerGroups.selectAll('.data-point-marker')
      .data(this.dataPoints)
      .enter()
      .append('g')
      .attr('class', 'marker-group')
      .each((d, i, nodes) => {
        const group = d3.select(nodes[i]);
        const x = this.scale(d instanceof Date ? d.getTime() : d);

        // Add main marker line
        group.append('line')
          .attr('class', 'data-point-marker')
          .attr('x1', x)
          .attr('x2', x)
          .attr('y1', this.height - this.margin.bottom - 15)
          .attr('y2', this.height - this.margin.bottom)
          .attr('stroke', '#999')
          .attr('stroke-width', 1);

        const prevPoint = i > 0 ? this.dataPoints[i - 1] : null;
        const nextPoint = i < this.dataPoints.length - 1 ? this.dataPoints[i + 1] : null;

        const prevGap = prevPoint ?
          this.calculateTimeDifference(d, prevPoint) :
          Infinity;
        const nextGap = nextPoint ?
          this.calculateTimeDifference(d, nextPoint) :
          Infinity;

        const minGap = Math.min(prevGap, nextGap);
        const densityRadius = Math.min(5, 20 / (minGap / (1000 * 60 * 60 * 24)));

        // Add tooltip
        group.append('title')
          .text(d instanceof Date ?
            `${d3.timeFormat('%B %Y')(d)}\nDensity: ${densityRadius.toFixed(2)}` :
            d.toString());
      });
  }

  private getTimestamp(value: T): number {
    return value instanceof Date ? value.getTime() : Number(value);
  }

  private findNearestDataPoint(date: T): T {
    if (this.dataPoints.length === 0) return date;

    const timestamp = this.getTimestamp(date);

    return this.dataPoints.reduce((prev, curr) => {
      const prevTime = this.getTimestamp(prev);
      const currTime = this.getTimestamp(curr);

      const prevDiff = Math.abs(prevTime - timestamp);
      const currDiff = Math.abs(currTime - timestamp);

      return currDiff < prevDiff ? curr : prev;
    });
  }

  private brushed(event: d3.D3BrushEvent<unknown>) {
    if (!event.selection) return;
    if (!event.sourceEvent) return; // ignore brush-by-program

    const [x0, x1] = event.selection as [number, number];
    let range: [T, T] = [
      this.scale.invert(x0) as T,
      this.scale.invert(x1) as T
    ];

    // Show tooltip during brushing
    if (event.sourceEvent && (event.sourceEvent.type === 'mousemove' || event.sourceEvent.type === 'mousedown')) {
      const mouseEvent = event.sourceEvent as MouseEvent;
      const formatDate = (d: T) => {
        if (d instanceof Date) {
          return d3.timeFormat('%B %d, %Y')(d);
        }
        return d.toString();
      };

      // Find nearest data points
      const nearestStart = this.findNearestDataPoint(range[0]);
      const nearestEnd = this.findNearestDataPoint(range[1]);

      this.brushTooltip
        .style('visibility', 'visible')
        .style('left', `${mouseEvent.pageX + 10}px`)
        .style('top', `${mouseEvent.pageY + 10}px`)
        .html(`Range: ${formatDate(nearestStart)} - ${formatDate(nearestEnd)}`);
    }

    // Only snap when the brush drag ends
    if (event.sourceEvent.type === 'mouseup' || event.sourceEvent.type === 'touchend') {
      this.brushTooltip.style('visibility', 'hidden');
      // Find nearest data points
      const snappedRange: [T, T] = [
        this.findNearestDataPoint(range[0]),
        this.findNearestDataPoint(range[1])
      ];

      // Convert snapped dates back to pixels
      const snappedX0 = this.scale(snappedRange[0] instanceof Date ?
        snappedRange[0].getTime() : snappedRange[0]);
      const snappedX1 = this.scale(snappedRange[1] instanceof Date ?
        snappedRange[1].getTime() : snappedRange[1]);

      // Move brush to snapped positions
      this.brushG
        .transition()
        .duration(200)
        .call(this.brush.move, [snappedX0, snappedX1]);

      // Trigger the callback with snapped values
      if (this.onBrush) {
        this.onBrush(snappedRange);
      }
    } else {
      // During brushing, use unsnapped values
      if (this.onBrush) {
        this.onBrush(range);
      }
    }
  }

  public destroy() {
    this.svg.remove();
  }
}

