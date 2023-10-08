import { HID, devices } from 'node-hid';
import displaySomethingOn from './display.js';
import { readKeypress } from '../../lib/cdu.js';

/**
 * In this example,
 * - Read the keystrokes
 * - Display something on the screen
 * - Blink some Leds.
 **/

// Vid, Pid ( only have 1 device connected )
// if you have more than 1 device connected, you can use serial number too.
const VID = 0x0483;
const PID = 0x5b36;

// Find the device
const deviceInfo = devices().find(
  (d) => d.vendorId === VID && d.productId === PID
);

if (deviceInfo) {
  console.log('Infos', deviceInfo);

  const device = new HID(deviceInfo.path);
  console.log('Device found.', device);

  // Set handlers for data and error events

  device.on('data', (data) => {
    // data contains keystroke information
    // data[1] is the first group of keys , // data[2] is the second group of keys
    // and so on till date[10]
    // each group contains 8 keys ( 1 byte ). each bit of the byte represents a key
    // if the bit is 1, the key is pressed
    // if the bit is 0, the key is not pressed
    // some keys are not being used (always 1)

    // use the cdu.js file to see which keys are used

    // You may notice that sometime you get 2 reports for 1 key press
    // to debounce you can do something like this:
    // copy the last read data to a buffer
    // and compare it to the new data. if they are the same, do nothing

    let keyPressed = readKeypress(data);

    keyPressed.forEach((key) => {
      console.log(key.label);
      // or do something with the key like calling dcsbios commands.
    });
  });

  device.on('error', (err) => {
    console.error('Error:', err);
  });

  // eternal loop to refresh the display
  // subject to change when the library gets "done"

  setInterval(() => {
    displaySomethingOn(device);
  }, 500);
} else {
  console.log('Device not found.');
}
