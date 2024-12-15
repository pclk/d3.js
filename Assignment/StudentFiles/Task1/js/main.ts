import * as d3 from 'd3';
import '../css/style.css';
import { ChartManager } from './chart';
import { DataManager, RangeableKeys } from './data';
import { PropertyTransaction } from './types/property';
import { parseArea, parsePrice } from './utils/formatters';
import { StackedBarChart } from './visuals/bar';
import { AxisType, ChartConfig } from './visuals/base';
import { NewNumberBrush, NewTimeBrush } from './visuals/brush/init';
import { NumberBrush } from './visuals/brush/num';
import { TimeBrush } from './visuals/brush/time';
import { TimeDistrictHeatMap } from './visuals/heatmap';
import { ScatterPlot } from './visuals/scatter';
import { ViolinPlot } from './visuals/violin';

async function loadData(): Promise<PropertyTransaction[]> {
  const data = await d3.csv<PropertyTransaction>('/data/clean_property.csv', (d): PropertyTransaction => {
    return {
      "Project Name": d["Project Name"] || null,
      "Street Name": d["Street Name"],
      "Property Type": d["Property Type"],
      "Transacted Price ($)": Number(d["Transacted Price ($)"]),
      "Sale Date": new Date(d["Sale Date"]),
      "Type of Area": d["Type of Area"],
      "Area (SQM)": parseArea(d["Area (SQM)"]),
      "Unit Price ($ PSM)": parsePrice(d["Unit Price ($ PSM)"]),
      "Tenure Type": d["Tenure Type"],
      "Lease Years": Number(d["Lease Years"]) || null,
      "Postal District": Number(d["Postal District"]),
      "District Name": d["District Name"],
      "Floor Category": d["Floor Category"],
      "Floor Min": Number(d["Floor Min"]) || null,
      "Floor Max": Number(d["Floor Max"]) || null,
      "Transaction Year": Number(d["Transaction Year"]),
      "Transaction Month": Number(d["Transaction Month"])
    };
  });
  return data;
}

async function initialize() {
  try {
    // Show loading state
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.style.display = 'block';
    }

    // Load data
    const data = await loadData();
    const dataManager = new DataManager(data);
    const chartManager = new ChartManager(dataManager);

    // Hide loading state
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }

    const axisConfigs: Record<string, AxisType> = {
      'District Name': {
        key: 'District Name' as const,
        label: 'District Name',
        scale: 'band' as const,
        format: (d: string) => d.length > 20 ? d.substring(0, 20) + '...' : d,
        rotate: -20,
        tickSize: 10
      },
      'Sale Date': {
        key: 'Sale Date' as const,
        label: 'Sale Date',
        scale: 'time' as const,
        format: d3.timeFormat('%b %Y')
      },
      'Transacted Price ($)': {
        key: 'Transacted Price ($)' as const,
        label: 'Price (SGD)',
        scale: 'linear' as const,
        format: (d: number) => {
          if (d >= 1000000) {
            return `$${(d / 1000000).toFixed(0)}m`;
          } else if (d >= 1000) {
            return `$${(d / 1000).toFixed(0)}k`;
          }
          return `$${d.toFixed(0)}`;
        },
        tickSize: 5
      },
      'Transacted Price ($) (Log)': {
        key: 'Transacted Price ($)' as const,
        label: 'Price (SGD) (Log)',
        scale: 'log' as const,
        format: (d: number) => {
          // Only show specific values we want to display
          if (d === 1000000000) { // 1B
            return '$1000m';
          } else if (d === 100000000) { // 100M
            return '$100m';
          } else if (d === 10000000) { // 10M
            return '$10m';
          } else if (d === 1000000) { // 1M
            return '$1m';
          } else if (d === 100000) { // 100K
            return '$100k';
          }
          // Return empty string for all other values
          return '';
        },
        tickSize: 5
      },
      'Area (SQM)': {
        key: 'Area (SQM)' as const,
        label: 'Area (sqm)',
        scale: 'linear' as const,
        format: (d: number) => d3.format(',.0f')(d),
        tickSize: 5
      },
      'Area (SQM) (Log)': {
        key: 'Area (SQM)' as const,
        label: 'Area (sqm) (Log)',
        scale: 'log' as const,
        format: (d: number) => {
          // Only show specific round numbers up to ~61,511
          if (d === 100000) {
            return '100,000';
          } else if (d === 10000) {
            return '10,000';
          } else if (d === 1000) {
            return '1,000';
          } else if (d === 100) {
            return '100';
          } else if (d === 10) {
            return '10';
          }
          // Return empty string for all other values
          return '';
        },
        tickSize: 5

      },
      'Property Type': {
        key: 'Property Type' as const,
        label: 'Property Type',
        scale: 'band' as const,
        format: (d: string) => d
      },
      'Tenure Type': {
        key: 'Tenure Type' as const,
        label: 'Tenure Type',
        scale: 'band' as const,
        format: (d: string) => d
      },
      'Type of Area': {
        key: 'Type of Area' as const,
        label: 'Type of Area',
        scale: 'band' as const,
        format: (d: string) => d.length > 20 ? d.substring(0, 20) + '...' : d,
        rotate: -45, // Rotate labels to prevent overlap
      },
      'Floor Category': {
        key: 'Floor Category' as const,
        label: 'Floor Category',
        scale: 'band' as const,
        format: (d: string) => d
      },
      'Unit Price ($ PSM)': {
        key: 'Unit Price ($ PSM)' as const,
        label: 'Price per SQM',
        scale: 'linear' as const,
        format: (d: number) => {
          if (d >= 1000000) {
            return `$${(d / 1000000).toFixed(0)}m`;
          } else if (d >= 1000) {
            return `$${(d / 1000).toFixed(0)}k`;
          }
          return `$${d.toFixed(0)}`;
        },
        tickSize: 5
      },
      'Lease Years': {
        key: 'Lease Years' as const,
        label: 'Lease Years',
        scale: 'linear' as const,
        format: (d: number) => d3.format(',')(d), // e.g., 99, 999
      },
      'Count': {
        key: 'Count' as keyof PropertyTransaction, // place an key but we won't actually use its values
        label: 'Count',
        scale: 'linear',
        format: d3.format(',d'),
        tickSize: 5
      }
    };


    const brushContainer = document.querySelector('#time-brush-container') as HTMLElement;
    const chartContainer = document.querySelector('.chart') as HTMLElement;

    // Get dimensions
    const brushContainerRect = brushContainer.getBoundingClientRect();
    const chartContainerRect = chartContainer.getBoundingClientRect();
    console.log("chartContainerRect", chartContainerRect.height, chartContainerRect.width)


    const margin = { top: 20, right: 80, bottom: 80, left: 80 }
    const width = chartContainerRect.width - margin.left - margin.right
    const height = 200
    const scatterConfig: ChartConfig = {
      width: width,
      height: height,
      margin: margin,
      xAxis: { ...axisConfigs['Sale Date'] },
      yAxis: { ...axisConfigs['Transacted Price ($) (Log)'] },
      thirdAxis: { ...axisConfigs['Property Type'] },
      allowedAxes: {
        xAxis: [
          axisConfigs['Area (SQM)'],
          axisConfigs['Sale Date'],
          axisConfigs['Unit Price ($ PSM)']
        ],
        yAxis: [
          axisConfigs['Transacted Price ($)'],
          axisConfigs['Transacted Price ($) (Log)'],
          axisConfigs['Unit Price ($ PSM)'],
          axisConfigs['Area (SQM)'],
          axisConfigs['Area (SQM) (Log)'],
        ],
        thirdAxis: [
        ]
      }
    }
    const heatmapConfig: ChartConfig = {
      width: width,
      height: height,
      margin: margin,
      xAxis: { ...axisConfigs['District Name'] },
      yAxis: { ...axisConfigs['Property Type'] },
      thirdAxis: { ...axisConfigs['Transacted Price ($)'] },
      allowedAxes: {
        xAxis: [
          axisConfigs['District Name'],
          axisConfigs['Floor Category']
        ],
        yAxis: [
          axisConfigs['Property Type'],
          axisConfigs['Type of Area'],
          axisConfigs['Tenure Type']
        ],
        thirdAxis: [
          axisConfigs['Transacted Price ($)'],
          axisConfigs['Transacted Price ($) (Log)'],
          axisConfigs['Unit Price ($ PSM)'],
          axisConfigs['Area (SQM)'],
          axisConfigs['Area (SQM) (Log)'],
        ]
      }
    };
    const violinConfig: ChartConfig = {
      width: width,
      height: height,
      margin: margin,
      xAxis: { ...axisConfigs['Property Type'] },
      yAxis: { ...axisConfigs['Transacted Price ($) (Log)'] },
      allowedAxes: {
        xAxis: [
          axisConfigs['Property Type'],
          axisConfigs['Tenure Type'],
          axisConfigs['Type of Area'],
          axisConfigs['District Name']
        ],
        yAxis: [
          axisConfigs['Transacted Price ($)'],
          axisConfigs['Transacted Price ($) (Log)'],
          axisConfigs['Unit Price ($ PSM)'],
          axisConfigs['Area (SQM)'],
          axisConfigs['Area (SQM) (Log)'],
        ],
        thirdAxis: [
        ]
      }
    };

    const stackedBarConfig: ChartConfig = {
      width: width,
      height: height,
      margin: margin,
      xAxis: { ...axisConfigs['District Name'] },  // Primary grouping
      yAxis: axisConfigs['Count'],
      thirdAxis: { ...axisConfigs['Property Type'] },
      allowedAxes: {
        xAxis: [
          axisConfigs['District Name'],
          axisConfigs['Property Type'],
          axisConfigs['Tenure Type'],
          axisConfigs['Type of Area']
        ],
        yAxis: [
          axisConfigs['Count']
        ],
        thirdAxis: [
          axisConfigs['Property Type'],
          axisConfigs['Tenure Type'],
          axisConfigs['Type of Area']
        ]
      }
    };


    const brushSize = {
      width: brushContainerRect.width - 20,
      height: brushContainerRect.height,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    }

    // Initialize brushes
    const dateBrush = setupBrushWithInputs(
      dataManager,
      'Sale Date',
      "#time-brush-container",
      { min: 'minDate', max: 'maxDate' },
      brushSize
    ) as TimeBrush;

    const priceBrush = setupBrushWithInputs(
      dataManager,
      'Transacted Price ($)',
      "#price-brush-container",
      { min: 'minPrice', max: 'maxPrice' },
      brushSize
    ) as NumberBrush;
    const areaBrush = setupBrushWithInputs(
      dataManager,
      'Area (SQM)',
      "#area-brush-container",
      { min: 'minArea', max: 'maxArea' },
      brushSize
    ) as NumberBrush;

    // Initialize global filters
    dateBrush.setDataPoints(dataManager.getUnique("Sale Date") as Date[]);
    priceBrush.setDataPoints(dataManager.getUnique("Transacted Price ($)") as number[]);
    areaBrush.setDataPoints(dataManager.getUnique("Area (SQM)") as number[]);

    // Initialize visualization
    const scatterPlot = new ScatterPlot('#scatter-container', scatterConfig, dataManager);
    /* This is a animated connected scatterplot, to track relationship between 
     * Unit Price (PSM) and Area over time. 
     * X-axis: Area (SQM)
     * Y-axis: Unit Price ($ PSM) 
     * Animation: Transaction Year/Month progression 
     * Color: Property Type (Office/Retail/Shop House)
     * Connect points chronologically 
     * Business Insights: 
     * Identify pricing efficiency (price/area relationship) 
     * Spot temporal trends in property sizes and prices 
     * Discover market segments by property type
     * */

    const heatMap = new TimeDistrictHeatMap('#heatmap-container', heatmapConfig, dataManager);
    const violinPlot = new ViolinPlot('#violin-container', violinConfig, dataManager);
    const stackedBarChart = new StackedBarChart('#bar-container', stackedBarConfig, dataManager);


    // Add charts to manager
    chartManager.addChart('scatter-container', scatterPlot, scatterConfig);
    chartManager.addChart('heatmap-container', heatMap, heatmapConfig);
    chartManager.addChart('violin-container', violinPlot, violinConfig);
    chartManager.addChart('bar-container', stackedBarChart, stackedBarConfig);

    ['xAxis', 'yAxis', 'thirdAxis'].forEach(selectorId => {
      const selector = document.querySelector<HTMLSelectElement>(`#${selectorId}`);
      if (!selector) {
        console.error(`Selector #${selectorId} not found`);
        return;
      }
      selector.innerHTML = '';
    })
    // Setup reset button
    d3.select('#reset-filters')
      .on('click', () => {
        // Reset brush controls
        dateBrush.reset();
        priceBrush.reset();
        areaBrush.reset();
      });

    updateVis();

    interface BrushInput {
      min: HTMLInputElement;
      max: HTMLInputElement;
      type: 'date' | 'number';
    }
    type BrushValueType = Date | number;
    function setupBrushWithInputs<T extends BrushValueType>(
      dataManager: DataManager,
      key: RangeableKeys,
      containerId: string,
      inputIds: { min: string; max: string },
      brushSize: any
    ) {
      // Get input elements
      const minInput = document.getElementById(inputIds.min) as HTMLInputElement;
      const maxInput = document.getElementById(inputIds.max) as HTMLInputElement;

      const isDateBrush = dataManager.isDateKey(key);

      // Create brush with callback that updates inputs
      let brush;
      if (isDateBrush) {
        brush = NewTimeBrush(
          dataManager,
          containerId,
          brushSize,
          key,
          (range: [Date, Date]) => {
            updateInputsFromBrush(range, { min: minInput, max: maxInput, type: 'date' });
            dataManager.setRange(key, range);
            updateVis();
          }
        );
      } else {
        brush = NewNumberBrush(
          dataManager,
          containerId,
          brushSize,
          key,
          (range: [number, number]) => {
            updateInputsFromBrush(range, { min: minInput, max: maxInput, type: 'number' });
            dataManager.setRange(key, range);
            updateVis();
          }
        );
      }
      // Setup input listeners with proper typing
      setupInputListeners(
        { min: minInput, max: maxInput, type: isDateBrush ? 'date' : 'number' },
        brush,
        key,
        dataManager
      );

      // Set initial input values
      const initialRange = dataManager.getExtent(key) as [T, T];
      updateInputsFromBrush(
        initialRange,
        { min: minInput, max: maxInput, type: isDateBrush ? 'date' : 'number' }
      );

      return brush;
    }

    function updateInputsFromBrush(
      range: [Date | number, Date | number],
      inputs: BrushInput
    ) {
      const [min, max] = range;
      if (inputs.type === 'date') {
        inputs.min.value = (min as Date).toISOString().split('T')[0];
        inputs.max.value = (max as Date).toISOString().split('T')[0];
      } else {
        inputs.min.value = (min as number).toString();
        inputs.max.value = (max as number).toString();
      }
    }

    function setupInputListeners(
      inputs: BrushInput,
      brush: any,
      key: RangeableKeys,
      dataManager: DataManager
    ) {
      const updateFromInputs = () => {
        let minVal, maxVal;

        if (inputs.type === 'date') {
          minVal = new Date(inputs.min.value);
          maxVal = new Date(inputs.max.value);
        } else {
          minVal = Number(inputs.min.value);
          maxVal = Number(inputs.max.value);
        }

        const range = [minVal, maxVal] as [typeof minVal, typeof maxVal];
        brush.updateBrush(range);
        dataManager.setRange(key, range);
        updateVis();
      };

      inputs.min.addEventListener('change', updateFromInputs);
      inputs.max.addEventListener('change', updateFromInputs);
    }

    // Setup reset button
    d3.select('#reset-filters')
      .on('click', () => {
        dateBrush.reset();
        priceBrush.reset();
        areaBrush.reset();
      });

    function updateVis() {
      heatMap.update();
      scatterPlot.update();
      violinPlot.update()
      stackedBarChart.update()
    }


  } catch (error) {
    console.error('Error initializing visualization:', error);
    const loadingElement = document.getElementById('loading');
    if (loadingElement) {
      loadingElement.textContent = 'Error loading data. Please check the console for details.';
    }
  }
}

initialize();
