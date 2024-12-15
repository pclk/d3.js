import * as d3 from 'd3';
import { PropertyTransaction } from './types/property';

export type RangeableKeys = Extract<keyof PropertyTransaction,
  'Sale Date' | 'Transacted Price ($)' | 'Transacted Price ($) (Log)' | 'Area (SQM)' | 'Area (SQM) (Log)' | 'Lease Years' | 'Unit Price ($ PSM)' | 'Count'>;

export type CategoricalKeys = Extract<keyof PropertyTransaction,
  'Property Type' | 'District Name' | 'Tenure Type' | 'Type of Area'>

export type DateKeys = Extract<keyof PropertyTransaction, 'Sale Date'>;

export type NumberKeys = Extract<keyof PropertyTransaction,
  | 'Transacted Price ($)'
  | 'Area (SQM)'
  | 'Unit Price ($ PSM)'
  | 'Lease Years'
  | 'Floor Min'
  | 'Floor Max'
  | 'Transaction Year'
  | 'Transaction Month'
>;

// All functionality related to data
export class DataManager {
  private rawData: PropertyTransaction[] = [];
  private ranges: Map<RangeableKeys, [number | Date, number | Date]> = new Map();
  private selectedCategories: Map<CategoricalKeys, Set<any>> = new Map();
  private filteredData: PropertyTransaction[];
  private readonly rangeableKeys: RangeableKeys[] = [
    'Sale Date',
    'Transacted Price ($)',
    'Transacted Price ($) (Log)' as RangeableKeys,
    'Area (SQM)',
    'Area (SQM) (Log)' as RangeableKeys,
    'Count' as RangeableKeys,
    'Unit Price ($ PSM)',
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
  public isDateKey(key: keyof PropertyTransaction): boolean {
    return key === 'Sale Date';
  }

  public isRangeableKey(key: keyof PropertyTransaction): key is RangeableKeys {
    return this.rangeableKeys.includes(key as RangeableKeys);
  }

  public isCategoricalKey(key: keyof PropertyTransaction): key is CategoricalKeys {
    return !this.isRangeableKey(key);
  }

  constructor(data: PropertyTransaction[]) {
    this.rawData = data;
    this.filteredData = [...data];
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
    this.updateFilteredData();
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
  public updateFilteredData(): void {
    this.filteredData = this.rawData.filter(row => {
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
  }

  public getFilteredData(): PropertyTransaction[] {
    return this.filteredData;
  }

  public getRawData(): PropertyTransaction[] {
    return this.rawData;
  }

  // Getter methods for ranges and unique values
  public getExtent<K extends keyof PropertyTransaction>(
    key: K
  ): K extends RangeableKeys ? [number | Date, number | Date] : string[] {
    console.log("getting extent", key, this.isRangeableKey(key))
    if (this.isRangeableKey(key)) {
      return this.calculateExtent(key as RangeableKeys) as any;
    } else {
      // For categorical keys, return unique sorted values
      if (key === 'Lease Years') {
        // Include 0 in the range for freehold properties
        const values = this.filteredData.map(d => Number(d[key]));
        return [0, Math.max(...values)] as K extends RangeableKeys ? [number | Date, number | Date] : string[];
      }
      return Array.from(new Set(
        this.filteredData.map(d => d[key])
      )).sort((a, b) => String(a).localeCompare(String(b))) as any;
    }
  }

  private calculateExtent(key: RangeableKeys): [number | Date, number | Date] {
    if (this.isDateKey(key)) {
      const dates = this.filteredData.map(d => new Date(d[key] as Date));
      return [
        new Date(Math.min(...dates.map(d => d.getTime()))),
        new Date(Math.max(...dates.map(d => d.getTime())))
      ];
    } else {
      const numbers = this.filteredData.map(d => Number(d[key]));
      return [
        Math.min(...numbers),
        Math.max(...numbers)
      ];
    }
  }

  public getUniqueDates(): Date[] {
    return Array.from(new Set(
      this.filteredData.map(d => d3.timeMonth(d['Sale Date']))
    )).sort((a, b) => a.getTime() - b.getTime());
  }

  public getUnique<K extends keyof PropertyTransaction>(
    key: K
  ): K extends DateKeys ? Date[] : K extends NumberKeys ? number[] : string[] {
    const data = this.filteredData
    const values = Array.from(new Set(
      data.map(d => d[key])
    )).filter(v => v !== null);

    if (this.isDateKey(key)) {
      return values.map(v => new Date(v as Date))
        .sort((a, b) => a.getTime() - b.getTime()) as any;
    }

    // Check if all values are numbers
    if (values.every(v => typeof v === 'number')) {
      return values.sort((a, b) => (a as number) - (b as number)) as any;
    }

    // If not all values are numbers, convert to strings and sort
    return values.map(String)
      .sort((a, b) => a.localeCompare(b)) as any;
  }

  public getUniquePrices(): number[] {
    return Array.from(new Set(
      this.filteredData.map(d => d['Transacted Price ($)'])
    )).sort((a, b) => a - b)
  }

  public getUniqueDistricts(): number[] {
    return Array.from(new Set(
      this.filteredData.map(d => d['Postal District'])
    )).sort((a, b) => a - b);
  }

  public getUniquePropertyTypes(): string[] {
    return Array.from(new Set(
      this.filteredData.map(d => d['Property Type'])
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
