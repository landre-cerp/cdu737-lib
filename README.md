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
console.log("Press 'RSK1' to scroll up.");
console.log("Press 'RSK2' to scroll down.");

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

# API

This works only with 1 CDU. I need to make some changes to be able to instantiate several CDU objects ( based on Serial Number)

## CDU

instantiate a CDU object with default values

The minimum you need to instantiate a CDU object is a handler for keypress.
you can with but it's useless ( or just to get device info)

```javascript
const cdu = new CDU();
// displays manufacturer, product,serial number
console.log(cdu.getDeviceInfo());
```

To interact with the device, you need to provide a handler for keypress.

```javascript
const onKeyPressHandler = (keyPressed) => {
  keyPressed.forEach((key) => {
    console.log(key.label);
    // or do something with the key like calling dcsbios commands.
  });
};

const cdu = new CDU(
  onKeyPressHandler // handler for keypress
);
```

You can also customise several parameters of the constructor
default 100 ms for led refresh should be enough. ( if you need to blink it's 10 times / s !)
500ms for display refresh is also a good value. it refreshes 2 times / s and does not flicker and does not send too much data to the device.
You may feel a very small delay when you you expect a screen update.

```javascript
import { CDU, colors, cdu_chars } from 'cdu737';

const onKeyPressHandler = (keyPressed) => {
  keyPressed.forEach((key) => {
    console.log(key.label);
    // or do something with the key like calling dcsbios commands.
  });
};

const cdu = new CDU(
  onKeyPressHandler, // handler for keypress
  (err) => console.error('Error:', err), // error handler
  colors.green, // default color is white if not provided
  200, // led refresh rate in ms ( 100 ms is the default value)
  250 // display refresh rate in ms ( 500 ms is the default value)
  // customCharacterMap // see below for more details
);
```

Specify a custom character map to use with the device.
The default character map maps a-z, A-Z, 0-9, and some special characters.
() - / : . % < > ; + °
other characters exists in the CDU but are not mapped by default.
This custom character map is added to the default one. This prevents you from having to map all the standard existing characters.

```javascript
const customCharacterMap = {
  // the idea is to map the character you need to display to the one that is available
  // in the device and "looks like" the one you want.
  // for example, the device has () but no [] so you can map '[' to '(' and ']' to ')'

  '[': cdu_chars.OpenParent,
  ']': cdu_chars.CloseParent,
};
```
