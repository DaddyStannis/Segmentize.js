import type { IBoardOptions, ICharOptions, Strategy } from "./IBoardOptions";
import {
  type IDisplayStrategy,
  Matrix5x7Strategy,
  SevenSegmentStrategy,
} from "./strategies";
import "./styles.css";
import { ang2str, dim2str, getPerfectChar } from "./utils";

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

    const perfectChar = getPerfectChar(
      options.type || "7-segment",
      options.size,
    );

    this._options = {
      text: options.text || "",
      type: options.type || "7-segment",
      colorOn: options.colorOn || "#ff2a00",
      colorOff: options.colorOff || "#632217",
      glow: options.glow ?? true,
      skew: options.skew || 0,
      gap: options.gap || 1,
      size: options.size || 1,
      char: {
        width: options.char?.width || perfectChar.width,
        height: options.char?.height || perfectChar.height,
        thickness: options.char?.thickness || perfectChar.thickness,
        gap: options.char?.gap || perfectChar.gap,
      },
    };

    this.setupStyles();

    this._strategies = {
      "7-segment": new SevenSegmentStrategy(this._options),
      matrix: new Matrix5x7Strategy(this._options),
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
    this._root.classList.add(`seg-${this._options.type}`);
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

      if (char[0] === ":" && this._options.type !== "matrix") {
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
