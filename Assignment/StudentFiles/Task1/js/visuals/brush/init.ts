import * as d3 from 'd3';
import { PriceBrush as NumberBrush } from "./num";
import { TimeBrush } from "./time";
import { DataManager, RangeableKeys } from '../../data';
import { ChartConfig } from '../base';

export function NewTimeBrush(
  data: DataManager,
  selector: string,
  config: ChartConfig,
  key: RangeableKeys,
  onBrush: (range: [Date, Date]) => void
): TimeBrush {
  if (!data.isDateKey(key)) { throw new Error("non-date key used in NewTimeBrush") }
  const timeBrushConfig = {
    container: selector,
    extent: data.getExtent(key) as [Date, Date],
    height: config.height,
    width: config.width - config.margin.left - config.margin.right,
    margin: config.margin,
    tickFormat: (d: d3.NumberValue) => {
      const date = new Date(d.valueOf());
      return d3.timeFormat('%b %Y')(date);
    },
    onBrush: onBrush,
  };

  return new TimeBrush(timeBrushConfig);
}

export function NewNumberBrush(
  data: DataManager,
  selector: string,
  config: ChartConfig,
  key: RangeableKeys,
  onBrush: (range: [number, number]) => void
): NumberBrush {
  if (data.isDateKey(key)) { throw new Error("date key used in NewNumberBrush") }
  const priceBrushConfig = {
    container: selector,
    extent: data.getExtent(key) as [number, number],
    height: config.height,
    width: config.width - config.margin.left - config.margin.right,
    margin: config.margin,
    tickFormat: (d: d3.NumberValue) => `$${d3.format(",.0f")(d)}`,
    onBrush: onBrush,
  };

  return new NumberBrush(priceBrushConfig);
}
