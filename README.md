# CDU 737 Library

This a node.js library to interact with the CockpitMaster CS 737X CDU

PLEASE NOTE THAT THIS LIBRARY IS NOT SUPPORTED BY COCKPITMASTER.
PLEASE DO NOT CONTACT THEM FOR SUPPORT.

THIS LIBRARY IS IN EARLY DEVELOPMENT STAGE AND IS SUBJECT TO BREAKING CHANGES.

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
 * - Blink some Leds.
 **/

import { CDU, colors, LED, modifiers, keys } from 'cdu737';

const onKeyPressHandler = (keyPressed, cdu) => {
  let cduLeds = cdu.getLeds();
  let display = cdu.getDisplay();

  keyPressed.forEach((key) => {
    console.log(key.label);
    // or do something with the key like calling dcsbios commands.

    if (key === keys.EXEC) {
      cduLeds.toggleLed(LED.EXEC | LED.FAIL);
    }

    if (key === keys.BRT_MINUS) {
      cduLeds.decreaseScreenBrightness(10);
      cduLeds.decreaseKeyboardBrightness(10);
    }

    if (key === keys.BRT_PLUS) {
      cduLeds.increaseScreenBrightness(10);
      cduLeds.increaseKeyboardBrightness(10);
    }

    if (key === keys.RSK1) {
      display.scrollUp();
    }
    if (key === keys.RSK2) {
      display.scrollDown();
    }
  });
};

const cdu = new CDU(
  onKeyPressHandler, // handler for keypress
  (err) => console.error('Error:', err), // error handler
  colors.green // default color is white if not provided
);

console.log('This an example program for the CDU737 library');
console.log("Press 'EXEC' to toggle the EXEC and FAIL led .");
console.log(
  "Press 'BRT_MINUS','BRT_PLUS' to decrease or increase the brightness ( both keyboard and screen )."
);

console.log("Press 'RSK1' to scroll up.");
console.log("Press 'RSK2' to scroll down.");

const { manufacturer, product, serialNumber } = cdu.getDeviceInfo();

// See Wiki https://github.com/landre-cerp/cdu737-lib/wiki
// for more information about the device and the display capabilities.

const testDisplay = (display) => {
  display.clearScreen();

  // each line is 24 characters long. more than 24 characters will raise an error.
  // cdu can display 14 lines. ( 0 - 13)

  display.writeLine(0, 0, '0123456789abcdefghijklmn', colors.white);
  display.writeLine(1, 0, 'opqrstuvwxyzAZCDEFGHIJKL', colors.red);
  display.writeLine(
    2,
    0,
    'MNOPQRSTUVWXYZ<>%().-/+:',
    colors.green,
    modifiers.inverted
  );

  display.writeLine(3, 0, ';*0123456789abcdefghijkl', colors.yellow);
  display.writeLine(4, 0, '0123456789abcdefghijklmn', colors.blue);
  display.writeLine(5, 0, '0123456789abcdefghijklmn', colors.purple);
  display.writeLine(6, 0, '0123456789abcdefghijklmn', colors.cyan);
  display.writeLine(7, 0, '0123456789abcdefghijklmn', colors.dark_green);
  display.writeLine(8, 0, manufacturer, colors.yellow);
  display.writeLine(9, 0, product, colors.cyan);
  display.writeLine(10, 0, serialNumber, colors.red);
  // those 3 lines should use the default color ( green in this example)
  display.writeLine(11, 0, '0123456789abcdefghijklmn');
  display.writeLine(12, 0, '0123456789abcdefghijklmn');
  display.writeLine(13, 0, '------------------------');
};

if (cdu) {
  testDisplay(cdu.getDisplay());
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

### getDeviceInfo()

```javascript
const cdu = new CDU();
// displays manufacturer, product,serial number
console.log(cdu.getDeviceInfo());
```

### getDisplay()

```javascript
const cdu = new CDU();
// returns the display object
const display = cdu.getDisplay();
```

### getLeds()

```javascript
const cdu = new CDU();
// returns the leds object
const cduLeds = cdu.getLeds();
```

### constuctor parameters

You can also customise several parameters of the constructor
default 100 ms for led refresh should be enough. ( if you need to blink it's 10 times / s !)
250 for display refresh is also a good value. it refreshes 4 times/s and does not flicker and does not send too much data to the device.
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
  colors.green // default color is white if not provided
  // customCharacterMap // see below for more details
);
```

### keypressHandler

To interact with the device, you need to provide a handler for keypress.

```javascript
/**
 * Example of how to use the CDU737 class to display key strokes on the CDU.
 */
import { CDU } from 'cdu737';

const onKeyPressHandler = (keyPressed, cdu_instance) => {
  // if you need to access the display or the leds
  const display = cdu_instance.getDisplay();
  const cduLeds = cdu_instance.getLeds();

  keyPressed.forEach((key) => {
    console.log(key.label);
    // or do something with the key like calling dcsbios commands.
  });
};

const cdu = new CDU(
  onKeyPressHandler // handler for keypress
);
```

## Display

### clearScreen

```javascript
display.clearScreen();
```

### writeChar

some characters are not mapped by default and a bit "weird" to map.
the up , down , left and right arrows for example to 0x1b, 0x1a, 0x19, 0x18.
of the degree celcius and fahrenheit symbols are 0x7f and 0x80.

you can use the writeChar method to display them.

```javascript
import { CDU, cdu_chars, colors, modifiers } from 'cdu737';

const display = new CDU().getDisplay();

/**
 * Writes a character to the buffer at a specified position
 * the char is Not mapped
 *
 * @param {int} row (0-13)
 * @param {int} col (0-23)
 * @param {number} code Unsigned 8-bit integer
 * @param {keyof typeof colors} color
 * @param {keyof typeof modifiers} state
 */
display.writeChar(6, 10, cdu_chars.UpArrow, colors.blue, modifiers.big);

display.writeChar(6, 11, 0x47, colors.yellow, modifiers.inverted);

display.writeChar(
  6,
  12,
  cdu_chars.DownArrow,
  colors.red,
  modifiers.inverted | modifiers.big
);
```

### writeLine

the text will be mapped using default character map and custom character map if provided.

```javascript
/**
 * write a string to the screen
 * @param {number} line ( 0 - 13)
 * @param {number} column ( 0 - 23)
 * @param {string} text text to display
 * @param {keyof typeof colors} color color to use ( default is white)
 * @param {keyof typeof modifiers} modifier modifier to use ( default is none)
 *
 * @trhows {Error} if line or column are out of range
 */

const display = cdu.getDisplay();
display.writeLine(0, 0, '0123456789abcdefghijklmn', colors.white);
```

this will display the text in white on the first line starting at column 0.
You can omit color and modifier. default values are white and none.

```javascript
display.writeLine(0, 0, '0123456789abcdefghijklmn');
```

### Custom Character Map

Specify a custom character map to use with the device.
The default character map maps a-z, A-Z, 0-9, and some special characters.
() - / : . % < > ; + °
other characters exists in the CDU but are not mapped by default.
This custom character map is added to the default one. This prevents you from having to map all the standard existing characters.

This example will write (Hello World) on the top left in green color

```javascript
import { CDU, colors, cdu_chars } from 'cdu737';

const onKeyPressHandler = (keyPressed, cdu_instance) => {
  keyPressed.forEach((key) => {
    console.log(key.label);
    // or do something with the key like calling dcsbios commands.
  });
};

const customCharacterMap = {
  '[': cdu_chars.OpenParent,
  ']': cdu_chars.CloseParent,
};

const display = new CDU(
  onKeyPressHandler, // handler for keypress
  (err) => console.error('Error:', err), // error handler
  colors.green, // default color is white if not provided
  customCharacterMap // see below for more details
).getDisplay();

display.clearScreen();
display.writeLine(0, 0, '[Hello World]', colors.green);
```

You can specify a custom character map to use with the device in the constructor or you can change it later.

### setCustomCharacterMap

```javascript
/**
 * set a custom character map
 * @param {object} customCharacterMap
 */
display.setCustomCharacterMap(customCharacterMap);
```

### scrollUp & scrollDown

```javascript
/**
 * scroll the screen up or down
 */
display.scrollUp();
display.scrollDown();
```

### setDefaultColor

```javascript
/**
 * set the default color
 * @param {keyof typeof colors} color
 */
display.setDefaultColor(colors.green);
```

### updateScreen

```javascript
// This method is not ment to be used directly.
// suffisant refresh rate should do the job.
// i may remove it in the future.
display.updateScreen();
```

## LEDS

To be able to use the leds, you need to import the leds object.

Let's do a blink example !

```javascript
import { CDU, LED } from 'cdu737';

const cdu = new CDU();

let cdu_leds = cdu.getLeds();
let cdu_display = cdu.getDisplay();

let led = 0;

setInterval(() => {
  switch (led) {
    case 0:
      cdu_leds.toggleLed(LED.EXEC);
      break;
    case 1:
      cdu_leds.toggleLed(LED.FAIL);
      break;
    case 2:
      cdu_leds.toggleLed(LED.CALL);
      break;
    case 3:
      cdu_leds.toggleLed(LED.MSG);
      break;
    case 4:
      cdu_leds.toggleLed(LED.OFST);
      break;
  }
  led = (led + 1) % 5;
}, 200);
```

### toggleLed

```javascript
import { CDU, LED } from 'cdu737';
const cduLeds = new CDU().getLeds();
cduLeds.toggleLed(LED.EXEC);
```

### setLed

```javascript
/**
 * set the led
 * @param {keyof typeof leds} led
 */
cduLeds.setLed(leds.EXEC);
```

### clearLed

```javascript
/**
 * clear the led
 * @param {keyof typeof leds} led
 */
cduLeds.clearLed(leds.EXEC);
```

Though it seems more logical to attache screen brightness to display, and keyboard to the cdu ( and maybe a keyboard class with keys ), Screen and keyboard brightness are with Leds because they are controlled by the same "update" command. Each time time you send the 9th hidReport , you update the leds, the screen and the keyboard brightness.

### setScreenBrightness

```javascript
/**
 * set the brightness of the screen
 * @param {number} brightness ( 0 - 255)
 */
cduLeds.setScreenBrightness(50);
```

### increaseScreenBrightness decreaseScreenBrightness

```javascript
/**
 * increase the brightness of the screen
 * @param {number} brightness ( 0 - 255)
 */
cduLeds.increaseScreenBrightness(10);
cdusLeds.decreaseScreenBrightness(10);
```

### setKeyboardBrightness

```javascript
/**
 * set the brightness of the keyboard
 * @param {number} brightness ( 0 - 255)
 */
cduLeds.setKeyboardBrightness(50);
```

### increaseKeyboardBrightness decreaseKeyboardBrightness

```javascript
/**
 * increase the brightness of the keyboard
 * @param {number} brightness ( 0 - 255)
 */
cduLeds.increaseKeyboardBrightness(10);
cdusLeds.decreaseKeyboardBrightness(10);
```
