import { SEGMENT_MAP_7 } from "./segment-maps";
import "./styles.css";

export type Dimension =
  | number
  | `${number}em`
  | `${number}rem`
  | `${number}px`
  | `${number}%`;

export type Angle = number | `${number}deg`;

export interface ICharOptions {
  width?: Dimension;
  height?: Dimension;
  thickness?: Dimension;
  gap?: Dimension;
}

export interface IBoardOptions {
  text: string;
  type?: "7-segment" | "14-segment" | "matrix";
  colorOn?: string;
  colorOff?: string;
  glow?: boolean;
  skew?: Angle;
  char?: ICharOptions;
  gap?: Dimension;
}

export const defaultDimension = "em";
export const defaultAngle = "deg";

function dim2str(dim: Dimension): string {
  return typeof dim === "string" ? dim : `${dim}${defaultDimension}`;
}

function ang2str(ang: Angle): string {
  return typeof ang === "string" ? ang : `${ang}${defaultAngle}`;
}

export class SegmentBoard {
  private _root: HTMLElement;
  private _options: Required<IBoardOptions> & { char: Required<ICharOptions> };

  constructor(selector: string | HTMLElement, options: IBoardOptions) {
    let el: HTMLElement | null = null;

    if (typeof selector === "string") {
      el = document.querySelector(selector) as HTMLElement | null;
    } else if (selector instanceof HTMLElement) {
      el = selector;
    }

    if (!el) {
      const identifier =
        typeof selector === "string" ? selector : "provided by HTMLElement";
      throw new Error(
        `[segmentize.js] Container "${identifier}" not found or incorrect type provided.`,
      );
    }

    this._root = el;

    this._options = {
      text: options.text || "",
      type: options.type || "7-segment",
      colorOn: options.colorOn || "#00ff00",
      colorOff: options.colorOff || "#1a1a1a",
      glow: options.glow ?? true,
      skew: options.skew || 0,
      gap: options.gap || 2,
      char: {
        width: options.char?.width || 2,
        height: options.char?.height || 4,
        thickness: options.char?.thickness || 0.3,
        gap: options.char?.gap || 0.15,
      },
    };

    this.setupStyles();

    this.render();
  }

  private setupStyles() {
    // Setup CSS properties
    this._root.style.setProperty("--seg-on", this._options.colorOn);
    this._root.style.setProperty("--seg-off", this._options.colorOff);
    this._root.style.setProperty("--seg-skew", ang2str(this._options.skew));
    this._root.style.setProperty("--seg-gap", dim2str(this._options.gap));
    this._root.style.setProperty(
      "--seg-char-gap",
      dim2str(this._options.char.gap),
    );
    this._root.style.setProperty(
      "--seg-char-w",
      dim2str(this._options.char.width),
    );
    this._root.style.setProperty(
      "--seg-char-h",
      dim2str(this._options.char.height),
    );
    this._root.style.setProperty(
      "--seg-char-t",
      dim2str(this._options.char.thickness),
    );

    // Setup glow
    const glowFilter = this._options.glow
      ? `drop-shadow(0 0 5px ${this._options.colorOn})`
      : "none";
    this._root.style.setProperty("--seg-glow", glowFilter);

    // Basic styles
    this._root.classList.add("seg-root");
  }

  public setText(text: string) {
    this._options.text = text;
    this.render();
  }

  private render() {
    this._root.innerHTML = "";

    const chars = this._options.text.split("");

    // Hidden text
    const textLayer = document.createElement("div");
    textLayer.className = "seg-text-layer";

    chars.forEach((char) => {
      const wrapper = document.createElement("div");
      wrapper.className = "seg-text-wrapper";
      const span = document.createElement("span");
      wrapper.appendChild(span);
      span.textContent = char;
      textLayer.appendChild(wrapper);
    });

    this._root.appendChild(textLayer);

    // Visual segments
    const visualLayer = document.createElement("div");
    visualLayer.className = "seg-visual-layer";

    chars.forEach((char) => {
      const box = document.createElement("div");
      box.className = "seg-char";

      if (this._options.type === "7-segment") {
        const baseChar = char[0];
        const hasDot = char.includes(".");

        const pattern = SEGMENT_MAP_7[char] || SEGMENT_MAP_7[" "];
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
      }

      visualLayer.appendChild(box);
    });

    this._root.appendChild(visualLayer);
  }
}
