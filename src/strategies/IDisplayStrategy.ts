export interface IDisplayStrategy {
  renderChar(baseChar: string, hasDot: boolean): HTMLElement;
}
