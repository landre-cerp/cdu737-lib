import { HID } from "node-hid";

export type CDULed = 0b0000000 | 0b0000001 | 0b0000010 | 0b0000100 | 0b0001000 | 0b0010000;

export const LED = {
  OFF: 0b0000000 as CDULed,
  EXEC: 0b0000001 as CDULed,
  MSG: 0b0000010 as CDULed,
  OFST: 0b0000100 as CDULed,
  FAIL: 0b0001000 as CDULed,
  CALL: 0b0010000 as CDULed,
};

export class CDULeds {

  #device: HID;

  #screenBrightness: number = 0x80;
  #keyboardBrightness: number = 0x80;
  #ledStatus: number = LED.OFF;

  #adjustBrightness = (setting: number, value: number) => {
    const newValue = setting + value;

    return Math.min(Math.max(newValue, 0), 0xff);
  };

  #setBrightness = (intensity: number) => {
    if (intensity > 0xFF) {
      intensity = 0xFF;
    } else if (intensity < 0) {
      intensity = 0;
    }

    return intensity;
  };

  constructor(device: HID) {
    if (!device) {
      throw new Error('Device not found.');
    }

    this.#device = device;
  }

  public updateLedsAndBrighness = () => {
    const lastLine = new Uint8Array(64);
    lastLine[0] = 9;
    lastLine[1] = this.#screenBrightness;
    lastLine[2] = this.#keyboardBrightness;
    lastLine[3] = this.#ledStatus;

    this.#device.write([0, ...lastLine]);

  };


  public toggleLed = (led: CDULed) => {
    if (this.#ledStatus & led) {
      this.#ledStatus &= ~led;
    } else {
      this.#ledStatus |= led;
    }
  };

  public setLed = (led: CDULed) => {
    this.#ledStatus |= led;
  };

  public clearLed = (led: CDULed) => {
    this.#ledStatus &= ~led;
  };

  public setLedStatus = (ledStatus: CDULed) => {
    this.#ledStatus = ledStatus;
  };

  public setLedsOff = () => {
    this.setLedStatus(LED.OFF);
  };

  public setScreenBrightness = (intensity: number) => {
    this.#screenBrightness = this.#setBrightness(intensity);
  };

  /**
   * Set the keyboard brightness
   * @param {number} intensity 0-255
   */
  setKeyboardBrightness = (intensity: number) => {
    this.#keyboardBrightness = this.#setBrightness(intensity);
  };

  public increaseScreenBrightness = (value: number) => {
    this.#screenBrightness = this.#adjustBrightness(this.#screenBrightness, value);
  };

  public decreaseScreenBrightness = (value: number) => {
    this.#screenBrightness = this.#adjustBrightness(this.#screenBrightness, -value);
  };

  public increaseKeyboardBrightness = (value: number) => {
    this.#keyboardBrightness = this.#adjustBrightness(this.#keyboardBrightness, value);
  };

  public decreaseKeyboardBrightness = (value: number) => {
    this.#keyboardBrightness = this.#adjustBrightness(this.#keyboardBrightness, -value);
  };
};
