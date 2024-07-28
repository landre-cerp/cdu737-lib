export type Key = {
  group: number;
  bit: number;
  label: string;
};

export const cduKeys: { [key: string]: Key } = {
  RSK1: { group: 1, bit: 1 << 7, label: 'RSK1' } as Key,
  RSK2: { group: 1, bit: 1 << 6, label: 'RSK2' } as Key,
  RSK3: { group: 1, bit: 1 << 5, label: 'RSK3' } as Key,
  RSK4: { group: 1, bit: 1 << 4, label: 'RSK4' } as Key,
  RSK5: { group: 1, bit: 1 << 3, label: 'RSK5' } as Key,
  RSK6: { group: 1, bit: 1 << 2, label: 'RSK6' } as Key,
  LSK1: { group: 2, bit: 1 << 7, label: 'LSK1' } as Key,
  LSK2: { group: 2, bit: 1 << 6, label: 'LSK2' } as Key,
  LSK3: { group: 2, bit: 1 << 5, label: 'LSK3' } as Key,
  LSK4: { group: 2, bit: 1 << 4, label: 'LSK4' } as Key,
  LSK5: { group: 2, bit: 1 << 3, label: 'LSK5' } as Key,
  LSK6: { group: 2, bit: 1 << 2, label: 'LSK6' } as Key,

  INITREF: { group: 3, bit: 1 << 6, label: 'INITREF' } as Key,
  RTE: { group: 3, bit: 1 << 5, label: 'RTE' } as Key,
  CLB: { group: 3, bit: 1 << 4, label: 'CLB' } as Key,
  CRZ: { group: 3, bit: 1 << 3, label: 'CRZ' } as Key,
  DES: { group: 3, bit: 1 << 2, label: 'DES' } as Key,
  BRT_MINUS: { group: 3, bit: 1 << 1, label: 'BRT_MINUS' } as Key,
  BRT_PLUS: { group: 3, bit: 1 << 0, label: 'BRT_PLUS' } as Key,

  MENU: { group: 4, bit: 1 << 5, label: 'MENU' } as Key,
  LEGS: { group: 4, bit: 1 << 4, label: 'LEGS' } as Key,
  DEP_ARR: { group: 4, bit: 1 << 3, label: 'DEP_ARR' } as Key,
  HOLD: { group: 4, bit: 1 << 2, label: 'HOLD' } as Key,
  PROG: { group: 4, bit: 1 << 1, label: 'PROG' } as Key,
  EXEC: { group: 4, bit: 1 << 0, label: 'EXEC' } as Key,

  N1LIMIT: { group: 5, bit: 1 << 6, label: 'N1LIMIT' } as Key,
  FIX: { group: 5, bit: 1 << 5, label: 'FIX' } as Key,
  A: { group: 5, bit: 1 << 4, label: 'A' } as Key,
  B: { group: 5, bit: 1 << 3, label: 'B' } as Key,
  C: { group: 5, bit: 1 << 2, label: 'C' } as Key,
  D: { group: 5, bit: 1 << 1, label: 'D' } as Key,
  E: { group: 5, bit: 1 << 0, label: 'E' } as Key,

  PREV_PAGE: { group: 6, bit: 1 << 6, label: 'PREV_PAGE' } as Key,
  NEXT_PAGE: { group: 6, bit: 1 << 5, label: 'NEXT_PAGE' } as Key,
  F: { group: 6, bit: 1 << 4, label: 'F' } as Key,
  G: { group: 6, bit: 1 << 3, label: 'G' } as Key,
  H: { group: 6, bit: 1 << 2, label: 'H' } as Key,
  I: { group: 6, bit: 1 << 1, label: 'I' } as Key,
  J: { group: 6, bit: 1 << 0, label: 'J' } as Key,

  K1: { group: 7, bit: 1 << 7, label: '1' } as Key,
  K2: { group: 7, bit: 1 << 6, label: '2' } as Key,
  K3: { group: 7, bit: 1 << 5, label: '3' } as Key,
  K: { group: 7, bit: 1 << 4, label: 'K' } as Key,
  L: { group: 7, bit: 1 << 3, label: 'L' } as Key,
  M: { group: 7, bit: 1 << 2, label: 'M' } as Key,
  N: { group: 7, bit: 1 << 1, label: 'N' } as Key,
  O: { group: 7, bit: 1 << 0, label: 'O' } as Key,

  K4: { group: 8, bit: 1 << 7, label: '4' } as Key,
  K5: { group: 8, bit: 1 << 6, label: '5' } as Key,
  K6: { group: 8, bit: 1 << 5, label: '6' } as Key,
  P: { group: 8, bit: 1 << 4, label: 'P' } as Key,
  Q: { group: 8, bit: 1 << 3, label: 'Q' } as Key,
  R: { group: 8, bit: 1 << 2, label: 'R' } as Key,
  S: { group: 8, bit: 1 << 1, label: 'S' } as Key,
  T: { group: 8, bit: 1 << 0, label: 'T' } as Key,

  K7: { group: 9, bit: 1 << 7, label: '7' } as Key,
  K8: { group: 9, bit: 1 << 6, label: '8' } as Key,
  K9: { group: 9, bit: 1 << 5, label: '9' } as Key,
  U: { group: 9, bit: 1 << 4, label: 'U' } as Key,
  V: { group: 9, bit: 1 << 3, label: 'V' } as Key,
  W: { group: 9, bit: 1 << 2, label: 'W' } as Key,
  X: { group: 9, bit: 1 << 1, label: 'X' } as Key,
  Y: { group: 9, bit: 1 << 0, label: 'Y' } as Key,

  KPT: { group: 10, bit: 1 << 7, label: '.' } as Key,
  K0: { group: 10, bit: 1 << 6, label: '0' } as Key,
  PLUS_MINUS: { group: 10, bit: 1 << 5, label: 'PLUS_MINUS' } as Key,
  Z: { group: 10, bit: 1 << 4, label: 'Z' } as Key,
  SP: { group: 10, bit: 1 << 3, label: 'SP' } as Key,
  DEL: { group: 10, bit: 1 << 2, label: 'DEL' } as Key,
  SLASH: { group: 10, bit: 1 << 1, label: '/' } as Key,
  CLR: { group: 10, bit: 1 << 0, label: 'CLR' } as Key,
};


export type KeyBit = 1 | 2 | 4 | 8 | 16 | 32 | 64 | 128;
export type KeyPress = {
  key: Key;
  group: number;
  bit: KeyBit;
};

export type KeyPresses = Key[];
export type usbRead = number[];

let oldKeyPressed: KeyPresses = [];

// Debounce need to be improved

export const readKeypress = (data: usbRead): KeyPresses => {
  const keypressed: KeyPresses = [];

  for (let index = 1; index < 11; index++) {

    const group = data[index];

    Object.keys(cduKeys).forEach((key) => {

      if (cduKeys[key].group === index) {
        const bit = cduKeys[key].bit;
        if (group & bit && !oldKeyPressed.includes(cduKeys[key])) {
          keypressed.push(cduKeys[key]);
        }
      }
    });
  }
  oldKeyPressed = keypressed;
  return keypressed;
};
