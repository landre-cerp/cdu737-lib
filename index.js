import { HID, devices } from 'node-hid';
import { colors } from './src/colors.js';
import { readKeypress } from './src/keys.js';

// if you have more than 1 device connected, you can use serial number too.
export const VID = 0x0483;
export const PID = 0x5b36;

export const CDU = (() => {
  // private things
  let _rows = 14;
  let _columns = 24;
  let _buffer = [];

  let _ledStatus = 0;

  let _displayRefreshRate = 500;
  let _ledRefreshRate = 100;

  let _screenBrightness = 0xff;
  let _keyboardBRifghtness = 0xff;

  // Find the device
  let _deviceInfo = devices().find(
    (d) => d.vendorId === VID && d.productId === PID
  );
  let _device = null;
  if (_deviceInfo) {
    _device = new HID(_deviceInfo.path);

    setInterval(() => {
      updateLeds(_device);
    }, _ledRefreshRate);
  } else {
    console.log('Device not found.');
  }

  const updateLeds = () => {
    const lastLine = new Uint8Array(64);
    lastLine[0] = 9;
    lastLine[1] = _screenBrightness;
    lastLine[2] = _keyboardBRifghtness;
    lastLine[3] = _ledStatus;
    _device.write([0, ...lastLine]);
  };

  // constructor
  function CDU(
    _defaultColor = colors.white,
    onDataHandler = null,
    onErrorHandler = null,
    ledRefreshRate,
    displayRefreshRate
  ) {
    _displayRefreshRate = displayRefreshRate;
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

    this.resetLeds = function () {
      // LEDS are off by default
      this.exec = false;
      this.msg = false;
      this.offst = false;
      this.fail = false;
      this.call = false;
    };

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
            charCode: 32, // Default to space character
            color: colors.white, // Default color
            state: 'INVERTED', // Default state
          });
        }
        _buffer.push(row);
      }
    };

    this.screenBrightness = function (intensity) {
      if (intensity < 0 || intensity > 0xff) {
        throw new Error('screenBrightness must be between 0 and 255');
      }
      _screenBrightness = intensity;
    };

    this.keyboardBRifghtness = function (intensity) {
      if (intensity < 0 || intensity > 0xff) {
        throw new Error('keyboardBRifghtness must be between 0 and 255');
      }
      _keyboardBRifghtness = intensity;
    };

    // Method to write a character with code, color, and state to the buffer at a specified position
    this.writeChar = function (row, col, charCode, color, state) {
      if (row >= 0 && row < _rows && col >= 0 && col < _columns) {
        _buffer[row][col] = {
          charCode,
          color,
          state,
        };
      }
    };

    this.setLed = function (led) {
      _ledStatus |= led;
    };

    this.toggleLed = function (led) {
      _ledStatus ^= led;
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
  }
  return CDU;
})();