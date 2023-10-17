export const LED = {
  EXEC: 0b0000001,
  MSG: 0b0000010,
  OFST: 0b0000100,
  FAIL: 0b0001000,
  CALL: 0b0010000,
};

export const CDULeds = (() => {
  let _screenBrightness = 0x80;
  let _keyboardBrightness = 0x80;
  let _ledStatus = LED.OFF;

  let _device = null;

  const adjustBrightness = (setting, value) => {
    const newValue = setting + value;
    return Math.min(Math.max(newValue, 0), 0xff);
  };

  const setBrightness = (intensity) => {
    if (intensity < 0 || intensity > 0xff) {
      throw new Error('Brightness must be between 0 and 255');
    }
    return intensity;
  };

  class CDULeds {
    constructor(device) {
      _device = device;
    }

    updateLedsAndBrighness = () => {
      const lastLine = new Uint8Array(64);
      lastLine[0] = 9;
      lastLine[1] = _screenBrightness;
      lastLine[2] = _keyboardBrightness;
      lastLine[3] = _ledStatus;
      _device.write([0, ...lastLine]);
    };

    /**
     *
     * @param {uint8} led
     */
    toggleLed = (led) => {
      if (_ledStatus & led) {
        _ledStatus &= ~led;
      } else {
        _ledStatus |= led;
      }
    };

    setLed = (led) => {
      _ledStatus |= led;
    };

    clearLed = (led) => {
      _ledStatus &= ~led;
    };

    setLedStatus = (ledStatus) => {
      _ledStatus = ledStatus;
    };

    setLedsOff = () => {
      this.setLedStatus(0);
    };

    /**
     * Set the screen brightness
     * @param {int} intensity 0-255
     */
    setScreenBrightness = (intensity) => {
      _screenBrightness = setBrightness(intensity);
    };

    /**
     * Set the keyboard brightness
     * @param {int} intensity 0-255
     */
    setKeyboardBrightness = (intensity) => {
      _keyboardBrightness = setBrightness(intensity);
    };

    increaseScreenBrightness = (value) => {
      _screenBrightness = adjustBrightness(_screenBrightness, value);
    };

    decreaseScreenBrightness = (value) => {
      _screenBrightness = adjustBrightness(_screenBrightness, -value);
    };

    increaseKeyboardBrightness = (value) => {
      _keyboardBrightness = adjustBrightness(_keyboardBrightness, value);
    };

    decreaseKeyboardBrightness = (value) => {
      _keyboardBrightness = adjustBrightness(_keyboardBrightness, -value);
    };
  }

  return CDULeds;
})();
