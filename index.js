import { colors } from './src/colors.js';
import { readKeypress } from './src/keys.js';
import { initDevice, PID } from './src/device.js';
import { CDULeds } from './src/leds.js';
import { Display } from './src/display.js';

export { colors } from './src/colors.js';
export { cdu_chars, modifiers } from './src/text.js';
export { keys } from './src/keys.js';
export { LED } from './src/leds.js';

export const CDU = (() => {
  let _display = null;
  let _cduLeds = null;

  let displayInterval = null;
  let ledInterval = null;

  class CDU {
    /**
     * CDU constructor
     * @param {(keypressed : keys[]) => void} onDataHandler handler for keypress
     * @param {(err) => void} onErrorHandler default logs error to console
     * @param {keyof typeof colors} defaultColor the default color of the screen
     * @param { { [key: string] : keyof typeof cdu_chars } } charaterMap to add to the default one
     *
     * @returns {CDU} CDU instance
     */

    constructor(
      onDataHandler = (data) => {},
      onErrorHandler = (err) => console.error('Error:', err),
      defaultColor = colors.white,
      charaterMap
    ) {
      // Find the device
      let _device = initDevice(PID.captain);

      if (!_device) {
        throw new Error('Device not found.');
      }

      _display = new Display(_device);
      _cduLeds = new CDULeds(_device);

      _display.setCharacterMap(charaterMap);
      _display.setDefaultColor(defaultColor);
      _display.clearScreen();

      // set the default refresh rate to 250 ms
      displayInterval = setInterval(() => {
        _display.updateScreen();
      }, 250);

      // set the default refresh rate to 100 ms
      ledInterval = setInterval(() => {
        _cduLeds.updateLedsAndBrighness();
      }, 100);

      _device.on('error', onErrorHandler);

      if (onDataHandler) {
        _device.on('data', (data) => {
          // data is the new state of the keys

          onDataHandler(readKeypress(data), this);
        });
      }
      this.getDeviceInfo = () => _device.getDeviceInfo();
      this.getDisplay = () => _display;
      this.getLeds = () => _cduLeds;

      /**
       *
       * @param {int} ms display refresh rate in ms
       */
      this.setDisplayRate = (ms) => {
        clearInterval(displayInterval);
        displayInterval = setInterval(() => {
          _display.updateScreen();
        }, ms);
      };

      /**
       * @param {int} ms led refresh rate in ms
       */
      this.setLedRate = (ms) => {
        clearInterval(ledInterval);
        ledInterval = setInterval(() => {
          _cduLeds.updateLedsAndBrighness();
        }, ms);
      };

      this.close = () => {
        clearInterval(displayInterval);
        clearInterval(ledInterval);

        _device.removeAllListeners();

        _device.close();
      };
    }
  }
  return CDU;
})();
