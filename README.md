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
 * - Blink some Leds.
 **/

import { CDU, leds, colors, modifiers, keys } from 'cdu737';

const onKeyPressHandler = (keyPressed) => {
  keyPressed.forEach((key) => {
    console.log(key.label);
    // or do something with the key like calling dcsbios commands.

    if (key === keys.EXEC) {
      cdu.toggleLed(leds.EXEC | leds.FAIL);
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
  onKeyPressHandler // handler for keypress
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
  cdu.writeLine(8, 0, manufacturer, colors.yellow);
  cdu.writeLine(9, 0, product, colors.cyan);
  cdu.writeLine(10, 0, serialNumber, colors.red);
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

### getDeviceInfo()

```javascript
const cdu = new CDU();
// displays manufacturer, product,serial number
console.log(cdu.getDeviceInfo());
```

### keypressHandler

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

### constuctor parameters

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

### Custom Character Map

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
cdu.writeLine(0, 0, '0123456789abcdefghijklmn', colors.white);
```

this will display the text in white on the first line starting at column 0.

You can omit color and modifier. default values are white and none.

```javascript
cdu.writeLine(0, 0, '0123456789abcdefghijklmn');
```

### clearScreen

```javascript
/**
 * clear the screen
 */
cdu.clearScreen();
```

### writeChar

```javascript
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
cdu.writeChar(6, 10, cdu_char.UpArrow, colors.blue, modifiers.big);

cdu.writeChar(6, 11, 0x47, colors.yellow, modifiers.inverted);

cdu.writeChar(
  6,
  12,
  cdu_char.DownArrow,
  colors.red,
  modifiers.inverted | modifiers.big
);
```

### scrollUp & scrollDown

```javascript
/**
 * scroll the screen up or down
 */
cdu.scrollUp();
cdu.scrollDown();
```

## LEDS

### leds

To be able to use the leds, you need to import the leds object.

```javascript
import { leds } from 'cdu737';
```

### toggleLed

```javascript
/**
 * toggle the led. the leg to toggle is a bitwise OR of the leds you want to toggle
 * @param {byte} led
 */
cdu.toggleLed(leds.EXEC);
cdu.toggleLed(leds.MSG | leds.FAIL);
```

### setLed

```javascript
/**
 * set the led
 * @param {keyof typeof leds} led
 */
cdu.setLed(leds.EXEC);
```

### clearLed

```javascript
/**
 * clear the led
 * @param {keyof typeof leds} led
 */
cdu.clearLed(leds.EXEC);
```
