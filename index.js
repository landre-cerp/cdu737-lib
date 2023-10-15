import { colors } from './src/colors.js';
import { readKeypress } from './src/keys.js';
import { defaultCharacterMap, Encode2Chars } from './src/text.js';
import {
  DEFAULT_BRIGHTNESS,
  DEFAULT_KEYBOARD_BRIGHTNESS,
  clearScreen,
  decreaseBrightness,
  increaseBrightness,
  setBrightness,
  vScrollDisplayDown,
  vScrollDisplayUp,
  writeChar,
  writeLine,
} from './src/display.js';
import { initDevice } from './src/device.js';
import { leds } from './src/leds.js';

export { leds } from './src/leds.js';
export { colors } from './src/colors.js';
export { cdu_chars, modifiers } from './src/text.js';
export { keys } from './src/keys.js';

export const CDU = (() => {
  // private things
  const _ROWS = 14;
  const _COLUMNS = 24;

  // screen cursor
  let cursor = [0, 0];

  // This is the text buffer
  let _textBuffer = [];

  // LEDS are off by default
  // this is bit mask for the leds
  let _ledStatus = leds.OFF;

  let _screenBrightness = DEFAULT_BRIGHTNESS;
  let _keyboardBrightness = DEFAULT_KEYBOARD_BRIGHTNESS;

  let _displayRefreshRate = 1000; // ms

  let _defaultColor = colors.white;
  let _characterMap = defaultCharacterMap;

  // Find the device
  let _device = initDevice();

  const updateLedsAndBrighness = () => {
    const lastLine = new Uint8Array(64);
    lastLine[0] = 9;
    lastLine[1] = _screenBrightness;
    lastLine[2] = _keyboardBrightness;
    lastLine[3] = _ledStatus;
    _device.write([0, ...lastLine]);
  };

  const updateScreen = () => {
    // Copy lines to ScreenBuffer

    let needbreak = 64;
    let currentHidReport = 1;

    let hidReport = new Uint8Array(64); // not 64 as the 1st is the "report number" (remember needs 8 report for the screen)
    hidReport[0] = currentHidReport;
    let copiedInCurrentBuffer = 1;

    // Scan all the lines,
    for (let line = 0; line < _ROWS; line++) {
      // and all the columns

      for (let i = 0; i < _COLUMNS; i += 2) {
        // we need to encode the _textBuffer so it's understandable by the device.
        // read 2 chars at a time and encode them
        let encoded = Encode2Chars(
          _textBuffer[line][i],
          _textBuffer[line][i + 1]
        );

        hidReport[copiedInCurrentBuffer] = encoded[0];
        hidReport[copiedInCurrentBuffer + 1] = encoded[1];
        hidReport[copiedInCurrentBuffer + 2] = encoded[2];
        copiedInCurrentBuffer += 3;

        if (copiedInCurrentBuffer == needbreak) {
          // send report to device
          // increment report number
          _device.write([0, ...hidReport]);

          hidReport = new Uint8Array(64);
          currentHidReport++;
          hidReport[0] = currentHidReport;
          copiedInCurrentBuffer = 1;
        }
      }
    }
  };

  /**
   * CDU constructor
   * @param {(keypressed : keys[]) => void} onDataHandler handler for keypress
   * @param {(err) => void} onErrorHandler default logs error to console
   * @param {keyof typeof colors} defaultColor the default color of the screen
   * @param {int} ledRefreshRate refresh rate ins ms for the leds update routine
   * @param {int} displayRefreshRate refresh rate in ms for the display update routine
   * @param { { [key: string] : keyof typeof cdu_chars } } charaterMap to add to the default one
   *
   * @returns {CDU} CDU instance
   */
  function CDU(
    onDataHandler = (data) => {},
    onErrorHandler = (err) => console.error('Error:', err),
    defaultColor = colors.white,
    ledRefreshRate = 100,
    displayRefreshRate = 500,
    charaterMap
  ) {
    if (charaterMap) {
      _characterMap = { ...defaultCharacterMap, ...charaterMap };
    }
    _defaultColor = defaultColor;
    _displayRefreshRate = displayRefreshRate;
    clearScreen(_textBuffer, _ROWS, _COLUMNS);

    const displayInterval = setInterval(() => {
      updateScreen();
    }, _displayRefreshRate);

    const ledInterval = setInterval(() => {
      updateLedsAndBrighness();
    }, ledRefreshRate);

    if (onErrorHandler) {
      _device.on('error', onErrorHandler);
    }

    if (onDataHandler) {
      _device.on('data', (data) => {
        // data is the new state of the keys

        onDataHandler(readKeypress(data));
      });
    }

    // public things

    this.getDeviceInfo = () => {
      return _device.getDeviceInfo();
    };

    this.clearScreen = () => {
      cursor = [0, 0];
      clearScreen(_textBuffer, _ROWS, _COLUMNS);
    };

    /**
     * Set the screen brightness
     * @param {int} intensity 0-255
     */
    this.setScreenBrightness = function (intensity) {
      _screenBrightness = setBrightness(intensity);
    };

    /**
     * Set the keyboard brightness
     * @param {int} intensity 0-255
     */
    this.setKeyboardBrightness = function (intensity) {
      _keyboardBrightness = setBrightness(intensity);
    };

    this.increaseScreenBrightness = (value) => {
      _screenBrightness = increaseBrightness(_screenBrightness, value);
    };

    this.decreaseScreenBrightness = (value) => {
      _screenBrightness = decreaseBrightness(_screenBrightness, value);
    };

    this.increaseKeyboardBrightness = (value) => {
      _keyboardBrightness = increaseBrightness(_keyboardBrightness, value);
    };

    this.decreaseKeyboardBrightness = (value) => {
      _keyboardBrightness = decreaseBrightness(_keyboardBrightness, value);
    };

    // Method to write a character with code, color, and state to the buffer at a specified position
    this.writeChar = function (row, col, code, color = _defaultColor, state) {
      writeChar(_textBuffer, _ROWS, _COLUMNS, row, col, code, color, state);
    };

    this.writeLine = function (
      line,
      col,
      text,
      color = _defaultColor,
      modifiers
    ) {
      writeLine(
        _textBuffer,
        _ROWS,
        _COLUMNS,
        _characterMap,
        line,
        col,
        text,
        color,
        modifiers
      );
    };

    this.scrollUp = () => {
      vScrollDisplayUp(_textBuffer, _ROWS);
    };
    this.scrollDown = () => {
      vScrollDisplayDown(_textBuffer, _ROWS);
    };

    // Method to handle Led status
    this.setLed = function (led) {
      _ledStatus |= led;
    };

    this.toggleLed = function (led) {
      _ledStatus ^= led;
    };

    this.resetLeds = function (led) {
      _ledStatus &= ~led;
    };

    this.close = () => {
      clearInterval(displayInterval);
      clearInterval(ledInterval);

      _device.removeAllListeners();

      _device.close();
    };
  }
  return CDU;
})();
