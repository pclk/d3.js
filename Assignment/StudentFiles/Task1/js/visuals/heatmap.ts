import * as d3 from 'd3';
import { DataManager, RangeableKeys } from '../data';
import { PropertyTransaction } from '../types/property';
import { formatCurrency } from '../utils/formatters';
import { ChartBase, ChartConfig } from "./base";

type Cell = {
  xAxisValue: string | number | Date
  yAxisValue: string | number | Date
  thirdAxisValue: number
}
export class TimeDistrictHeatMap extends ChartBase {
  private colorScale!: d3.ScaleSequential<string>;
  private cells!: d3.Selection<SVGRectElement, Cell, SVGGElement, unknown>;

  constructor(container: string, config: ChartConfig, dataManager: DataManager) {
    super(container, config, dataManager);
    this.colorScale = d3.scaleSequential(d3.interpolateViridis).domain([1, 0])
  }

  public async update(): Promise<void> {
    const data = this.dataManager.getFilteredData();
    const xKey = this.config.xAxis.key
    const yKey = this.config.yAxis.key
    const thirdAxisKey = this.config.thirdAxis?.key

    const getYValue = (d: PropertyTransaction) => {
      if (this.dataManager.isDateKey(yKey as RangeableKeys)) {
        return d3.timeMonth(new Date(d[yKey] as Date));
      }
      return d[yKey];
    }

    // Group by both dimensions
    const grouped = d3.group(
      data,
      d => d[xKey],
      d => getYValue(d)
    );

    const cells: Cell[] = []
    grouped.forEach((yGroups, xValue) => {
      yGroups.forEach((transactions, yValue) => {
        const meanValue = this.dataManager.isDateKey(thirdAxisKey!)
          ? d3.mean(transactions, d => new Date(d[thirdAxisKey!] as Date).getTime())
          : d3.mean(transactions, d => Number(d[thirdAxisKey!])) || 0;
        cells.push({
          xAxisValue: xValue!,
          yAxisValue: yValue!,
          thirdAxisValue: meanValue!,
        });
      })
    })

    this.updateAxis();

    // Update cells
    this.cells = this.svg.selectAll<SVGRectElement, Cell>('.cell')
      .data(cells, d => `${d.xAxisValue}-${d.yAxisValue}`);

    // Exit
    this.cells.exit().remove();

    // Enter
    const cellsEnter = this.cells.enter()
      .append('rect')
      .attr('class', 'cell')
      .attr('opacity', 0)

    // Calculate cell dimensions accounting for margins
    const effectiveWidth = this.config.width - this.config.margin.left - this.config.margin.right;
    const effectiveHeight = this.config.height - this.config.margin.top - this.config.margin.bottom;

    const cellWidth = effectiveWidth / (new Set(cells.map(d => d.xAxisValue))).size;
    const cellHeight = effectiveHeight / (new Set(cells.map(d => d.yAxisValue))).size;
    // Update + Enter

    const values = cells.map(d => d.thirdAxisValue);
    if (this.config.thirdAxis?.scale === 'log') {
      // For log scale, transform the values and domain
      const logValues = values.map(v => v > 0 ? Math.log10(v) : 0); // Handle zero/negative values
      const logMax = Math.max(...logValues);
      const logMin = Math.min(...logValues);

      // Update colorScale to work with log-transformed values
      this.colorScale = d3.scaleSequential(d3.interpolateViridis)
        .domain([logMin, logMax]);

      // Modify the fill attribute to use log-transformed values
      this.cells.merge(cellsEnter)
        .transition()
        .duration(750)
        .attr('x', d => this.getScaledBandValue(this.xScale as d3.ScaleBand<any>, d.xAxisValue))
        .attr('y', d => this.getScaledBandValue(this.yScale as d3.ScaleBand<any>, d.yAxisValue))
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', d => {
          const logValue = d.thirdAxisValue > 0 ? Math.log10(d.thirdAxisValue) : 0;
          return this.colorScale(logValue);
        })
        .attr('opacity', 1);
    } else {
      this.colorScale.domain([Math.min(...values), Math.max(...values)]);

      this.cells.merge(cellsEnter)
        .transition()
        .duration(750)
        .attr('x', d => this.getScaledBandValue(this.xScale as d3.ScaleBand<any>, d.xAxisValue))
        .attr('y', d => this.getScaledBandValue(this.yScale as d3.ScaleBand<any>, d.yAxisValue))
        .attr('width', cellWidth)
        .attr('height', cellHeight)
        .attr('fill', d => this.colorScale(d.thirdAxisValue))
        .attr('opacity', 1);
    }

    // Add tooltips
    this.cells.merge(cellsEnter)
      .on('mouseover', (event: MouseEvent, d: Cell) => {
        const tooltipContent = `
          <strong>${this.config.xAxis.key}:</strong> ${d.xAxisValue}<br/>
          <strong>${this.config.yAxis.key}:</strong> ${d.yAxisValue instanceof Date ? d3.timeFormat('%B %Y')(d.yAxisValue) : d.yAxisValue}<br/>
          <strong>${this.config.thirdAxis?.key}: </strong> ${typeof d.thirdAxisValue === 'number' ? formatCurrency(d.thirdAxisValue) : d.thirdAxisValue
          }<br/>
        `;
        this.showTooltip(tooltipContent, event)
      })
      .on('mousemove', (event: MouseEvent) => this.positionTooltip(event))
      .on('mouseout', () => this.hideTooltip())

    // this.xAxis
    //   .selectAll("text")
    //   .attr("y", "10")
    //   .attr("x", "0")
    //   .attr("text-anchor", "end")
    //   .attr("transform", "rotate(-40)")
  }

}
