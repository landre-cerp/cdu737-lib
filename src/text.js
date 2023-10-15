export const cdu_chars = {
  Space: 0,
  Lower: 0x01,
  Greater: 0x02,
  Percent: 0x03,
  OpenParent: 0x04,
  CloseParent: 0x05,
  Dot: 0x06,
  Dash: 0x07,
  Slash: 0x08,
  Plus: 0x09,
  Colon: 0x0a,
  Semicolon: 0x0b,
  EmptySquare: 0x0c,
  UpArrow: 0x0d,
  DownArrow: 0xe,
  LeftArrow: 0x0f,
  RightArrow: 0x10,
  Degree: 0x11,
  DegCelsius: 0x12,
  DegFarenheit: 0x13,
  Check: 0x14,
  NeedInvertedBig01: 0x15,
  NeedInvertedBig02: 0x16,
  NeedInvertedBig03: 0x17,
  NeedInvertedBig04: 0x18,
  NeedInvertedBig05: 0x19,
  NeedInvertedBig06: 0x1a,
  NeedInvertedBig07: 0x1b,
  Zero: 0x1c,
  One: 0x1d,
  Two: 0x1e,
  Three: 0x1f,
  Four: 0x20,
  Five: 0x21,
  Six: 0x22,
  Seven: 0x23,
  Eight: 0x24,
  Nine: 0x25,
  A: 0x26,
  B: 0x27,
  C: 0x28,
  D: 0x29,
  E: 0x2a,
  F: 0x2b,
  G: 0x2c,
  H: 0x2d,
  I: 0x2e,
  J: 0x2f,
  K: 0x30,
  L: 0x31,
  M: 0x32,
  N: 0x33,
  O: 0x34,
  P: 0x35,
  Q: 0x36,
  R: 0x37,
  S: 0x38,
  T: 0x39,
  U: 0x3a,
  V: 0x3b,
  W: 0x3c,
  X: 0x3d,
  Y: 0x3e,
  Z: 0x3f,
};

export const modifiers = {
  inverted: 1 << 7,
  big: 1 << 6,
};

export const defaultCharacterMap = {
  ' ': cdu_chars.Space,
  '<': cdu_chars.Lower,
  '>': cdu_chars.Greater,
  '%': cdu_chars.Percent,
  '(': cdu_chars.OpenParent,
  ')': cdu_chars.CloseParent,
  '.': cdu_chars.Dot,
  '-': cdu_chars.Dash,
  '/': cdu_chars.Slash,
  '+': cdu_chars.Plus,
  ':': cdu_chars.Colon,
  ';': cdu_chars.Semicolon,

  '°': cdu_chars.Degree,
  '*': cdu_chars.Check,
  0: cdu_chars.Zero,
  1: cdu_chars.One,
  2: cdu_chars.Two,
  3: cdu_chars.Three,
  4: cdu_chars.Four,
  5: cdu_chars.Five,
  6: cdu_chars.Six,
  7: cdu_chars.Seven,
  8: cdu_chars.Eight,
  9: cdu_chars.Nine,
  a: cdu_chars.A,
  b: cdu_chars.B,
  c: cdu_chars.C,
  d: cdu_chars.D,
  e: cdu_chars.E,
  f: cdu_chars.F,
  g: cdu_chars.G,
  h: cdu_chars.H,
  i: cdu_chars.I,
  j: cdu_chars.J,
  k: cdu_chars.K,
  l: cdu_chars.L,
  m: cdu_chars.M,
  n: cdu_chars.N,
  o: cdu_chars.O,
  p: cdu_chars.P,
  q: cdu_chars.Q,
  r: cdu_chars.R,
  s: cdu_chars.S,
  t: cdu_chars.T,
  u: cdu_chars.U,
  v: cdu_chars.V,
  w: cdu_chars.W,
  x: cdu_chars.X,
  y: cdu_chars.Y,
  z: cdu_chars.Z,
  A: cdu_chars.A | modifiers.big,
  B: cdu_chars.B | modifiers.big,
  C: cdu_chars.C | modifiers.big,
  D: cdu_chars.D | modifiers.big,
  E: cdu_chars.E | modifiers.big,
  F: cdu_chars.F | modifiers.big,
  G: cdu_chars.G | modifiers.big,
  H: cdu_chars.H | modifiers.big,
  I: cdu_chars.I | modifiers.big,
  J: cdu_chars.J | modifiers.big,
  K: cdu_chars.K | modifiers.big,
  L: cdu_chars.L | modifiers.big,
  M: cdu_chars.M | modifiers.big,
  N: cdu_chars.N | modifiers.big,
  O: cdu_chars.O | modifiers.big,
  P: cdu_chars.P | modifiers.big,
  Q: cdu_chars.Q | modifiers.big,
  R: cdu_chars.R | modifiers.big,
  S: cdu_chars.S | modifiers.big,
  T: cdu_chars.T | modifiers.big,
  U: cdu_chars.U | modifiers.big,
  V: cdu_chars.V | modifiers.big,
  W: cdu_chars.W | modifiers.big,
  X: cdu_chars.X | modifiers.big,
  Y: cdu_chars.Y | modifiers.big,
  Z: cdu_chars.Z | modifiers.big,
};

export const map_chars = (str, mapper) => {
  let result = [];
  for (let i = 0; i < str.length; i++) {
    result.push(mapper[str[i]]);
  }
  return result;
};

export const Encode2Chars = (char1, char2) => {
  // encode 2 consecutive chars
  // respecting the HIDreport structure
  // Simply put two consecutive chars are encoded that way.
  // Assume they both are 0x47 0x47  (which is a dash '-')
  // red is 0x03 green is 0x02
  //  => 0x47 0x7(seven of the 0x47 second char)(col1=3) 0x(col2=2)4(four of the 47 2nd char)

  // method returns => 0x47 0x73 0x24

  let encoded = new Uint8Array(3);
  encoded[0] = char1.code;
  encoded[1] = (char2.code << 4) | char1.color;
  encoded[2] = (char2.code >> 4) | (char2.color << 4);
  return encoded;
};
