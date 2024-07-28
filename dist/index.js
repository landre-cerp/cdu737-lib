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
var _CDU_display, _CDU_cduLeds, _CDU_displayInterval, _CDU_ledInterval, _CDU_onDataHandler, _CDU_device;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CDU = exports.CDULeds = exports.Display = exports.LED = exports.modifiers = exports.cdu_chars = exports.colors = void 0;
const colors_1 = require("./colors");
const keys_1 = require("./keys");
const device_1 = require("./device");
const leds_js_1 = require("./leds.js");
const display_1 = require("./display");
var colors_2 = require("./colors");
Object.defineProperty(exports, "colors", { enumerable: true, get: function () { return colors_2.colors; } });
var text_1 = require("./text");
Object.defineProperty(exports, "cdu_chars", { enumerable: true, get: function () { return text_1.cdu_chars; } });
Object.defineProperty(exports, "modifiers", { enumerable: true, get: function () { return text_1.modifiers; } });
var leds_1 = require("./leds");
Object.defineProperty(exports, "LED", { enumerable: true, get: function () { return leds_1.LED; } });
var display_2 = require("./display");
Object.defineProperty(exports, "Display", { enumerable: true, get: function () { return display_2.Display; } });
var leds_2 = require("./leds");
Object.defineProperty(exports, "CDULeds", { enumerable: true, get: function () { return leds_2.CDULeds; } });
class CDU {
    constructor(captain = true, onDataHandler = () => { }, onErrorHandler = (err) => console.error('Error:', err), defaultColor = colors_1.colors.white, charaterMap) {
        _CDU_display.set(this, void 0);
        _CDU_cduLeds.set(this, void 0);
        _CDU_displayInterval.set(this, void 0);
        _CDU_ledInterval.set(this, void 0);
        _CDU_onDataHandler.set(this, void 0);
        _CDU_device.set(this, void 0);
        this.getDeviceInfo = () => {
            __classPrivateFieldGet(this, _CDU_device, "f").getDeviceInfo();
        };
        this.getDisplay = () => __classPrivateFieldGet(this, _CDU_display, "f");
        this.getLeds = () => __classPrivateFieldGet(this, _CDU_cduLeds, "f");
        this.setDisplayRate = (ms) => {
            clearInterval(__classPrivateFieldGet(this, _CDU_displayInterval, "f"));
            __classPrivateFieldSet(this, _CDU_displayInterval, setInterval(() => {
                __classPrivateFieldGet(this, _CDU_display, "f").updateScreen();
            }, ms), "f");
        };
        this.setLedRate = (ms) => {
            clearInterval(__classPrivateFieldGet(this, _CDU_ledInterval, "f"));
            __classPrivateFieldSet(this, _CDU_ledInterval, setInterval(() => {
                __classPrivateFieldGet(this, _CDU_cduLeds, "f").updateLedsAndBrighness();
            }, ms), "f");
        };
        this.close = () => {
            clearInterval(__classPrivateFieldGet(this, _CDU_displayInterval, "f"));
            clearInterval(__classPrivateFieldGet(this, _CDU_ledInterval, "f"));
            __classPrivateFieldGet(this, _CDU_device, "f").removeAllListeners();
            __classPrivateFieldGet(this, _CDU_device, "f").close();
        };
        // Find the device
        __classPrivateFieldSet(this, _CDU_device, (0, device_1.initDevice)(captain ? device_1.PIDS.captain : device_1.PIDS.copilot), "f");
        if (!__classPrivateFieldGet(this, _CDU_device, "f")) {
            throw new Error('Device not found.');
        }
        __classPrivateFieldSet(this, _CDU_display, new display_1.Display(__classPrivateFieldGet(this, _CDU_device, "f")), "f");
        __classPrivateFieldSet(this, _CDU_cduLeds, new leds_js_1.CDULeds(__classPrivateFieldGet(this, _CDU_device, "f")), "f");
        __classPrivateFieldGet(this, _CDU_display, "f").setCharacterMap(charaterMap);
        __classPrivateFieldGet(this, _CDU_display, "f").setDefaultColor(defaultColor);
        __classPrivateFieldGet(this, _CDU_display, "f").clearScreen();
        // set the default refresh rate to 250 ms
        __classPrivateFieldSet(this, _CDU_displayInterval, setInterval(() => {
            __classPrivateFieldGet(this, _CDU_display, "f").updateScreen();
        }, 250), "f");
        // set the default refresh rate to 100 ms
        __classPrivateFieldSet(this, _CDU_ledInterval, setInterval(() => {
            __classPrivateFieldGet(this, _CDU_cduLeds, "f").updateLedsAndBrighness();
        }, 100), "f");
        __classPrivateFieldGet(this, _CDU_device, "f").on('error', onErrorHandler);
        __classPrivateFieldSet(this, _CDU_onDataHandler, onDataHandler, "f");
        __classPrivateFieldGet(this, _CDU_device, "f").on('data', (data) => {
            // data is the new state of the keys
            __classPrivateFieldGet(this, _CDU_onDataHandler, "f").call(this, (0, keys_1.readKeypress)(data));
        });
    }
}
exports.CDU = CDU;
_CDU_display = new WeakMap(), _CDU_cduLeds = new WeakMap(), _CDU_displayInterval = new WeakMap(), _CDU_ledInterval = new WeakMap(), _CDU_onDataHandler = new WeakMap(), _CDU_device = new WeakMap();
;
