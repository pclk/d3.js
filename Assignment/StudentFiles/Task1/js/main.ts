import * as d3 from 'd3';
import '../css/style.css';
import { CategoricalKeys, DataManager, RangeableKeys } from './data';
import { PropertyTransaction } from './types/property';
import { parseArea, parsePrice } from './utils/formatters';
import { NewNumberBrush, NewTimeBrush } from './visuals/brush/init';
import { TimeDistrictHeatMap } from './visuals/heatmap/main';
import { ScatterPlot } from './visuals/scatterPlot';

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

    // Hide loading state
    if (loadingElement) {
      loadingElement.style.display = 'none';
    }

    const total_width = 1000
    const total_height = 1000
    const scatterSize = {
      width: total_width,
      height: total_height / 2,
      margin: { top: 40, right: 40, bottom: 60, left: 160 }
    };
    const heatmapSize = {
      width: total_width,
      height: total_height / 2,
      margin: { top: 40, right: 40, bottom: 180, left: 140 }
    };
    const brushSize = {
      width: total_width / 2,
      height: 50,
      margin: { top: 0, right: 0, bottom: 0, left: 0 },
    }

    // Initialize brushes
    const dateBrush = NewTimeBrush(dataManager, "#time-brush-container", brushSize, "Sale Date", (range) => {
      dataManager.setRange("Sale Date", range)
      updateVis();
    })
    const priceBrush = NewNumberBrush(dataManager, "#price-brush-container", brushSize, "Transacted Price ($)", (range) => {
      dataManager.setRange("Transacted Price ($)", range)
      updateVis();
    })
    const areaBrush = NewNumberBrush(dataManager, "#area-brush-container", brushSize, "Area (SQM)", (range) => {
      dataManager.setRange("Area (SQM)", range)
      updateVis();
    })

    // Initialize global filters
    dateBrush.setDataPoints(dataManager.getUnique("Sale Date") as Date[]);
    priceBrush.setDataPoints(dataManager.getUnique("Transacted Price ($)") as number[]);
    areaBrush.setDataPoints(dataManager.getUnique("Area (SQM)") as number[]);

    // Initialize visualization
    const scatterPlot = new ScatterPlot('#chart', scatterSize);
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

    const heatMap = new TimeDistrictHeatMap('#heatmap-container', heatmapSize);

    setupSelectors();

    updateVis();


    function setupSelectors() {
      // X-axis selector
      d3.select<HTMLSelectElement, unknown>('#x-axis')
        .on('change', () => updateVis())
      // Y-axis selector
      d3.select<HTMLSelectElement, unknown>('#y-axis')
        .on('change', () => updateVis())

      // Group-by selector
      d3.select<HTMLSelectElement, unknown>('#group-by')
        .on('change', () => updateVis())

      // Reset button
      d3.select('#reset-filters')
        .on('click', () => {
          // Reset brush controls
          dateBrush.reset();
          priceBrush.reset();
          areaBrush.reset();

          // Reset all select elements to default values
          (document.getElementById('x-axis') as HTMLSelectElement).value = 'District Name';
          (document.getElementById('y-axis') as HTMLSelectElement).value = 'Transacted Price ($)';
          (document.getElementById('group-by') as HTMLSelectElement).value = 'Property Type';
          // Update visualizations
          updateVis();
        });
    }

    function getCurrentSelections() {
      return {
        xKey: (document.getElementById('x-axis') as HTMLSelectElement).value,
        yKey: (document.getElementById('y-axis') as HTMLSelectElement).value,
        groupKey: (document.getElementById('group-by') as HTMLSelectElement).value,
      };
    }

    function updateVis() {
      const { xKey, yKey, groupKey } = getCurrentSelections();

      // Update heatmap
      const heatmapData = dataManager.getHeatMapData(
        xKey as CategoricalKeys,
        groupKey as CategoricalKeys,
        yKey as RangeableKeys
      );
      heatMap.update(heatmapData);

      // Update scatter plot
      const scatterData = dataManager.getFilteredData();
      scatterPlot.update(scatterData);
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
