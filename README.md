# CDU 737 Library

This a node.js library to interact with the CockpitMaster CS 737X CDU

With this library, in a node.js program, you can:

- read CDU key press
- write to CDU display

Keep in mind that the device is limited in displayable chars.

See [CDU 737 Wiki](https://github.com/landre-cerp/cdu737-lib/wiki) for more details.

## Installation

in your project folder:

```bash
npm install cdu737
```

## Example Usage

[See Wiki](https://github.com/landre-cerp/cdu737-lib/wiki)
for more information about the device and the display capabilities.

```javascript
/**
 * In this example,
 * - Read the keystrokes
 * - Display something on the screen
 * - Light some Leds.
 
 **/

import { CDU, leds, colors, modifiers, keys } from 'cdu737';

const onKeyPressHandler = (keyPressed) => {
  keyPressed.forEach((key) => {
    console.log(key.label);
    // or do something with the key like calling dcsbios commands.

    if (key === keys.EXEC) {
      cdu.toggleLed(leds.EXEC);
    }

    if (key === keys.BRT_MINUS) {
      cdu.decreaseScreenBrightness(10);
      cdu.decreaseKeyboardBrightness(10);
    }

    if (key === keys.BRT_PLUS) {
      cdu.increaseScreenBrightness(10);
      cdu.increaseKeyboardBrightness(10);
    }

    if (key === keys.RSK1) {
      cdu.scrollUp();
    }
    if (key === keys.RSK2) {
      cdu.scrollDown();
    }
  });
};

const cdu = new CDU(
  colors.white, // default color
  onKeyPressHandler // handler for keypress
);

console.log("Press 'EXEC' to toggle the EXEC led.");
console.log("Press 'BRT_MINUS' to decrease the brightness.");
console.log("Press 'BRT_PLUS' to increase the brightness.");

const testDisplay = () => {
  cdu.clearScreen();

  // each line is 24 characters long. more than 24 characters will raise an error.
  // cdu can display 14 lines. ( 0 - 13)

  cdu.writeLine(0, 0, '0123456789abcdefghijklmn', colors.white);
  cdu.writeLine(1, 0, 'opqrstuvwxyzAZCDEFGHIJKL', colors.red);
  cdu.writeLine(
    2,
    0,
    'MNOPQRSTUVWXYZ<>%().-/+:',
    colors.green,
    modifiers.inverted
  );

  cdu.writeLine(3, 0, ';*0123456789abcdefghijkl', colors.yellow);
  cdu.writeLine(4, 0, '0123456789abcdefghijklmn', colors.blue);
  cdu.writeLine(5, 0, '0123456789abcdefghijklmn', colors.purple);
  cdu.writeLine(6, 0, '0123456789abcdefghijklmn', colors.cyan);
  cdu.writeLine(7, 0, '0123456789abcdefghijklmn', colors.dark_green);
  cdu.writeLine(8, 0, '0123456789abcdefghijklmn');
  cdu.writeLine(9, 0, '0123456789abcdefghijklmn');
  cdu.writeLine(10, 0, '0123456789abcdefghijklmn');
  cdu.writeLine(11, 0, '0123456789abcdefghijklmn');
  cdu.writeLine(12, 0, '0123456789abcdefghijklmn');
  cdu.writeLine(13, 0, '------------------------');
};

if (cdu) {
  testDisplay();
} else {
  console.log('Device not found.');
}
```
