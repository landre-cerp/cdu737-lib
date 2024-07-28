import { Color, colors } from './colors';
import { KeyPresses, readKeypress, usbRead } from './keys';
import { initDevice, PIDS } from './device';
import { CDULeds } from './leds.js';
import { Display } from './display';
import { CduCharMap } from './text';
import { HID } from 'node-hid';


export { colors } from './colors';
export { cdu_chars, modifiers } from './text';
export type { Color } from './colors';
export type { CduCharMap } from './text';
export type { KeyPresses } from './keys';
export { LED } from './leds';
export { Display } from './display';
export { CDULeds } from './leds';



export type KeyPressHandler = (keyPressed: KeyPresses) => void;
export type ErrorHandler = (err: Error) => void;

export class CDU {

  #display: Display;
  #cduLeds: CDULeds;

  #displayInterval: NodeJS.Timeout;
  #ledInterval: NodeJS.Timeout;

  #onDataHandler: (keyPressed: KeyPresses) => void;

  #device: HID | null;

  constructor(
    captain = true,
    onDataHandler: KeyPressHandler = () => { },
    onErrorHandler: ErrorHandler = (err: Error) => console.error('Error:', err),
    defaultColor: Color = colors.white,
    charaterMap: CduCharMap
  ) {
    // Find the device
    this.#device = initDevice(captain ? PIDS.captain : PIDS.copilot);

    if (!this.#device) {
      throw new Error('Device not found.');
    }

    this.#display = new Display(this.#device);
    this.#cduLeds = new CDULeds(this.#device);

    this.#display.setCharacterMap(charaterMap);
    this.#display.setDefaultColor(defaultColor);
    this.#display.clearScreen();

    // set the default refresh rate to 250 ms
    this.#displayInterval = setInterval(() => {
      this.#display.updateScreen();
    }, 250);

    // set the default refresh rate to 100 ms
    this.#ledInterval = setInterval(() => {
      this.#cduLeds.updateLedsAndBrighness();
    }, 100);

    this.#device.on('error', onErrorHandler);
    this.#onDataHandler = onDataHandler;
    this.#device!.on('data', (data: usbRead) => {
      // data is the new state of the keys

      this.#onDataHandler(readKeypress(data));
    });

  }

  public getDeviceInfo = () => {
    (this.#device as any).getDeviceInfo();
  }


  public getDisplay = () => this.#display;
  public getLeds = () => this.#cduLeds;

  public setDisplayRate = (ms: number) => {
    clearInterval(this.#displayInterval);
    this.#displayInterval = setInterval(() => {
      this.#display.updateScreen();
    }, ms);
  };


  public setLedRate = (ms: number) => {
    clearInterval(this.#ledInterval);
    this.#ledInterval = setInterval(() => {
      this.#cduLeds.updateLedsAndBrighness();
    }, ms);
  };

  public close = () => {
    clearInterval(this.#displayInterval);
    clearInterval(this.#ledInterval);

    this.#device!.removeAllListeners();

    this.#device!.close();
  };
};
