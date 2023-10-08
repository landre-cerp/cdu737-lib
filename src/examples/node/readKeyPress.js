const readKeypress = (data) => {
  if ((1 << 7) & data[1]) {
    console.log('RSK 1 pressed');
  }
  if ((1 << 6) & data[1]) {
    console.log('RSK 2 pressed');
  }
  if ((1 << 5) & data[1]) {
    console.log('RSK 3 pressed');
  }
  if ((1 << 4) & data[1]) {
    console.log('RSK 4 pressed');
  }
  if ((1 << 3) & data[1]) {
    console.log('RSK 5 pressed');
  }
  if ((1 << 2) & data[1]) {
    console.log('RSK 6 pressed');
  }
};

export default readKeypress;
