import { HID, devices } from 'node-hid';
import { colors } from './src/colors.js';
import { readKeypress } from './src/keys.js';
import { cdu_chars, charMapper, modifiers, map_chars } from './src/text.js';
import { vScrollDisplayDown, vScrollDisplayUp } from './src/display.js';

// if you have more than 1 device connected, you can use serial number too.
export const VID = 0x0483;
export const PID = 0x5b36;

export const CDU = (() => {
  // private things
  let _rows = 14;
  let _columns = 24;
  let _buffer = [];

  // LEDS are off by default
  // this is bit mask for the leds
  let _ledStatus = 0;
  let _ledRefreshRate = 100;

  let _screenBrightness = 0x80;
  let _keyboardBrightness = 0x0;

  let _displayRefreshRate = 1000;

  // Find the device
  let _deviceInfo = devices().find(
    (d) => d.vendorId === VID && d.productId === PID
  );
  let _device = null;

  if (_deviceInfo) {
    _device = new HID(_deviceInfo.path);

    setInterval(() => {
      updateLedsAndBrighness(_device);
    }, _ledRefreshRate);
  } else {
    console.log('Device not found.');
  }

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
    for (let line = 0; line < _rows; line++) {
      // and all the columns

      for (let i = 0; i < _columns; i += 2) {
        // we need to encode the _buffer so it's understandable by the device.
        // read 2 chars at a time and encode them
        let encoded = Encode2Chars(_buffer[line][i], _buffer[line][i + 1]);

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

  const Encode2Chars = (char1, char2) => {
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

  // constructor
  function CDU(
    _defaultColor = colors.white,
    onDataHandler = null,
    onErrorHandler = null,
    ledRefreshRate,
    displayRefreshRate,
    charMap = charMapper
  ) {
    _displayRefreshRate = displayRefreshRate;

    setInterval(() => {
      updateScreen();
    }, _displayRefreshRate);

    _ledRefreshRate = ledRefreshRate;

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

    // Méthode pour afficher le contenu du buffer à la console
    this.dumpBuffer = function () {
      for (let i = 0; i < _rows; i++) {
        // Display buffer on
      }
    };

    this.clearScreen = function () {
      for (let i = 0; i < _rows; i++) {
        let row = [];
        for (let j = 0; j < _columns; j++) {
          row.push({
            code: cdu_chars.Space, // Default to space character
            color: _defaultColor, // Default color
            state: modifiers.inverted, // Default state
          });
        }
        _buffer.push(row);
      }
    };

    // Handling Brightness of the screen and keyboard

    this.screenBrightness = function (intensity) {
      if (intensity < 0 || intensity > 0xff) {
        throw new Error('screenBrightness must be between 0 and 255');
      }
      _screenBrightness = intensity;
    };

    this.keyboardBrightness = function (intensity) {
      if (intensity < 0 || intensity > 0xff) {
        throw new Error('keyboardBRifghtness must be between 0 and 255');
      }
      _keyboardBrightness = intensity;
    };

    this.decreaseBrightness = (value) => {
      if (value < 0) {
        value = -value;
      }

      if (_screenBrightness > value) {
        _screenBrightness -= value;
      } else {
        _screenBrightness = 0;
      }
    };

    this.increaseBrightness = (value) => {
      if (value < 0) {
        value = -value;
      }

      if (_screenBrightness < 0xff - value) {
        _screenBrightness += value;
      } else {
        _screenBrightness = 0xff;
      }
    };

    // Method to write a character with code, color, and state to the buffer at a specified position
    this.writeChar = function (row, col, code, color, state) {
      let value = code | state;
      if (row >= 0 && row < _rows && col >= 0 && col < _columns) {
        _buffer[row][col] = {
          code: value,
          color,
        };
      }
    };

    this.writeLine = function (line, col, text, color, modifiers) {
      if (text.length > _columns) {
        throw new Error(`${text} is too long`);
      }
      const chars = map_chars(text);
      for (let i = 0; i < chars.length; i++) {
        this.writeChar(line, col + i, chars[i], color, modifiers);
      }
    };

    this.scrollUp = () => {
      vScrollDisplayUp(_buffer, _rows);
    };
    this.scrollDown = () => {
      vScrollDisplayDown(_buffer, _rows);
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
  }
  return CDU;
})();
