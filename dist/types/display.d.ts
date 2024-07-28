import { HID } from 'node-hid';
import { Color } from './colors.js';
import { CduCharMap } from './text.js';
export declare class Display {
    #private;
    constructor(device: HID);
    setCharacterMap: (charaterMap: CduCharMap) => void;
    clearScreen: () => void;
    setDefaultColor: (color: Color) => void;
    scrollUp: () => void;
    scrollDown: () => void;
    writeChar: (line: number, col: number, code: number, color: Color | undefined, state: number) => void;
    writeLine: (line: number, col: number, text: string, color: Color, modifiers: number) => void;
    updateScreen: () => void;
}
