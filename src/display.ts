import { HID } from 'node-hid';
import { colors, Color } from './colors.js';
import {
  cdu_chars,
  map_chars,
  defaultCharacterMap,
  CduCharMap,
  modifier,
} from './text.js';

interface TextCell {
  code: number;
  color: number;
};


export class Display {

  #ROWS: number;
  #COLUMNS: number;

  #textBuffer: TextCell[][];
  #characterMap = defaultCharacterMap;
  #defaultColor = colors.white;

  #device: HID;


  #Encode2Chars = (char1: TextCell, char2: TextCell) => {
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
  };


  constructor(device: HID) {
    this.#device = device;
    this.#ROWS = 14;
    this.#COLUMNS = 24;
    this.#textBuffer = Array.from({ length: this.#ROWS }, () => Array(this.#COLUMNS).fill({ code: 0, color: this.#defaultColor }));
  }

  public setCharacterMap = (charaterMap: CduCharMap) => {
    if (charaterMap) {
      this.#characterMap = { ...defaultCharacterMap, ...charaterMap };
    }
  };

  public clearScreen = () => {
    for (let i = 0; i < this.#ROWS; i++) {
      let row = [];
      for (let j = 0; j < this.#COLUMNS; j++) {
        row.push({
          code: cdu_chars.Space, // Default to space character
          color: colors.white, // Default color
        });
      }
      this.#textBuffer.push(row);
    }
  };

  public setDefaultColor = (color: Color) => {
    this.#defaultColor = color;
  };

  public scrollUp = () => {
    let oldFirstLine = this.#textBuffer[0];
    for (let i = 0; i < this.#ROWS - 1; i++) {
      this.#textBuffer[i] = this.#textBuffer[i + 1];
    }
    // Clear last line
    this.#textBuffer[this.#ROWS - 1] = oldFirstLine;
  };

  public scrollDown = () => {
    let oldLastLine = this.#textBuffer[this.#ROWS - 1];
    for (let i = this.#ROWS - 1; i > 0; i--) {
      this.#textBuffer[i] = this.#textBuffer[i - 1];
    }
    // Clear first line
    this.#textBuffer[0] = oldLastLine;
  };

  public writeChar = (line: number, col: number, code: number, color: Color = this.#defaultColor, state: number) => {
    let value = code | state;
    if (line >= 0 && line < this.#ROWS && col >= 0 && col < this.#COLUMNS) {
      this.#textBuffer[line][col] = {
        code: value,
        color: color,
      };
    }
  };

  public writeLine = (line: number, col: number, text: string, color: Color, modifiers: number) => {
    if (text.length > this.#COLUMNS) {
      throw new Error(`${text} is too long`);
    }
    const chars = map_chars(text, this.#characterMap);
    for (let i = 0; i < chars.length; i++) {
      this.writeChar(line, col + i, chars[i], color, modifiers);
    }
  };

  public updateScreen = () => {
    // Copy lines to ScreenBuffer

    let needbreak = 64;
    let currentHidReport = 1;

    let hidReport = new Uint8Array(64); // not 64 as the 1st is the "report number" (remember needs 8 report for the screen)
    hidReport[0] = currentHidReport;
    let copiedInCurrentBuffer = 1;

    // Scan all the lines,
    for (let line = 0; line < this.#ROWS; line++) {
      // and all the columns

      for (let i = 0; i < this.#COLUMNS; i += 2) {
        // we need to encode the _textBuffer so it's understandable by the device.
        // read 2 chars at a time and encode them
        let encoded = this.#Encode2Chars(
          this.#textBuffer[line][i],
          this.#textBuffer[line][i + 1]
        );

        hidReport[copiedInCurrentBuffer] = encoded[0];
        hidReport[copiedInCurrentBuffer + 1] = encoded[1];
        hidReport[copiedInCurrentBuffer + 2] = encoded[2];
        copiedInCurrentBuffer += 3;

        if (copiedInCurrentBuffer == needbreak) {
          // send report to device
          // increment report number
          this.#device.write([0, ...hidReport]);

          hidReport = new Uint8Array(64);
          currentHidReport++;
          hidReport[0] = currentHidReport;
          copiedInCurrentBuffer = 1;
        }
      }
    }
  };
};

