import { SEGMENT_MAP_7 } from "./segment-maps";
import type { Angle, Dimension } from "./types";
import type { IBoardOptions, ICharOptions, Strategy } from "./IBoardOptions";
import "./styles.css";
import { MatrixStrategy, SevenSegmentStrategy } from "./strategies";
import { IDisplayStrategy } from "./strategies/IDisplayStrategy";

const DEFAULT_DIMENSION = "em";
const DEFAULT_ANGLE = "deg";

function dim2str(dim: Dimension): string {
  return typeof dim === "string" ? dim : `${dim}${DEFAULT_DIMENSION}`;
}

function ang2str(ang: Angle): string {
  return typeof ang === "string" ? ang : `${ang}${DEFAULT_ANGLE}`;
}

export class SegmentBoard {
  private _root: HTMLElement;
  private _options: Required<IBoardOptions> & { char: Required<ICharOptions> };
  private _strategies: Record<Strategy, IDisplayStrategy>;

  constructor(selector: string | HTMLElement, options: IBoardOptions) {
    let el: HTMLElement | null = null;

    if (typeof selector === "string") {
      el = document.querySelector(selector) as HTMLElement | null;
    } else if (selector instanceof HTMLElement) {
      el = selector;
    }

    if (!el) {
      const id =
        typeof selector === "string" ? selector : "provided by HTMLElement";
      throw new Error(
        `[segmentize.js] Container "${id}" not found or incorrect type provided.`,
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
      gap: options.gap || 1,
      char: {
        width: options.char?.width || 2,
        height: options.char?.height || 4,
        thickness: options.char?.thickness || 0.3,
        gap: options.char?.gap || 0.15,
      },
    };

    this.setupStyles();

    this._strategies = {
      "7-segment": new SevenSegmentStrategy(this._options),
      matrix: new MatrixStrategy(),
    };

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
    const strategy = this._strategies[this._options.type];

    if (!strategy) {
      throw new Error("[segmentize.js] Invalid display type specified.");
    }

    const chars = this.splitText();

    // Hidden text
    const textLayer = document.createElement("div");
    textLayer.className = "seg-text-layer";

    chars.forEach((char) => {
      const wrapper = document.createElement("div");
      wrapper.className = "seg-text-wrapper";

      if (char[0] === ":") {
        wrapper.classList.add("seg-text-wrapper-colon");
      }

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
      const baseChar = char[0];
      const hasDot = char.includes(".");

      const box = strategy.renderChar(baseChar, hasDot);

      visualLayer.appendChild(box);
    });

    this._root.appendChild(visualLayer);
  }

  private splitText(): string[] {
    const rawChars = this._options.text.split("");

    const chars: string[] = [];
    for (let i = 0; i < rawChars.length; ++i) {
      const char = rawChars[i];

      if (char === "." && i > 0 && !chars[chars.length - 1].includes(".")) {
        chars[chars.length - 1] += ".";
      } else {
        chars.push(char);
      }
    }

    return chars;
  }
}
