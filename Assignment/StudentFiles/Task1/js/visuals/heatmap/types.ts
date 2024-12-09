export interface HeatMapCell {
  xValue: any;
  yValue: Date | string | number;
  mean: number;
  count: number;
}

export interface HeatMapFilters {
  customTimeRange?: [Date, Date];
  customPriceRange?: [number, number];
  districts: number[];
  priceRange: {
    min: number | null;
    max: number | null;
  };
  viewMode: 'price' | 'transactions';
}
