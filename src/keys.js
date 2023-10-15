export const keys = {
  RSK1: { group: 1, bit: 1 << 7, label: 'RSK1' },
  RSK2: { group: 1, bit: 1 << 6, label: 'RSK2' },
  RSK3: { group: 1, bit: 1 << 5, label: 'RSK3' },
  RSK4: { group: 1, bit: 1 << 4, label: 'RSK4' },
  RSK5: { group: 1, bit: 1 << 3, label: 'RSK5' },
  RSK6: { group: 1, bit: 1 << 2, label: 'RSK6' },
  LSK1: { group: 2, bit: 1 << 7, label: 'LSK1' },
  LSK2: { group: 2, bit: 1 << 6, label: 'LSK2' },
  LSK3: { group: 2, bit: 1 << 5, label: 'LSK3' },
  LSK4: { group: 2, bit: 1 << 4, label: 'LSK4' },
  LSK5: { group: 2, bit: 1 << 3, label: 'LSK5' },
  LSK6: { group: 2, bit: 1 << 2, label: 'LSK6' },

  INITREF: { group: 3, bit: 1 << 6, label: 'INITREF' },
  RTE: { group: 3, bit: 1 << 5, label: 'RTE' },
  CLB: { group: 3, bit: 1 << 4, label: 'CLB' },
  CRZ: { group: 3, bit: 1 << 3, label: 'CRZ' },
  DES: { group: 3, bit: 1 << 2, label: 'DES' },
  BRT_MINUS: { group: 3, bit: 1 << 1, label: 'BRT_MINUS' },
  BRT_PLUS: { group: 3, bit: 1 << 0, label: 'BRT_PLUS' },

  MENU: { group: 4, bit: 1 << 5, label: 'MENU' },
  LEGS: { group: 4, bit: 1 << 4, label: 'LEGS' },
  DEP_ARR: { group: 4, bit: 1 << 3, label: 'DEP_ARR' },
  HOLD: { group: 4, bit: 1 << 2, label: 'HOLD' },
  PROG: { group: 4, bit: 1 << 1, label: 'PROG' },
  EXEC: { group: 4, bit: 1 << 0, label: 'EXEC' },

  N1LIMIT: { group: 5, bit: 1 << 6, label: 'N1LIMIT' },
  FIX: { group: 5, bit: 1 << 5, label: 'FIX' },
  A: { group: 5, bit: 1 << 4, label: 'A' },
  B: { group: 5, bit: 1 << 3, label: 'B' },
  C: { group: 5, bit: 1 << 2, label: 'C' },
  D: { group: 5, bit: 1 << 1, label: 'D' },
  E: { group: 5, bit: 1 << 0, label: 'E' },

  PREV_PAGE: { group: 6, bit: 1 << 6, label: 'PREV_PAGE' },
  NEXT_PAGE: { group: 6, bit: 1 << 5, label: 'NEXT_PAGE' },
  F: { group: 6, bit: 1 << 4, label: 'F' },
  G: { group: 6, bit: 1 << 3, label: 'G' },
  H: { group: 6, bit: 1 << 2, label: 'H' },
  I: { group: 6, bit: 1 << 1, label: 'I' },
  J: { group: 6, bit: 1 << 0, label: 'J' },

  K1: { group: 7, bit: 1 << 7, label: '1' },
  K2: { group: 7, bit: 1 << 6, label: '2' },
  K3: { group: 7, bit: 1 << 5, label: '3' },
  K: { group: 7, bit: 1 << 4, label: 'K' },
  L: { group: 7, bit: 1 << 3, label: 'L' },
  M: { group: 7, bit: 1 << 2, label: 'M' },
  N: { group: 7, bit: 1 << 1, label: 'N' },
  O: { group: 7, bit: 1 << 0, label: 'O' },

  K4: { group: 8, bit: 1 << 7, label: '4' },
  K5: { group: 8, bit: 1 << 6, label: '5' },
  K6: { group: 8, bit: 1 << 5, label: '6' },
  P: { group: 8, bit: 1 << 4, label: 'P' },
  Q: { group: 8, bit: 1 << 3, label: 'Q' },
  R: { group: 8, bit: 1 << 2, label: 'R' },
  S: { group: 8, bit: 1 << 1, label: 'S' },
  T: { group: 8, bit: 1 << 0, label: 'T' },

  K7: { group: 9, bit: 1 << 7, label: '7' },
  K8: { group: 9, bit: 1 << 6, label: '8' },
  K9: { group: 9, bit: 1 << 5, label: '9' },
  U: { group: 9, bit: 1 << 4, label: 'U' },
  V: { group: 9, bit: 1 << 3, label: 'V' },
  W: { group: 9, bit: 1 << 2, label: 'W' },
  X: { group: 9, bit: 1 << 1, label: 'X' },
  Y: { group: 9, bit: 1 << 0, label: 'Y' },

  KPT: { group: 10, bit: 1 << 7, label: '.' },
  K0: { group: 10, bit: 1 << 6, label: '0' },
  PLUS_MINUS: { group: 10, bit: 1 << 5, label: 'PLUS_MINUS' },
  Z: { group: 10, bit: 1 << 4, label: 'Z' },
  SP: { group: 10, bit: 1 << 3, label: 'SP' },
  DEL: { group: 10, bit: 1 << 2, label: 'DEL' },
  SLASH: { group: 10, bit: 1 << 1, label: '/' },
  CLR: { group: 10, bit: 1 << 0, label: 'CLR' },
};

let oldKeyPressed = [];

// Debounce need to be improved

export const readKeypress = (data) => {
  const keypressed = [];
  for (let index = 1; index < 11; index++) {
    const group = data[index];

    Object.keys(keys).forEach((key) => {
      if (keys[key].group === index) {
        const bit = keys[key].bit;
        if (group & bit && !oldKeyPressed.includes(keys[key])) {
          keypressed.push(keys[key]);
        }
      }
    });
  }
  oldKeyPressed = keypressed;
  return keypressed;
};
