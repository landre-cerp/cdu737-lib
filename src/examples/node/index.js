import { HID, devices } from 'node-hid';
import readKeypress from './readKeypress.js';
import display from './display.js';

// Vid, Pid ( only have 1 device connected )
// if you have more than 1 device connected, you can use serial number too.
const VID = 0x0483;
const PID = 0x5b36;

const deviceInfo = devices().find(
  (d) => d.vendorId === VID && d.productId === PID
);

if (deviceInfo) {
  const device = new HID(deviceInfo.path);

  console.log('Device found.', device);
  console.log('Infos', deviceInfo);

  let oldData = 0b00000011; //

  device.on('data', (data) => {
    // decode 2nd byte to get the report ID

    // you should see 00000011
    // 2 last bits are not used
    // Then when you press Right Select Key 1 ( top right key )
    // you should see 10000011
    // and RSK 2 01000011
    // and RSK 3 00100011
    // and so on.
    // console.log(data[1].toString(2).padStart(8, '0'));

    // to debounce you can do something like this
    // copy the last read data to a buffer
    // and compare it to the new data
    // if they are the same, do nothing

    if (oldData !== data[1]) {
      oldData = data;
      readKeypress(data);
    }
  });

  device.on('error', (err) => {
    console.error('Error:', err);
  });

  setInterval(() => {
    display(device);
  }, 300);

  // You can see that sometimes you get 2 reports for 1 key press
  // you may want to debounce that
} else {
  console.log('Device not found.');
}

// // 63 bytes of data , 1 byte of report ID added when copying to out_buffer
// const cdu_buffer = byte[9][63];

// for (let i = 1; i <= 8; i++) {
//   cdu_buffer[i] = i;
//   for (let j = 0; i < 63; i += 3) {
//     cdu_buffer[i][j] = 0x47;
//     cdu_buffer[i][j + 1] = 0x73;
//     cdu_buffer[i][j + 2] = 0x24;
//   }
// }

// // Lights and leds
// cdu_buffer[8][0] = 9;
// cdu_buffer[8][1] = 0x70;
// cdu_buffer[8][2] = 0x70;
// cdu_buffer[8][3] = 0x1; // EXEC

// for (let i = 0; i < 9; i++) {
//   device.write(cdu_buffer[i]);
// }
// device.write(cdu_buffer[8]);
