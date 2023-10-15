import { colors } from './colors.js';
import { cdu_chars, map_chars } from './text.js';

export const DEFAULT_BRIGHTNESS = 0x80;
export const DEFAULT_KEYBOARD_BRIGHTNESS = 0x80;

export const vScrollDisplayUp = (buffer, rows) => {
  let oldFirstLine = buffer[0];
  for (let i = 0; i < rows - 1; i++) {
    buffer[i] = buffer[i + 1];
  }
  // Clear last line
  buffer[rows - 1] = oldFirstLine;
};

export const vScrollDisplayDown = (buffer, rows) => {
  let oldLastLine = buffer[rows - 1];
  for (let i = rows - 1; i > 0; i--) {
    buffer[i] = buffer[i - 1];
  }
  // Clear first line
  buffer[0] = oldLastLine;
};

export const clearScreen = (textBuffer, rows = 14, columns = 24) => {
  for (let i = 0; i < rows; i++) {
    let row = [];
    for (let j = 0; j < columns; j++) {
      row.push({
        code: cdu_chars.Space, // Default to space character
        color: colors.white, // Default color
        state: 0, // Default state
      });
    }
    textBuffer.push(row);
  }
};

// Method to write a character with code, color, and state to the buffer at a specified position
export const writeChar = (
  textBuffer,
  _ROWS,
  _COLUMNS,
  row,
  col,
  code,
  color,
  state
) => {
  let value = code | state;
  if (row >= 0 && row < _ROWS && col >= 0 && col < _COLUMNS) {
    textBuffer[row][col] = {
      code: value,
      color,
    };
  }
};

export const writeLine = (
  textBuffer,
  _ROWS,
  _COLUMNS,
  charaterMap,
  line,
  col,
  text,
  color,
  modifiers
) => {
  if (text.length > _COLUMNS) {
    throw new Error(`${text} is too long`);
  }
  const chars = map_chars(text, charaterMap);
  for (let i = 0; i < chars.length; i++) {
    writeChar(
      textBuffer,
      _ROWS,
      _COLUMNS,
      line,
      col + i,
      chars[i],
      color,
      modifiers
    );
  }
};

export const increaseBrightness = (_setting, value) => {
  if (value < 0) {
    value = -value;
  }

  if (_setting < 0xff - value) {
    _setting += value;
  } else {
    _setting = 0xff;
  }
  return _setting;
};

export const decreaseBrightness = (_setting, value) => {
  if (value < 0) {
    value = -value;
  }

  if (_setting > value) {
    _setting -= value;
  } else {
    _setting = 0;
  }
  return _setting;
};

// Handling Brightness of the screen and keyboard

export const setBrightness = (intensity) => {
  if (intensity < 0 || intensity > 0xff) {
    throw new Error('Brightness must be between 0 and 255');
  }
  return intensity;
};
