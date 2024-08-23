// report.models.ts
import { ChartType } from 'chart.js';  // Import ChartType

export interface Workspace {
  name: string;
  boards: Board[];
}

export interface Board {
  name: string;
  charts: any[];
  widgets: Array<{ chartType: ChartType, dataType: DataType }>;
}


export type DataType = 'longestTask' | 'mostFrequent' | 'leastFrequent';
