export type Key = {
    group: number;
    bit: number;
    label: string;
};
export type KeyPressHandler = (keyPressed: KeyPresses) => void;
export type ErrorHandler = (err: Error) => void;
export declare const cduKeys: {
    [key: string]: Key;
};
export type KeyBit = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128;
export type KeyPress = {
    key: Key;
    group: number;
    bit: KeyBit;
};
export type KeyPresses = Key[];
export type usbRead = number[];
export declare const readKeypress: (data: usbRead) => KeyPresses;
