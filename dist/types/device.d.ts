import { HID } from 'node-hid';
export declare const VID = 1155;
type PID = {
    captain: number;
    copilot: number;
};
export declare const PIDS: PID;
export declare const initDevice: (PID: number) => HID | null;
export {};
