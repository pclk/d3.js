import * as d3 from 'd3';
import { HeatMapCell } from './types';
import { formatCurrency } from '../../utils/formatters';

export class HeatMapTooltip {
  private tooltip: d3.Selection<HTMLDivElement, unknown, HTMLElement, any>;

  constructor() {
    this.tooltip = this.createTooltip();
  }

  private createTooltip(): d3.Selection<HTMLDivElement, unknown, HTMLElement, any> {
    return d3.select('body')
      .append('div')
      .attr('class', 'tooltip')
      .style('opacity', '0')
    // ... other styles
  }

  public show(event: MouseEvent, data: HeatMapCell): void {
    const tooltipContent = this.generateTooltipContent(data);
    this.tooltip
      .html(tooltipContent)
      .style('opacity', '1')
      .style('left', `${event.pageX + 10}px`)
      .style('top', `${event.pageY - 10}px`);
  }

  public hide(): void {
    this.tooltip.style('opacity', '0');
  }

  private generateTooltipContent(data: HeatMapCell): string {
    return `
      <strong>District:</strong> ${data.xValue}<br/>
      <strong>Date:</strong> ${d3.timeFormat('%B %Y')(data.yValue)}<br/>
      <strong>Average Price:</strong> ${formatCurrency(data.mean)}<br/>
      <strong>Transactions:</strong> ${data.count}
    `;
  }
}
