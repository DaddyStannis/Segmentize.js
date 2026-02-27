import type { IBoardOptions } from "../IBoardOptions";
import { SEGMENT_MAP_7 } from "../segment-maps";
import type { IDisplayStrategy } from "./IDisplayStrategy";

export class SevenSegmentDisplay implements IDisplayStrategy {
  private readonly _options: IBoardOptions;

  constructor(options: IBoardOptions) {
    this._options = options;
  }

  renderChar(baseChar: string, hasDot: boolean): HTMLElement {
    const box = document.createElement("div");
    box.className = "seg-char";

    if (baseChar === ":") {
      box.className = "seg-char seg-colon-box";

      for (let i = 0; i < 2; i++) {
        const dotWrapper = document.createElement("div");
        dotWrapper.className = "seg-glow";

        const dot = document.createElement("div");
        dot.className = "seg-segment seg-colon-dot seg-on";

        if (this._options.glow) {
          dotWrapper.style.filter = "var(--seg-glow, none)";
        }

        dotWrapper.appendChild(dot);
        box.appendChild(dotWrapper);
      }
    } else {
      const pattern = SEGMENT_MAP_7[baseChar] || SEGMENT_MAP_7[" "];
      const segmentNames = ["a", "b", "c", "d", "e", "f", "g"];

      for (let i = 0; i < 7; ++i) {
        const wrapper = document.createElement("div");
        wrapper.className = "seg-segment-wrapper";

        const segment = document.createElement("div");
        segment.className = `seg-segment seg-${segmentNames[i]}`;

        wrapper.appendChild(segment);

        if (pattern[i] === 1) {
          segment.classList.add("seg-on");
          wrapper.classList.add("seg-glow");
        }

        box.appendChild(wrapper);
      }

      const dpWrapper = document.createElement("div");
      dpWrapper.className = "seg-glow";

      const dpSegment = document.createElement("div");
      dpSegment.className = "seg-segment seg-dp";

      if (hasDot || baseChar === ".") {
        dpSegment.classList.add("seg-on");
        dpWrapper.style.filter = "var(--seg-glow, none)";
      }

      dpWrapper.appendChild(dpSegment);
      box.appendChild(dpWrapper);
    }

    return box;
  }
}
