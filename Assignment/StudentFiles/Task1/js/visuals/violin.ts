import * as d3 from 'd3';
import { CategoricalKeys, DataManager, NumberKeys } from '../data';
import { PropertyTransaction } from '../types/property';
import { formatCurrency } from '../utils/formatters';
import { AxisType, ChartBase, ChartConfig } from './base';

export class ViolinPlot extends ChartBase {
  private histogram!: d3.HistogramGeneratorNumber<number, number>;
  private maxNum!: number;
  private bandWidth: number = 0;
  private threshold: number = 40


  constructor(container: string, config: ChartConfig, dataManager: DataManager) {
    super(container, config, dataManager);
  }

  public async update(): Promise<void> {
    const data = this.dataManager.getFilteredData();

    // Define the keys
    const xKey = this.config.xAxis.key as CategoricalKeys;
    const yKey = this.config.yAxis.key as NumberKeys;
    const xScale = this.xScale as d3.ScaleBand<string>;
    const isLogScale = this.config.yAxis.scale === 'log';

    this.updateAxis();

    // Get all y-values first
    const yValues = data.map(d => Number(d[yKey])).filter(v => !isNaN(v));

    // Calculate domain based on actual values
    const yDomain = isLogScale
      ? this.getYDomainWithPadding()
      : [Math.min(0, Math.min(...yValues)), Math.max(...yValues)] as [number, number];

    // Create bins based on the domain
    if (isLogScale) {
      const logMin = Math.log10(yDomain[0]);
      const logMax = Math.log10(yDomain[1]);
      const logBins = d3.range(logMin, logMax, (logMax - logMin) / this.threshold)
        .map(x => Math.pow(10, x));

      this.histogram = d3.bin()
        .domain(yDomain)
        .thresholds(logBins);
    } else {
      this.histogram = d3.bin()
        .domain(yDomain)
        .thresholds(this.threshold);
    }

    // Compute statistics for each group
    const sumstat = d3.rollups(
      data,
      v => {
        const input = v.map(d => {
          const val = Number(d[yKey]);
          if (isLogScale) {
            return val <= 0 ? yDomain[0] : val;
          }
          return val;
        });
        return this.histogram(input);
      },
      d => d[xKey]
    );

    // Compute the maximum number of values in a bin for all groups
    this.maxNum = d3.max(sumstat, s => d3.max(s[1], b => b.length)) || 1;

    // Update scales
    this.bandWidth = xScale.bandwidth();

    // Clean previous plots
    this.svg.selectAll('.violin').remove();
    this.svg.selectAll('.jitter').remove();

    // Create scale for violin width
    const xNum = d3.scaleLinear()
      .range([0, this.bandWidth * 0.5]) // 40% of bandwidth for violin
      .domain([0, this.maxNum]);

    const violins = this.svg.selectAll('.violin')
      .data(sumstat)
      .enter()
      .append('g')
      .attr('class', 'violin')
      .attr('transform', d => {
        const basePos = xScale(d[0]) ?? 0;
        const violinPos = basePos + (this.bandWidth * 0.5);
        return `translate(${violinPos},0)`;
      });

    violins.append('path')
      .datum(d => d[1])
      .attr('class', 'violin-fill')
      .style('stroke', 'none')
      .attr('fill', '#21918C')
      .attr('d', d3.area<d3.Bin<number, number>>()
        .x0(0)
        .x1(d => xNum(d.length))
        .y(d => {
          const yPos = d.x0!;
          return this.getScaledValue(this.yScale, yPos, this.config.yAxis.scale);
        })
        .curve(d3.curveCatmullRom)
      );
    // Add the outline paths
    violins.append('path')
      .datum(d => d[1])
      .attr('class', 'violin-outline')
      .style('fill', 'none')
      .style('stroke', '#fde724')
      .style('stroke-width', 1)
      .attr('d', d3.line<d3.Bin<number, number>>()
        .x(d => xNum(d.length))
        .y(d => {
          const yPos = d.x0!;
          return this.getScaledValue(this.yScale, yPos, this.config.yAxis.scale);
        })
        .curve(d3.curveCatmullRom)
      );

    // Add the mirror outline (left side)
    violins.append('path')
      .datum(d => d[1])
      .attr('class', 'violin-outline-mirror')
      .style('fill', 'none')
      .style('stroke', 'none')
      .style('stroke-width', 2)
      .attr('d', d3.line<d3.Bin<number, number>>()
        .x(d => 0) // Start at center
        .y(d => {
          const yPos = d.x0!;
          return this.getScaledValue(this.yScale, yPos, this.config.yAxis.scale);
        })
        .curve(d3.curveCatmullRom)
      );

    const colorScale = d3.scaleSequential()
      .domain([
        d3.max(data, d => this.getScaledValue(this.yScale, d[yKey], this.config.yAxis.scale)) || 0,
        d3.min(data, d => this.getScaledValue(this.yScale, d[yKey], this.config.yAxis.scale)) || 0
      ])
      .interpolator(d3.interpolateViridis);

    this.svg.selectAll('.jitter')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'jitter')
      .attr('cx', d => {
        const basePos = xScale(d[xKey]) ?? 0; // Get the base position directly from scale
        const jitterAmount = Math.random() * (this.bandWidth * 0.5);
        const finalPos = basePos + jitterAmount;
        return finalPos;
      })
      .attr('cy', d => this.getScaledValue(this.yScale, d[yKey], this.config.yAxis.scale))
      .attr('r', 3)
      .attr('fill', d => colorScale(this.getScaledValue(this.yScale, d[yKey], this.config.yAxis.scale)))
      .attr('opacity', 0.6)
      .on('mouseover', (event: MouseEvent, d: PropertyTransaction) => {
        d3.select(event.currentTarget as SVGCircleElement)
          .transition()
          .duration(200)
          .style('opacity', 1)
          .attr('r', 5);
        const tooltipContent = `
          <strong>${xKey}:</strong> ${d[xKey]}<br/>
          <strong>${yKey}:</strong> ${formatCurrency(d[yKey] as number)}<br/>
        `;
        this.showTooltip(tooltipContent, event)
      })
      .on('mousemove', (event: MouseEvent) => this.positionTooltip(event))
      .on('mouseout', (event: MouseEvent) => {
        d3.select(event.currentTarget as SVGCircleElement)
          .transition()
          .duration(200)
          .style('opacity', 0.6)
          .attr('r', 3);
        this.hideTooltip()
      });
  }

  protected initializeAxes(): void {
    super.initializeAxes();

    // Initialize histogram generator
    const yDomain = this.getYDomainWithPadding();
    this.histogram = d3.bin()
      .domain(yDomain)
      .thresholds(this.threshold);
  }

  public updateAxis(
    updates?: {
      xAxis?: Partial<AxisType>,
      yAxis?: Partial<AxisType>,
      thirdAxis?: Partial<AxisType>
    }
  ): void {
    super.updateAxis(updates);

    // Update histogram thresholds based on new Y scale domain
    const yDomain = this.getYDomainWithPadding();
    this.histogram
      .domain(yDomain)
      .thresholds(this.threshold);
  }
}
