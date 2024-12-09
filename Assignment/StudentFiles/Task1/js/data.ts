import { PropertyTransaction } from './types/property';
import { HeatMapCell } from './visuals/heatmap/types';
import * as d3 from 'd3';

export type RangeableKeys = Extract<keyof PropertyTransaction,
  'Sale Date' | 'Transacted Price ($)' | 'Area (SQM)' | 'Lease Years'>;

export type CategoricalKeys = Extract<keyof PropertyTransaction,
  'Property Type' | 'District Name' | 'Tenure Type' | 'Type of Area'>

// All functionality related to data
export class DataManager {
  private rawData: PropertyTransaction[] = [];
  private ranges: Map<RangeableKeys, [number | Date, number | Date]> = new Map();
  private selectedCategories: Map<CategoricalKeys, Set<any>> = new Map();
  private readonly rangeableKeys: RangeableKeys[] = [
    'Sale Date',
    'Transacted Price ($)',
    'Area (SQM)',
    'Lease Years'
  ];
  private readonly categoricalKeys: CategoricalKeys[] = [
    "Property Type",
    "District Name",
    "Tenure Type",
    "Type of Area"
  ]
  private viewBy: RangeableKeys = "Transacted Price ($)";
  private groupBy: CategoricalKeys = "Property Type";

  // type guards
  public isDateKey(key: RangeableKeys): boolean {
    return key === 'Sale Date';
  }

  constructor(data: PropertyTransaction[]) {
    this.rawData = data;
    this.initializeRanges();
    this.logData("rawData", data)
  }

  private initializeRanges(): void {
    this.rangeableKeys.forEach(key => {
      this.ranges.set(key, d3.extent(this.rawData, d => d[key]) as [any, any]);
    });
  }

  public setRange(key: RangeableKeys, range: [number | Date, number | Date]): void {
    this.ranges.set(key, range);
  }

  public setSelectables(key: CategoricalKeys, categories: any[]): void {
    this.selectedCategories.set(key, new Set(categories))
  }

  public setViewBy(key: RangeableKeys): void {
    this.viewBy = key
  }

  public setGroupby(key: CategoricalKeys): void {
    this.groupBy = key
  }

  // Data access methods
  public getFilteredData(): PropertyTransaction[] {
    const filtered = this.rawData.filter(row => {
      for (const [key, range] of this.ranges.entries()) {
        if (!range) continue;
        if (key === 'Lease Years') {
          const isFreehold = row['Tenure Type'] === 'Freehold';
          if (isFreehold) continue; // Skip range check for freehold properties
        }
        const value = this.isDateKey(key)
          ? new Date(row[key] as Date)
          : Number(row[key])

        const [min, max] = range
        // Add detailed logging for the first few rows
        if (value < min || value > max) return false;
      }

      for (const [key, selected] of this.selectedCategories.entries()) {
        if ((selected.size > 0 && !selected.has(row[key]))) {
          return false;
        }
      }


      return true
    })
    this.logData('Filtered Data', {
      totalCount: this.rawData.length,
      filteredCount: filtered.length,
      sample: filtered.slice(0, 3)
    });
    return filtered
  }

  // Specific data transformations for different visualizations
  public getHeatMapData(xKey: CategoricalKeys, yKey: CategoricalKeys | RangeableKeys, valueKey: RangeableKeys): HeatMapCell[] {
    const filteredData = this.getFilteredData();

    const getYValue = (d: PropertyTransaction) => {
      if (this.isDateKey(yKey as RangeableKeys)) {
        return d3.timeMonth(new Date(d[yKey] as Date));
      }
      return d[yKey];
    }

    // Group by both dimensions
    const grouped = d3.group(
      filteredData,
      d => d[xKey],
      d => getYValue(d)
    );

    const heatMapData: HeatMapCell[] = [];

    grouped.forEach((yGroups, xValue) => {
      yGroups.forEach((transactions, yValue) => {
        const meanValue = this.isDateKey(valueKey)
          ? d3.mean(transactions, d => new Date(d[valueKey] as Date).getTime())
          : d3.mean(transactions, d => Number(d[valueKey])) || 0;

        if (meanValue && yValue) {
          heatMapData.push({
            xValue,
            yValue,
            count: transactions.length,
            mean: meanValue
          });
        } else throw new Error("no mean value")
      });
    });

    return heatMapData;
  }

  public getScatterPlotData(): PropertyTransaction[] {
    return this.getFilteredData();
  }

  // Getter methods for ranges and unique values
  public getExtent(key: RangeableKeys): [number | Date, number | Date] {
    if (key === 'Lease Years') {
      // Include 0 in the range for freehold properties
      const values = this.rawData.map(d => Number(d[key]));
      return [0, Math.max(...values)];
    }

    return this.isDateKey(key)
      ? d3.extent(this.rawData, d => new Date(d[key])) as [Date, Date]
      : d3.extent(this.rawData, d => Number(d[key])) as [number, number];
  }

  public getUniqueDates(): Date[] {
    return Array.from(new Set(
      this.rawData.map(d => d3.timeMonth(d['Sale Date']))
    )).sort((a, b) => a.getTime() - b.getTime());
  }

  public getUnique(key: RangeableKeys): string[] | number[] | Date[] {
    // Extract unique values from the raw data for the given key, excluding nulls
    const values = Array.from(new Set(
      this.rawData.map(d => d[key])
    )).filter(v => v !== null); // Remove null values

    if (this.isDateKey(key)) {
      // If the key is a date, convert all values to Date objects and sort them
      return values
        .map(v => new Date(v as Date)) // Ensure v is treated as Date
        .sort((a, b) => a.getTime() - b.getTime());
    } else {
      // Check if all values are numbers
      const allNumbers = values.every(v => typeof v === 'number');

      if (allNumbers) {
        // If all values are numbers, sort them numerically
        return (values as number[])
          .sort((a, b) => a - b);
      } else {
        // If not all values are numbers, convert all to strings and sort lexicographically
        return values
          .map(v => String(v)) // Convert each value to string
          .sort((a, b) => a.localeCompare(b));
      }
    }
  }

  public getUniquePrices(): number[] {
    return Array.from(new Set(
      this.rawData.map(d => d['Transacted Price ($)'])
    )).sort((a, b) => a - b)
  }

  public getUniqueDistricts(): number[] {
    return Array.from(new Set(
      this.rawData.map(d => d['Postal District'])
    )).sort((a, b) => a - b);
  }

  public getUniquePropertyTypes(): string[] {
    return Array.from(new Set(
      this.rawData.map(d => d['Property Type'])
    )).sort();
  }

  private logData(message: string, data: any) {
    console.group(`DataManager: ${message}`);
    console.log('Data:', data);
    console.log('Current Ranges:', this.ranges);
    console.log('Current Categories:', this.selectedCategories);
    console.groupEnd();
  }
}
