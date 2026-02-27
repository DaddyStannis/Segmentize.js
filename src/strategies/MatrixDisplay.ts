import type { IBoardOptions } from "../IBoardOptions";
import type { IDisplayStrategy } from "./IDisplayStrategy";
import { SEGMENT_MAP_MATRIX_5X7 } from "../segment-maps";

export class MatrixDisplay implements IDisplayStrategy {
  private readonly _options: IBoardOptions;

  constructor(options: IBoardOptions) {
    this._options = options;
  }

  renderChar(baseChar: string, hasDot: boolean): HTMLElement {
    const box = document.createElement("div");
    box.className = "seg-char seg-matrix-box";
    const pattern =
      SEGMENT_MAP_MATRIX_5X7[baseChar] || SEGMENT_MAP_MATRIX_5X7[" "];

    for (let i = 0; i < 35; i++) {
      const wrapper = document.createElement("div");
      wrapper.className = "seg-matrix-dot-wrapper";

      const dot = document.createElement("div");
      dot.className = "seg-matrix-dot";

      if (pattern[i] === 1) {
        dot.classList.add("seg-on");
        wrapper.classList.add("seg-glow");
        if (this._options.glow) {
          wrapper.style.filter = "var(--seg-glow, none)";
        }
      }

      wrapper.appendChild(dot);
      box.appendChild(wrapper);
    }

    const dpWrapper = document.createElement("div");
    dpWrapper.className = "seg-glow";

    const dpSegment = document.createElement("div");
    dpSegment.className = "seg-segment seg-dp";

    if (hasDot || baseChar === ".") {
      dpSegment.classList.add("seg-on");
      if (this._options.glow) dpWrapper.style.filter = "var(--seg-glow, none)";
    }

    dpWrapper.appendChild(dpSegment);
    box.appendChild(dpWrapper);

    return box;
  }
}
