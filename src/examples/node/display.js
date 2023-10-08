import { colors, leds } from '../../lib/cdu.js';

// Full white "dash" 0x47 0x70 0x04

let fail_LED = false;

// This is the "dash" that is displayed on the screen
// one blue, one yellow, one blue, one yellow, etc...
// each 63 bytes long ( 1 byte for the line number, 63 bytes for the line )
// reprsents the 24+19 chars.
// 43*8 = 344
// 24*14 = 336

const twoChars = [0x47, 0x70 | colors.yellow, 0x04 | (colors.blue << 4)];

const chars = [].concat(...Array(21).fill(twoChars));
const line = [0, ...chars];

const displaySomethingOn = (device) => {
  for (let i = 1; i <= 8; i++) {
    line[0] = i;
    device.write([0, ...line]);
  }

  const lastLine = new Uint8Array(64);
  lastLine[0] = 9;

  lastLine[1] = 0x90;
  lastLine[2] = 0x90;
  lastLine[3] = leds.EXEC;

  if (fail_LED) {
    lastLine[3] |= leds.FAIL;
  } else {
    lastLine[3] &= ~leds.FAIL;
  }
  fail_LED = !fail_LED;

  device.write([0, ...lastLine]);
};

export default displaySomethingOn;
