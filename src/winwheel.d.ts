declare module 'winwheel' {
  export default class Winwheel {
    constructor(options: any);
    startAnimation(): void;
    stopAnimation(stopImmediately: boolean): void;
    draw(): void;
    rotationAngle: number;
  }
}