import * as d3 from 'd3';
import { DataManager } from "./data";
import { AllowedAxesConfig, AxisType, ChartBase, ChartConfig } from "./visuals/base";

export class ChartManager {
  private charts: Map<string, {
    instance: ChartBase,
    config: ChartConfig
  }> = new Map();
  private dataManager: DataManager;
  private focusedChart: string | null = null;
  private headers: Map<string, HTMLHeadingElement> = new Map();

  constructor(dataManager: DataManager) {
    this.dataManager = dataManager;
    d3.select('body').on('click', this.handleDocumentClick.bind(this));

    ['heatmap-container', 'scatter-container', 'violin-container', 'bar-container'].forEach(id => {
      const container = document.getElementById(id)?.parentElement;
      const header = container?.querySelector('h3');
      console.log("header", header)
      if (header) {
        this.headers.set(id, header as HTMLHeadingElement);
      }
    });
  }

  addChart(id: string, chart: ChartBase, config: ChartConfig) {
    this.charts.set(id, {
      instance: chart,
      config: config
    });

    // Wait for DOM to be ready
    requestAnimationFrame(() => {
      const container = document.getElementById(id);
      if (!container) {
        console.error(`Container #${id} not found`);
        return;
      }

      container.addEventListener('click', (event) => {
        event.stopPropagation(); // Prevent event bubbling
        this.focusChart(id);
      });
    });
  }

  private handleDocumentClick(event: MouseEvent) {
    // Check if click was outside of any chart containers
    const controlsContainer = document.querySelector('.global-controls');
    const isClickInControls = controlsContainer?.contains(event.target as Node);
    // If click was in controls, don't unfocus
    if (isClickInControls) {
      return;
    }
    const isClickOutsideCharts = Array.from(this.charts.keys()).every(chartId => {
      const container = document.querySelector(`#${chartId}`);
      return container ? !container.contains(event.target as Node) : true;
    });

    if (isClickOutsideCharts) {
      this.unfocusAllCharts();
    }
  }

  private unfocusAllCharts() {
    if (!this.focusedChart) return;

    // Reset visual state of all charts
    this.charts.forEach((chart, id) => {
      d3.select(`#${id}`)
        .transition()
        .duration(300)
        .style('opacity', 1)
        .style('border', 'none');
      this.updateChartHeader(id, chart.config, false);
    });

    // Reset selectors to default state or clear them
    const selectors = {
      xAxis: document.querySelector<HTMLSelectElement>('#xAxis'),
      yAxis: document.querySelector<HTMLSelectElement>('#yAxis'),
      groupBy: document.querySelector<HTMLSelectElement>('#thirdAxis')
    };

    // Optionally reset selector values to default
    if (selectors.xAxis) selectors.xAxis.value = '';
    if (selectors.yAxis) selectors.yAxis.value = '';
    if (selectors.groupBy) selectors.groupBy.value = '';

    this.focusedChart = null;
  }


  focusChart(id: string) {
    if (this.focusedChart === id) {
      this.unfocusAllCharts();
      return;
    }

    this.focusedChart = id;
    const chart = this.charts.get(id);
    if (!chart) {
      console.error(`Chart ${id} not found in manager`);
      return;
    }

    // Update selectors to reflect current chart's configuration
    this.updateSelectors(chart.config);

    // Update visual feedback
    this.updateChartFocus(id);

    this.updateChartHeader(this.focusedChart, chart.config, true)
  }

  private updateSelectors(config: ChartConfig) {
    ['xAxis', 'yAxis', 'thirdAxis'].forEach(selectorId => {
      const selector = document.querySelector<HTMLSelectElement>(`#${selectorId}`);

      if (!selector) {
        console.error(`Selector #${selectorId} not found`);
        return;
      }

      // Clear existing options
      selector.innerHTML = '';

      // Add empty option
      const emptyOption = document.createElement('option');
      emptyOption.value = '';
      emptyOption.text = 'Select an axis';
      selector.appendChild(emptyOption);

      // Get allowed axes for this selector
      const allowedAxes = config.allowedAxes?.[selectorId as keyof AllowedAxesConfig];

      if (allowedAxes) {
        // Clear empty option
        selector.innerHTML = '';
        if (allowedAxes.length === 0) {
          const option = document.createElement('option');
          option.value = ''
          option.text = 'N/A for this chart'
          selector.appendChild(option)
        }
        // Add options for each allowed axis
        allowedAxes.forEach(axis => {
          const option = document.createElement('option');
          option.value = axis.label;
          option.text = axis.label;
          selector.appendChild(option);
        });

        // Set current value based on config
        if (selectorId === 'xAxis') {
          selector.value = String(config.xAxis.label);
        } else if (selectorId === 'yAxis') {
          selector.value = String(config.yAxis.label);
        } else if (selectorId === 'thirdAxis' && config.thirdAxis) {
          selector.value = String(config.thirdAxis.label);
        }

        if (allowedAxes.length === 0) {
          selector.innerHTML = ''
          const option = document.createElement('option')
          option.value = 'N/A'
          option.text = 'N/A for this chart'
          selector.appendChild(option)
          selector.value = 'N/A'
        }

      } else {
      }

      // Add change listener
      selector.addEventListener('change', (event) => {
        const select = event.target as HTMLSelectElement;
        const currentValue = select.value;

        if (!currentValue) return;

        const selectedAxis = allowedAxes?.find(axis => axis.label === currentValue);

        if (selectedAxis) {
          this.updateChartConfig({
            [selectorId]: selectedAxis
          });
        }
      });
    });
  }

  private updateChartFocus(focusedId: string) {
    // Visual feedback for focused/unfocused charts
    this.charts.forEach((_, id) => {
      d3.select(`#${id}`)
        .style('opacity', id === focusedId ? 1 : 0.5)
        .style('border', id === focusedId ? '2px solid #fde725' : 'none');
    });
  }

  private updateChartHeader(chartId: string, config: ChartConfig, isFocused: boolean = false) {
    const headerId = chartId;
    const header = this.headers.get(headerId);
    if (!header) return;

    let title = '';
    switch (chartId) {
      case 'heatmap-container':
        title = `Average ${config.thirdAxis?.label} per ${config.xAxis.label} and ${config.yAxis.label}`;
        break;
      case 'scatter-container':
        title = `Time series ${config.yAxis.label} over ${config.xAxis.label}`;
        break;
      case 'violin-container':
        title = `Distribution of ${config.yAxis.label} over ${config.xAxis.label}`;
        break;
      case 'bar-container':
        title = `Count of ${config.xAxis.label} grouped by ${config.thirdAxis?.label || 'None'}`;
        break;
    }

    header.textContent = title;
    header.className = `font-bold ${isFocused ? 'text-viridis-yellow' : 'text-[#f7f7f7]'}`;
  }

  updateChartConfig(updates: {
    xAxis?: Partial<AxisType>,
    yAxis?: Partial<AxisType>,
    thirdAxis?: Partial<AxisType>
  }) {
    if (!this.focusedChart) return;

    const chart = this.charts.get(this.focusedChart);
    if (!chart) return;

    // Update only the focused chart
    chart.instance.updateAxis(updates);
    chart.instance.update()
    this.updateChartHeader(this.focusedChart, chart.config, true);
  }

  public getCurrentChart(): string | null {
    // Add method to return the currently active chart's key
    return this.focusedChart;
  }

  public getChartConfig(id: string): ChartConfig | null {
    // Add method to return the config for a specific chart
    const chart = this.charts.get(id);
    if (chart) {
      return chart.config
    } else {
      console.error("getChartConfig: chart not found", { id })
      return null
    }
  }

}
