import { CDU } from '../../lib/cdu.js';
import { leds } from '../../lib/cdu.js';
import { colors } from '../../../cdu737/src/colors.js';

/**
 * In this example,
 * - Read the keystrokes
 * - Display something on the screen
 * - Blink some Leds.
 **/

const onKeyPressHandler = (keyPressed) => {
  keyPressed.forEach((key) => {
    console.log(key.label);
    // or do something with the key like calling dcsbios commands.

    if (key.label === 'EXEC') {
      cdu.toggleLed(leds.EXEC);
    }
  });
};

const onErrorHandler = (err) => {
  console.error('Error:', err);
};

const cdu = new CDU(
  colors.white, // default color
  onKeyPressHandler, // handler for keypress
  onErrorHandler,
  100, // led refresh reate default ms
  500 // // display refresh rate default ms
);

if (cdu) {
  cdu.clearScreen();
  cdu.dumpBuffer();
} else {
  console.log('Device not found.');
}
