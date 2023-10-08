// HID device
// const device = new HID(deviceInfo.path);

// Full white "dash" 0x47 0x70 0x04

const colors = {
  white: 0b000,
  cyan: 0b001,
  green: 0b010,
  purple: 0b011,
  yellow: 0b100,
  red: 0b101,
  blue: 0b110,
  dark_grey: 0b111,
};

const leds = {
  EXEC: 0b0000001,
  MSG: 0b0000010,
  OFST: 0b0000100,
  FAIL: 0b0001000,
  CALL: 0b0010000,
};
const line = new Uint8Array(64).map(function (v, i) {
  let val = 0x04 | (colors.blue << 4);
  if (i % 3 === 1) {
    val = 0x47;
  }
  if (i % 3 === 2) {
    val = 0x70 | colors.yellow;
  }
  return val;
});

const display = (device) => {
  for (let i = 1; i <= 8; i++) {
    line[0] = i;
    device.write([0, ...line]);
  }

  const lastLine = new Uint8Array(64);
  lastLine[0] = 9;

  lastLine[1] = 0x70;
  lastLine[2] = 0x70;
  lastLine[3] = leds.EXEC | leds.FAIL;

  device.write([0, ...lastLine]);
};

export default display;
