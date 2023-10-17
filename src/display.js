import { colors } from './colors.js';
import {
  cdu_chars,
  map_chars,
  defaultCharacterMap,
  Encode2Chars,
} from './text.js';

export const Display = (() => {
  const ROWS = 14;
  const COLUMNS = 24;

  let textBuffer = [];
  let _characterMap = defaultCharacterMap;
  let _defaultColor = colors.white;

  class Display {
    constructor(device) {
      this.device = device;
    }

    setCharacterMap = (charaterMap) => {
      if (charaterMap) {
        _characterMap = { ...defaultCharacterMap, ...charaterMap };
      }
    };

    clearScreen = () => {
      for (let i = 0; i < ROWS; i++) {
        let row = [];
        for (let j = 0; j < COLUMNS; j++) {
          row.push({
            code: cdu_chars.Space, // Default to space character
            color: colors.white, // Default color
          });
        }
        textBuffer.push(row);
      }
    };

    setDefaultColor = (color) => {
      _defaultColor = color;
    };

    scrollUp = () => {
      let oldFirstLine = textBuffer[0];
      for (let i = 0; i < ROWS - 1; i++) {
        textBuffer[i] = textBuffer[i + 1];
      }
      // Clear last line
      textBuffer[ROWS - 1] = oldFirstLine;
    };

    scrollDown = () => {
      let oldLastLine = textBuffer[ROWS - 1];
      for (let i = ROWS - 1; i > 0; i--) {
        textBuffer[i] = textBuffer[i - 1];
      }
      // Clear first line
      textBuffer[0] = oldLastLine;
    };

    /**
     * Writes a character to the buffer at a specified position
     * the char is Not mapped
     *
     * @param {int} row (0-13)
     * @param {int} col (0-23)
     * @param {number} code Unsigned 8-bit integer
     * @param {keyof typeof colors} color
     * @param {keyof typeof modifiers} state
     *
     * @example writeChar(6, 10, cdu_char.UpArrow , colors.blue, modifiers.big);
     * @example writeChar(6, 11, 0x47, colors.yellow, modifiers.inverted);
     * @example writeChar(6, 12, cdu_char.DownArrow, colors.red, modifiers.inverted | modifiers.big);
     */

    writeChar = (line, col, code, color = _defaultColor, state) => {
      let value = code | state;
      if (line >= 0 && line < ROWS && col >= 0 && col < COLUMNS) {
        textBuffer[line][col] = {
          code: value,
          color,
        };
      }
    };

    writeLine = (line, col, text, color, modifiers) => {
      if (text.length > COLUMNS) {
        throw new Error(`${text} is too long`);
      }
      const chars = map_chars(text, _characterMap);
      for (let i = 0; i < chars.length; i++) {
        this.writeChar(line, col + i, chars[i], color, modifiers);
      }
    };

    updateScreen = () => {
      // Copy lines to ScreenBuffer

      let needbreak = 64;
      let currentHidReport = 1;

      let hidReport = new Uint8Array(64); // not 64 as the 1st is the "report number" (remember needs 8 report for the screen)
      hidReport[0] = currentHidReport;
      let copiedInCurrentBuffer = 1;

      // Scan all the lines,
      for (let line = 0; line < ROWS; line++) {
        // and all the columns

        for (let i = 0; i < COLUMNS; i += 2) {
          // we need to encode the _textBuffer so it's understandable by the device.
          // read 2 chars at a time and encode them
          let encoded = Encode2Chars(
            textBuffer[line][i],
            textBuffer[line][i + 1]
          );

          hidReport[copiedInCurrentBuffer] = encoded[0];
          hidReport[copiedInCurrentBuffer + 1] = encoded[1];
          hidReport[copiedInCurrentBuffer + 2] = encoded[2];
          copiedInCurrentBuffer += 3;

          if (copiedInCurrentBuffer == needbreak) {
            // send report to device
            // increment report number
            this.device.write([0, ...hidReport]);

            hidReport = new Uint8Array(64);
            currentHidReport++;
            hidReport[0] = currentHidReport;
            copiedInCurrentBuffer = 1;
          }
        }
      }
    };
  }
  return Display;
})();
