import { Angle, Dimension } from "./types";

export type Strategy = "7-segment" | "matrix"; // "14-segment"

export interface ICharOptions {
  width?: Dimension;
  height?: Dimension;
  thickness?: Dimension;
  gap?: Dimension;
}

export interface IBoardOptions {
  text: string;
  type?: Strategy;
  colorOn?: string;
  colorOff?: string;
  glow?: boolean;
  skew?: Angle;
  gap?: Dimension;
  char?: ICharOptions;
}
