# Segmentize.js

A lightweight, framework-agnostic (Vanilla TS) library for creating realistic 7-segment displays.

### ✨ Features

- 📋 **Flawless Copy/Paste:** Text on the board can be highlighted and copied cleanly.
- 💡 **Realistic Neon Glow:** Highly customizable `glow` property that simulates real-world LED or VFD displays with authentic light dispersion (Bloom effect).
- 📐 **Smart Scaling:** All dimensions are based on CSS `em` units. Simply change the `font-size` on the parent container, and the entire board scales proportionally.
- ⏱️ **Hardware Decimal Point Logic:** The decimal point (`.`) is rendered natively as an 8th segment attached to the previous digit, preventing it from taking up a full empty character slot.
- ⚛️ **Framework-agnostic:** Written in pure TypeScript. Extremely easy to wrap into a `<SegmentBoard />` component for React, Vue, Angular, or Svelte.

![Demo 1](/assets/screenshots/localhost.png)

### 🚀 Quick Start

**HTML:**

```html
<div id="neon-board" style="font-size: 16px;"></div>
```

**TypeScript:**

```TypeScript
import { SegmentBoard } from './segmentize';

// 1. Initialize the board
const board = new SegmentBoard('#neon-board', {
  text: "20.26",          // Initial text (supports decimal points)
  type: "7-segment",      // Display type
  colorOn: "#00ff00",     // Color of active segments (neon)
  colorOff: "#1a1a1a",    // Color of inactive segments
  glow: 1.5,              // Glow intensity multiplier
  skew: -10,              // Italic effect in degrees
  gap: 0.5,               // Gap between characters (in em)
  char: {
    width: 2.5,           // Width of a single character (in em)
    height: 4.5,          // Height of a single character (in em)
    thickness: 0.5,       // Thickness of the segment
    gap: 0.1              // Gap between segments inside a character
  }
});
```
