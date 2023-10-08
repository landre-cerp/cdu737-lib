export const colors = {
  white: 0b000,
  cyan: 0b001,
  green: 0b010,
  purple: 0b011,
  yellow: 0b100,
  red: 0b101,
  blue: 0b110,
  dark_grey: 0b111,
};

export const leds = {
  EXEC: 0b0000001,
  MSG: 0b0000010,
  OFST: 0b0000100,
  FAIL: 0b0001000,
  CALL: 0b0010000,
};

export const keys = [
  { group: 1, bit: 1 << 7, label: 'RSK1' },
  { group: 1, bit: 1 << 6, label: 'RSK2' },
  { group: 1, bit: 1 << 5, label: 'RSK3' },
  { group: 1, bit: 1 << 4, label: 'RSK4' },
  { group: 1, bit: 1 << 3, label: 'RSK5' },
  { group: 1, bit: 1 << 2, label: 'RSK6' },
  { group: 2, bit: 1 << 7, label: 'LSK1' },
  { group: 2, bit: 1 << 6, label: 'LSK2' },
  { group: 2, bit: 1 << 6, label: 'LSK3' },
  { group: 2, bit: 1 << 4, label: 'LSK4' },
  { group: 2, bit: 1 << 3, label: 'LSK5' },
  { group: 2, bit: 1 << 2, label: 'LSK6' },

  { group: 3, bit: 1 << 6, label: 'INITREF' },
  { group: 3, bit: 1 << 5, label: 'RTE' },
  { group: 3, bit: 1 << 4, label: 'CLB' },
  { group: 3, bit: 1 << 3, label: 'CRZ' },
  { group: 3, bit: 1 << 2, label: 'DES' },
  { group: 3, bit: 1 << 1, label: 'BRT_MINUS' },
  { group: 3, bit: 1 << 0, label: 'BRT_PLUS' },

  { group: 4, bit: 1 << 5, label: 'MENU' },
  { group: 4, bit: 1 << 4, label: 'LEGS' },
  { group: 4, bit: 1 << 3, label: 'DEP_ARR' },
  { group: 4, bit: 1 << 2, label: 'HOLD' },
  { group: 4, bit: 1 << 1, label: 'PROG' },
  { group: 4, bit: 1 << 0, label: 'EXEC' },

  { group: 5, bit: 1 << 6, label: 'N1LIMIT' },
  { group: 5, bit: 1 << 5, label: 'FIX' },
  { group: 5, bit: 1 << 4, label: 'A' },
  { group: 5, bit: 1 << 3, label: 'B' },
  { group: 5, bit: 1 << 2, label: 'C' },
  { group: 5, bit: 1 << 1, label: 'D' },
  { group: 5, bit: 1 << 0, label: 'E' },

  { group: 6, bit: 1 << 6, label: 'PREV_PAGE' },
  { group: 6, bit: 1 << 5, label: 'NEXT_PAGE' },
  { group: 6, bit: 1 << 4, label: 'F' },
  { group: 6, bit: 1 << 3, label: 'G' },
  { group: 6, bit: 1 << 2, label: 'H' },
  { group: 6, bit: 1 << 1, label: 'I' },
  { group: 6, bit: 1 << 0, label: 'J' },

  { group: 7, bit: 1 << 7, label: 'K1' },
  { group: 7, bit: 1 << 6, label: 'K2' },
  { group: 7, bit: 1 << 5, label: 'K3' },
  { group: 7, bit: 1 << 4, label: 'K' },
  { group: 7, bit: 1 << 3, label: 'L' },
  { group: 7, bit: 1 << 2, label: 'M' },
  { group: 7, bit: 1 << 1, label: 'N' },
  { group: 7, bit: 1 << 0, label: 'O' },

  { group: 8, bit: 1 << 7, label: 'K4' },
  { group: 8, bit: 1 << 6, label: 'K5' },
  { group: 8, bit: 1 << 5, label: 'K6' },
  { group: 8, bit: 1 << 4, label: 'P' },
  { group: 8, bit: 1 << 3, label: 'Q' },
  { group: 8, bit: 1 << 2, label: 'R' },
  { group: 8, bit: 1 << 1, label: 'S' },
  { group: 8, bit: 1 << 0, label: 'T' },

  { group: 9, bit: 1 << 7, label: 'K7' },
  { group: 9, bit: 1 << 6, label: 'K8' },
  { group: 9, bit: 1 << 5, label: 'K9' },
  { group: 9, bit: 1 << 4, label: 'U' },
  { group: 9, bit: 1 << 3, label: 'V' },
  { group: 9, bit: 1 << 2, label: 'W' },
  { group: 9, bit: 1 << 1, label: 'X' },
  { group: 9, bit: 1 << 0, label: 'Y' },

  { group: 10, bit: 1 << 7, label: 'KPT' },
  { group: 10, bit: 1 << 6, label: 'K0' },
  { group: 10, bit: 1 << 5, label: 'KPM' },
  { group: 10, bit: 1 << 4, label: 'Z' },
  { group: 10, bit: 1 << 3, label: 'SP' },
  { group: 10, bit: 1 << 2, label: 'DEL' },
  { group: 10, bit: 1 << 1, label: 'SLASH' },
  { group: 10, bit: 1 << 0, label: 'CLR' },
];

export const readKeypress = (data) => {
  const keypressed = [];
  for (let index = 1; index < 11; index++) {
    const group = data[index];

    Object.keys(keys).forEach((key) => {
      if (keys[key].group === index) {
        const bit = keys[key].bit;
        if (group & bit) {
          keypressed.push(keys[key]);
        }
      }
    });
  }
  return keypressed;
};
