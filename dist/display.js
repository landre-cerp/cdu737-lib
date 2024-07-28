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
var _Display_ROWS, _Display_COLUMNS, _Display_textBuffer, _Display_characterMap, _Display_defaultColor, _Display_device, _Display_Encode2Chars;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Display = void 0;
const colors_js_1 = require("./colors.js");
const text_js_1 = require("./text.js");
;
class Display {
    constructor(device) {
        _Display_ROWS.set(this, void 0);
        _Display_COLUMNS.set(this, void 0);
        _Display_textBuffer.set(this, void 0);
        _Display_characterMap.set(this, text_js_1.defaultCharacterMap);
        _Display_defaultColor.set(this, colors_js_1.colors.white);
        _Display_device.set(this, void 0);
        _Display_Encode2Chars.set(this, (char1, char2) => {
            // encode 2 consecutive chars
            // respecting the HIDreport structure
            // Simply put two consecutive chars are encoded that way.
            // Assume they both are 0x47 0x47  (which is a dash '-')
            // red is 0x03 green is 0x02
            //  => 0x47 0x7(seven of the 0x47 second char)(col1=3) 0x(col2=2)4(four of the 47 2nd char)
            // method returns => 0x47 0x73 0x24
            let encoded = new Uint8Array(3);
            encoded[0] = char1.code;
            encoded[1] = (char2.code << 4) | char1.color;
            encoded[2] = (char2.code >> 4) | (char2.color << 4);
            return encoded;
        });
        this.setCharacterMap = (charaterMap) => {
            if (charaterMap) {
                __classPrivateFieldSet(this, _Display_characterMap, Object.assign(Object.assign({}, text_js_1.defaultCharacterMap), charaterMap), "f");
            }
        };
        this.clearScreen = () => {
            for (let i = 0; i < __classPrivateFieldGet(this, _Display_ROWS, "f"); i++) {
                let row = [];
                for (let j = 0; j < __classPrivateFieldGet(this, _Display_COLUMNS, "f"); j++) {
                    row.push({
                        code: text_js_1.cdu_chars.Space, // Default to space character
                        color: colors_js_1.colors.white, // Default color
                    });
                }
                __classPrivateFieldGet(this, _Display_textBuffer, "f").push(row);
            }
        };
        this.setDefaultColor = (color) => {
            __classPrivateFieldSet(this, _Display_defaultColor, color, "f");
        };
        this.scrollUp = () => {
            let oldFirstLine = __classPrivateFieldGet(this, _Display_textBuffer, "f")[0];
            for (let i = 0; i < __classPrivateFieldGet(this, _Display_ROWS, "f") - 1; i++) {
                __classPrivateFieldGet(this, _Display_textBuffer, "f")[i] = __classPrivateFieldGet(this, _Display_textBuffer, "f")[i + 1];
            }
            // Clear last line
            __classPrivateFieldGet(this, _Display_textBuffer, "f")[__classPrivateFieldGet(this, _Display_ROWS, "f") - 1] = oldFirstLine;
        };
        this.scrollDown = () => {
            let oldLastLine = __classPrivateFieldGet(this, _Display_textBuffer, "f")[__classPrivateFieldGet(this, _Display_ROWS, "f") - 1];
            for (let i = __classPrivateFieldGet(this, _Display_ROWS, "f") - 1; i > 0; i--) {
                __classPrivateFieldGet(this, _Display_textBuffer, "f")[i] = __classPrivateFieldGet(this, _Display_textBuffer, "f")[i - 1];
            }
            // Clear first line
            __classPrivateFieldGet(this, _Display_textBuffer, "f")[0] = oldLastLine;
        };
        this.writeChar = (line, col, code, color = __classPrivateFieldGet(this, _Display_defaultColor, "f"), state) => {
            let value = code | state;
            if (line >= 0 && line < __classPrivateFieldGet(this, _Display_ROWS, "f") && col >= 0 && col < __classPrivateFieldGet(this, _Display_COLUMNS, "f")) {
                __classPrivateFieldGet(this, _Display_textBuffer, "f")[line][col] = {
                    code: value,
                    color: color,
                };
            }
        };
        this.writeLine = (line, col, text, color, modifiers) => {
            if (text.length > __classPrivateFieldGet(this, _Display_COLUMNS, "f")) {
                throw new Error(`${text} is too long`);
            }
            const chars = (0, text_js_1.map_chars)(text, __classPrivateFieldGet(this, _Display_characterMap, "f"));
            for (let i = 0; i < chars.length; i++) {
                this.writeChar(line, col + i, chars[i], color, modifiers);
            }
        };
        this.updateScreen = () => {
            // Copy lines to ScreenBuffer
            let needbreak = 64;
            let currentHidReport = 1;
            let hidReport = new Uint8Array(64); // not 64 as the 1st is the "report number" (remember needs 8 report for the screen)
            hidReport[0] = currentHidReport;
            let copiedInCurrentBuffer = 1;
            // Scan all the lines,
            for (let line = 0; line < __classPrivateFieldGet(this, _Display_ROWS, "f"); line++) {
                // and all the columns
                for (let i = 0; i < __classPrivateFieldGet(this, _Display_COLUMNS, "f"); i += 2) {
                    // we need to encode the _textBuffer so it's understandable by the device.
                    // read 2 chars at a time and encode them
                    let encoded = __classPrivateFieldGet(this, _Display_Encode2Chars, "f").call(this, __classPrivateFieldGet(this, _Display_textBuffer, "f")[line][i], __classPrivateFieldGet(this, _Display_textBuffer, "f")[line][i + 1]);
                    hidReport[copiedInCurrentBuffer] = encoded[0];
                    hidReport[copiedInCurrentBuffer + 1] = encoded[1];
                    hidReport[copiedInCurrentBuffer + 2] = encoded[2];
                    copiedInCurrentBuffer += 3;
                    if (copiedInCurrentBuffer == needbreak) {
                        // send report to device
                        // increment report number
                        __classPrivateFieldGet(this, _Display_device, "f").write([0, ...hidReport]);
                        hidReport = new Uint8Array(64);
                        currentHidReport++;
                        hidReport[0] = currentHidReport;
                        copiedInCurrentBuffer = 1;
                    }
                }
            }
        };
        __classPrivateFieldSet(this, _Display_device, device, "f");
        __classPrivateFieldSet(this, _Display_ROWS, 14, "f");
        __classPrivateFieldSet(this, _Display_COLUMNS, 24, "f");
        __classPrivateFieldSet(this, _Display_textBuffer, Array.from({ length: __classPrivateFieldGet(this, _Display_ROWS, "f") }, () => Array(__classPrivateFieldGet(this, _Display_COLUMNS, "f")).fill({ code: 0, color: __classPrivateFieldGet(this, _Display_defaultColor, "f") })), "f");
    }
}
exports.Display = Display;
_Display_ROWS = new WeakMap(), _Display_COLUMNS = new WeakMap(), _Display_textBuffer = new WeakMap(), _Display_characterMap = new WeakMap(), _Display_defaultColor = new WeakMap(), _Display_device = new WeakMap(), _Display_Encode2Chars = new WeakMap();
;
