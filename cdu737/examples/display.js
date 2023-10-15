// Full white "dash" 0x47 0x70 0x04

import { colors } from '../../../cdu737/src/colors.js';

// This is the "dash" that is displayed on the screen
// one blue, one yellow, one blue, one yellow, etc...
// each 63 bytes long ( 1 byte for the line number, 63 bytes for the line )
// reprsents the 24+19 chars.
// 43*8 = 344
// 24*14 = 336

const twoChars = [0x47, 0x70 | colors.yellow, 0x04 | (colors.blue << 4)];

const chars = [].concat(...Array(21).fill(twoChars));
const line = [0, ...chars];

export const displaySomethingOn = (device) => {
  for (let i = 1; i <= 8; i++) {
    line[0] = i;
    device.write([0, ...line]);
  }
};
