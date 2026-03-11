export type DashboardLayoutItem = {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  maxW?: number;
  minH?: number;
  maxH?: number;
  static?: boolean;
};

export type DashboardBreakpointLayouts = {
  lg?: DashboardLayoutItem[];
  md?: DashboardLayoutItem[];
  sm?: DashboardLayoutItem[];
  xs?: DashboardLayoutItem[];
  xxs?: DashboardLayoutItem[];
};