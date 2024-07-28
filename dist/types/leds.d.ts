import { HID } from "node-hid";
export type CDULed = 0b0000000 | 0b0000001 | 0b0000010 | 0b0000100 | 0b0001000 | 0b0010000;
export declare const LED: {
    OFF: CDULed;
    EXEC: CDULed;
    MSG: CDULed;
    OFST: CDULed;
    FAIL: CDULed;
    CALL: CDULed;
};
export declare class CDULeds {
    #private;
    constructor(device: HID);
    updateLedsAndBrighness: () => void;
    toggleLed: (led: CDULed) => void;
    setLed: (led: CDULed) => void;
    clearLed: (led: CDULed) => void;
    setLedStatus: (ledStatus: CDULed) => void;
    setLedsOff: () => void;
    setScreenBrightness: (intensity: number) => void;
    /**
     * Set the keyboard brightness
     * @param {number} intensity 0-255
     */
    setKeyboardBrightness: (intensity: number) => void;
    increaseScreenBrightness: (value: number) => void;
    decreaseScreenBrightness: (value: number) => void;
    increaseKeyboardBrightness: (value: number) => void;
    decreaseKeyboardBrightness: (value: number) => void;
}
