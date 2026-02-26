import type { IBoardOptions } from "../IBoardOptions";
import type { IDisplayStrategy } from "./IDisplayStrategy";

export class MatrixStrategy implements IDisplayStrategy {
  renderChar(baseChar: string, hasDot: boolean): HTMLElement {
    return document.createElement("div");
  }
}
