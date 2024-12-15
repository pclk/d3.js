import * as d3 from 'd3';
import { DataManager } from '../data';
import { PropertyTransaction } from '../types/property';

export type ScaleType = 'linear' | 'time' | 'band' | 'log';

export type AxisType = {
  key: keyof PropertyTransaction;
  label: string;
  scale: ScaleType
  format?: (d: any) => string;
  rotate?: number;
  tickSize?: number;
};

export type AllowedAxesConfig = {
  xAxis: AxisType[];
  yAxis: AxisType[];
  thirdAxis?: AxisType[];
};

export interface ChartConfig {
  width: number;
  height: number;
  margin: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
  xAxis: AxisType;
  yAxis: AxisType;
  thirdAxis?: AxisType;  // Optional grouping
  allowedAxes: AllowedAxesConfig;
}
export abstract class ChartBase {
  protected svg: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  protected config: ChartConfig;
  protected tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;
  protected xScale!: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.ScaleBand<any>;
  protected yScale!: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.ScaleBand<any>;
  protected xAxis!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  protected yAxis!: d3.Selection<SVGGElement, unknown, HTMLElement, any>;
  protected xAxisLabel!: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
  protected yAxisLabel!: d3.Selection<SVGTextElement, unknown, HTMLElement, any>;
  protected dataManager: DataManager;

  constructor(container: string, config: ChartConfig, dataManager: DataManager) {
    this.config = config;
    this.dataManager = dataManager;
    this.tooltip = d3.select('body')
      .append('div')
      .attr('class', 'tooltip bg-[#17011C]')
    this.svg = this.initializeSVG(container);
    this.initializeAxes();
  }

  private initializeSVG(container: string): d3.Selection<SVGGElement, unknown, HTMLElement, any> {
    return d3.select(container)
      .append('svg')
      .attr('width', this.config.width + this.config.margin.left + this.config.margin.right)
      .attr('height', this.config.height + this.config.margin.top + this.config.margin.bottom)
      .append('g')
      .attr('transform', `translate(${this.config.margin.left},${this.config.margin.top})`);
  }

  protected initializeAxes(): void {
    // Initialize scales based on config
    this.xScale = this.createScale(this.config.xAxis.scale || 'linear', true);
    this.yScale = this.createScale(this.config.yAxis.scale || 'linear', false);

    // Create axes
    this.xAxis = this.svg.append('g')
      .attr('class', 'x-axis')
      .attr('transform', `translate(0,${this.config.height})`)
      .style('color', '#f7f7f7')  // Set tick and label color to white
      .call(g => g.select('.domain').attr('stroke', '#fde724'));

    this.yAxis = this.svg.append('g')
      .attr('class', 'y-axis')
      .style('color', '#f7f7f7')  // Set tick and label color to white
      .call(g => g.select('.domain').attr('stroke', '#fde724'));

    // Add labels
    this.xAxisLabel = this.svg.append('text')
      .attr('class', 'x-label')
      .attr('text-anchor', 'middle')
      .attr('x', this.config.width / 2)
      .attr('y', this.config.height + this.config.margin.bottom - 6)
      .style('fill', '#f7f7f7')  // Set label color to white
      .text(this.config.xAxis.label);

    this.yAxisLabel = this.svg.append('text')
      .attr('class', 'y-label')
      .attr('text-anchor', 'middle')
      .attr('transform', 'rotate(-90)')
      .attr('y', -this.config.margin.left + 12)
      .attr('x', -this.config.height / 2)
      .style('stroke', '#f7f7f7')  // Set label color to white
      .text(this.config.yAxis.label);
  }
  private createScale(scaleType: string, isXAxis: boolean) {
    const range = isXAxis
      ? [0, this.config.width]
      : [this.config.height, 0];

    switch (scaleType) {
      case 'time':
        return d3.scaleTime().range(range);
      case 'band':
        return d3.scaleBand().range(range).padding(0.1);
      case 'log':
        console.log("log scale detected")
        return d3.scaleLog().range(range);
      default:
        return d3.scaleLinear().range(range);
    }
  }

  protected setDomain(axis: AxisType) {
    if (axis.scale === "band") {
      const uniqueValues = this.dataManager.getUnique(axis.key);
      console.log('Band scale domain values:', uniqueValues);
      return uniqueValues;  // Return array of unique values for band scale
    }

    // For log and linear scales, use the appropriate key/extent
    const isLogScale = axis.scale === 'log';
    if (isLogScale) {
      // Use the log-specific domain calculation
      const extent = this.getYDomainWithPadding();  // This will use the correct log calculations
      return extent;
    } else {
      // Use regular extent for linear scales
      const extent = this.dataManager.getExtent(axis.key);
      return this.dataManager.isDateKey(axis.key)
        ? extent as [Date, Date]
        : extent as [number, number];
    }
  }


  protected getScaledValue(
    scale: d3.ScaleTime<number, number> | d3.ScaleLinear<number, number> | d3.ScaleBand<any>,
    value: any,
    scaleType: ScaleType
  ): number {
    try {
      if (value === null) return 0;
      if (scaleType === 'time') {
        const date = new Date(value);
        if (isNaN(date.getTime())) {
          console.warn(`Invalid date value: ${value}`);
          return 0;
        }
        return scale(date)!;
      }
      if (scaleType === 'band') {
        return this.getScaledBandValue(scale as d3.ScaleBand<any>, value);
      }
      const num = Number(value);
      if (isNaN(num)) {
        console.warn(`Invalid numeric value: ${value}`);
        return 0;
      }
      return scale(num)!;
    } catch (error) {
      console.error(`Error scaling value: ${value}`, error);
      return 0;
    }
  }

  public getBandwidth(scale: d3.ScaleBand<any>): number {
    return scale.bandwidth();
  }

  public getScaledBandValue(scale: d3.ScaleBand<any>, value: any): number {
    return scale(value) ?? 0;
  }

  protected updateSingleAxis(
    updates: Partial<AxisType>,
    currentConfig: AxisType,
    scale: any,
    axis: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    axisLabel: d3.Selection<SVGTextElement, unknown, HTMLElement, any>,
    isXAxis: boolean
  ): void {
    const updatedConfig = { ...currentConfig, ...updates };
    Object.assign(currentConfig, updates);

    if (updates.scale) {
      if (isXAxis) {
        this.xScale = this.createScale(updatedConfig.scale, isXAxis);
      } else {
        this.yScale = this.createScale(updatedConfig.scale, isXAxis);
      }
    }

    // Update domain based on scale type
    if (updatedConfig.scale === 'band') {
      const categories = this.dataManager.getUnique(updatedConfig.key);
      console.log('Setting band scale domain in updateSingleAxis:', categories);
      if (isXAxis) {
        (this.xScale as d3.ScaleBand<string>).domain(categories as string[]);
      } else {
        (this.yScale as d3.ScaleBand<string>).domain(categories as string[]);
      }
    } else {
      const domain = this.setDomain(updatedConfig);
      if (isXAxis) {
        this.xScale.domain(domain as any); // Adjust type as needed
      } else {
        console.log('Setting new domain:', { old: this.yScale.domain(), new: domain });
        this.yScale.domain(domain as any); // Adjust type as needed
      }
    }
    // Update label if needed
    if (updates.label) {
      axisLabel.text(updatedConfig.label);
    }

    // Update axis display
    this.updateAxisDisplay(
      axis,
      isXAxis ? d3.axisBottom(scale) : d3.axisLeft(scale),
      updatedConfig
    );

  }

  public updateAxis(
    updates?: {
      xAxis?: Partial<AxisType>,
      yAxis?: Partial<AxisType>,
      thirdAxis?: Partial<AxisType>
    }
  ): void {
    if (updates) {
      console.log("updateAxis: updates received", updates)
      if (updates.xAxis) {
        this.updateSingleAxis(
          updates.xAxis,
          this.config.xAxis,
          this.xScale,
          this.xAxis,
          this.xAxisLabel,
          true
        );
      }

      if (updates.yAxis) {
        this.updateSingleAxis(
          updates.yAxis,
          this.config.yAxis,
          this.yScale,
          this.yAxis,
          this.yAxisLabel,
          false
        );
      }

      if (updates.thirdAxis && this.config.thirdAxis) {
        this.config.thirdAxis = {
          ...this.config.thirdAxis,
          ...updates.thirdAxis
        };
      }
    } else {
      // If no updates, just update the domains and display
      this.updateSingleAxis({}, this.config.xAxis, this.xScale, this.xAxis, this.xAxisLabel, true);
      this.updateSingleAxis({}, this.config.yAxis, this.yScale, this.yAxis, this.yAxisLabel, false);
    }
  }

  public updateAxisDisplay(
    axis: d3.Selection<SVGGElement, unknown, HTMLElement, any>,
    axisGenerator: d3.Axis<any>,
    config: AxisType
  ): void {
    if (config.format) {
      axisGenerator.tickFormat(config.format);
    }

    // Apply tickSize if it exists
    if (config.tickSize && config.scale != "band") {
      axisGenerator.ticks(config.tickSize)
    }

    axis.transition()
      .duration(750)
      .call(axisGenerator)
      .call(g => {
        g.select('.domain').style('stroke', '#21918C');  // Set axis line color
        g.selectAll('.tick line').style('stroke', '#21918C');  // Set tick line color
        g.selectAll('.tick text').style('fill', '#f7f7f7');  // Set tick text color
      })
      .end()  // Wait for transition to complete
      .then(() => {
        // Now handle band scale ticks after transition is complete
        if (config.scale === 'band' && config.tickSize) {
          const totalTicks = axis.selectAll('.tick').size();
          console.log("band tick", {
            config,
            totalTicks,
            keepEveryNth: Math.ceil(totalTicks / config.tickSize)
          });

          if (totalTicks > 0) {  // Only proceed if we have ticks
            const keepEveryNth = Math.ceil(totalTicks / config.tickSize);

            axis.selectAll('.tick')
              .style('display', (_, i) => i % keepEveryNth === 0 ? null : 'none');
          }
        } else if (config.scale === 'log' && config.tickSize) {
          console.log("setting scale for log", config.tickSize)
          axisGenerator.ticks(config.tickSize, ".0f");  // ".0f" format for whole numbers
        }

        if (config.rotate) {
          axis.selectAll('text')
            .attr('transform', `rotate(${config.rotate})`)
            .attr('text-anchor', 'end')
            .attr('dx', '-0.8em')
            .attr('dy', '-0.5em');
        }
      })
  }

  public positionTooltip(event: MouseEvent): void {
    const tooltipNode = this.tooltip.node();
    if (!tooltipNode) return;

    const tooltipRect = tooltipNode.getBoundingClientRect();
    const scrollX = document.documentElement.scrollLeft;
    const scrollY = document.documentElement.scrollTop;
    const padding = 50; // Space between cursor and tooltip

    // Position at bottom right of cursor
    const left = event.pageX + padding;
    const top = event.pageY + padding;

    // Check if tooltip would go off-screen
    const rightEdge = left + tooltipRect.width;
    const bottomEdge = top + tooltipRect.height;
    const windowWidth = window.innerWidth + scrollX;
    const windowHeight = window.innerHeight + scrollY;

    // Adjust if necessary to keep tooltip within viewport
    const finalLeft = rightEdge > windowWidth ?
      windowWidth - tooltipRect.width - padding :
      left;
    const finalTop = bottomEdge > windowHeight ?
      windowHeight - tooltipRect.height - padding :
      top;

    this.tooltip
      .style('left', `${finalLeft}px`)
      .style('top', `${finalTop}px`);
  }

  public hideTooltip(): void {
    this.tooltip
      .transition()
      .duration(0)
      .style('opacity', 0)
      .end()
      .then(() => {
        this.tooltip.style('visibility', 'hidden');
      });
  }

  public showTooltip(htmlContent: string, event: MouseEvent): void {
    this.tooltip
      .style('visibility', 'visible')
      .style('opacity', 0)
      .html(htmlContent);

    this.positionTooltip(event);

    this.tooltip.transition()
      .duration(0)
      .style('opacity', 0.9);
  }

  public getYDomainWithPadding(): [number, number] {
    const extent = this.dataManager.getExtent(this.config.yAxis.key);
    const [min, max] = extent as [number, number];
    const isLogScale = this.config.yAxis.scale === 'log';

    if (isLogScale) {
      // Get all values
      const values = this.dataManager.getFilteredData()
        .map(d => Number(d[this.config.yAxis.key]))
        .filter(v => v > 0); // Filter out non-positive values for log scale

      // Find the order of magnitude range
      const logMax = Math.log10(max);
      const logMin = Math.log10(Math.min(...values));
      const logRange = logMax - logMin;

      // Extend the minimum down by one more order of magnitude
      const extendedLogMin = logMin - (logRange * 0.1); // Extend by 10% of the log range
      const minValue = Math.pow(10, extendedLogMin);
      console.log("getYDomainWithPadding logarithm", [minValue, max])

      return [minValue, max];
    } else {
      // Original linear scale handling
      const padding = (max - min) * 0.05;
      return [min - padding, max + padding];
    }
  }


  // Abstract method that child classes must implement
  abstract update(): void;
}
