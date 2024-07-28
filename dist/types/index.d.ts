import { Color } from './colors';
import { ErrorHandler, KeyPressHandler } from './keys';
import { CDULeds } from './leds.js';
import { Display } from './display';
import { CduCharMap } from './text';
export { colors } from './colors';
export { cdu_chars, modifiers } from './text';
export type { Color } from './colors';
export type { CduCharMap } from './text';
export type { KeyPresses, KeyPressHandler, ErrorHandler } from './keys';
export { LED } from './leds';
export { Display } from './display';
export { CDULeds } from './leds';
export declare class CDU {
    #private;
    constructor(captain: boolean | undefined, onDataHandler: KeyPressHandler | undefined, onErrorHandler: ErrorHandler | undefined, defaultColor: Color | undefined, charaterMap: CduCharMap);
    getDeviceInfo: () => void;
    getDisplay: () => Display;
    getLeds: () => CDULeds;
    setDisplayRate: (ms: number) => void;
    setLedRate: (ms: number) => void;
    close: () => void;
}
