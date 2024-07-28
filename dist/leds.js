"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _CDULeds_device, _CDULeds_screenBrightness, _CDULeds_keyboardBrightness, _CDULeds_ledStatus, _CDULeds_adjustBrightness, _CDULeds_setBrightness;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CDULeds = exports.LED = void 0;
exports.LED = {
    OFF: 0b0000000,
    EXEC: 0b0000001,
    MSG: 0b0000010,
    OFST: 0b0000100,
    FAIL: 0b0001000,
    CALL: 0b0010000,
};
class CDULeds {
    constructor(device) {
        _CDULeds_device.set(this, void 0);
        _CDULeds_screenBrightness.set(this, 0x80);
        _CDULeds_keyboardBrightness.set(this, 0x80);
        _CDULeds_ledStatus.set(this, exports.LED.OFF);
        _CDULeds_adjustBrightness.set(this, (setting, value) => {
            const newValue = setting + value;
            return Math.min(Math.max(newValue, 0), 0xff);
        });
        _CDULeds_setBrightness.set(this, (intensity) => {
            if (intensity > 0xFF) {
                intensity = 0xFF;
            }
            else if (intensity < 0) {
                intensity = 0;
            }
            return intensity;
        });
        this.updateLedsAndBrighness = () => {
            const lastLine = new Uint8Array(64);
            lastLine[0] = 9;
            lastLine[1] = __classPrivateFieldGet(this, _CDULeds_screenBrightness, "f");
            lastLine[2] = __classPrivateFieldGet(this, _CDULeds_keyboardBrightness, "f");
            lastLine[3] = __classPrivateFieldGet(this, _CDULeds_ledStatus, "f");
            __classPrivateFieldGet(this, _CDULeds_device, "f").write([0, ...lastLine]);
        };
        this.toggleLed = (led) => {
            if (__classPrivateFieldGet(this, _CDULeds_ledStatus, "f") & led) {
                __classPrivateFieldSet(this, _CDULeds_ledStatus, __classPrivateFieldGet(this, _CDULeds_ledStatus, "f") & ~led, "f");
            }
            else {
                __classPrivateFieldSet(this, _CDULeds_ledStatus, __classPrivateFieldGet(this, _CDULeds_ledStatus, "f") | led, "f");
            }
        };
        this.setLed = (led) => {
            __classPrivateFieldSet(this, _CDULeds_ledStatus, __classPrivateFieldGet(this, _CDULeds_ledStatus, "f") | led, "f");
        };
        this.clearLed = (led) => {
            __classPrivateFieldSet(this, _CDULeds_ledStatus, __classPrivateFieldGet(this, _CDULeds_ledStatus, "f") & ~led, "f");
        };
        this.setLedStatus = (ledStatus) => {
            __classPrivateFieldSet(this, _CDULeds_ledStatus, ledStatus, "f");
        };
        this.setLedsOff = () => {
            this.setLedStatus(exports.LED.OFF);
        };
        this.setScreenBrightness = (intensity) => {
            __classPrivateFieldSet(this, _CDULeds_screenBrightness, __classPrivateFieldGet(this, _CDULeds_setBrightness, "f").call(this, intensity), "f");
        };
        /**
         * Set the keyboard brightness
         * @param {number} intensity 0-255
         */
        this.setKeyboardBrightness = (intensity) => {
            __classPrivateFieldSet(this, _CDULeds_keyboardBrightness, __classPrivateFieldGet(this, _CDULeds_setBrightness, "f").call(this, intensity), "f");
        };
        this.increaseScreenBrightness = (value) => {
            __classPrivateFieldSet(this, _CDULeds_screenBrightness, __classPrivateFieldGet(this, _CDULeds_adjustBrightness, "f").call(this, __classPrivateFieldGet(this, _CDULeds_screenBrightness, "f"), value), "f");
        };
        this.decreaseScreenBrightness = (value) => {
            __classPrivateFieldSet(this, _CDULeds_screenBrightness, __classPrivateFieldGet(this, _CDULeds_adjustBrightness, "f").call(this, __classPrivateFieldGet(this, _CDULeds_screenBrightness, "f"), -value), "f");
        };
        this.increaseKeyboardBrightness = (value) => {
            __classPrivateFieldSet(this, _CDULeds_keyboardBrightness, __classPrivateFieldGet(this, _CDULeds_adjustBrightness, "f").call(this, __classPrivateFieldGet(this, _CDULeds_keyboardBrightness, "f"), value), "f");
        };
        this.decreaseKeyboardBrightness = (value) => {
            __classPrivateFieldSet(this, _CDULeds_keyboardBrightness, __classPrivateFieldGet(this, _CDULeds_adjustBrightness, "f").call(this, __classPrivateFieldGet(this, _CDULeds_keyboardBrightness, "f"), -value), "f");
        };
        if (!device) {
            throw new Error('Device not found.');
        }
        __classPrivateFieldSet(this, _CDULeds_device, device, "f");
    }
}
exports.CDULeds = CDULeds;
_CDULeds_device = new WeakMap(), _CDULeds_screenBrightness = new WeakMap(), _CDULeds_keyboardBrightness = new WeakMap(), _CDULeds_ledStatus = new WeakMap(), _CDULeds_adjustBrightness = new WeakMap(), _CDULeds_setBrightness = new WeakMap();
;
