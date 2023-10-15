export const hScrollLine = (line, direction) => {
  return line;
};

export const vScrollDisplayUp = (buffer, rows) => {
  let oldFirstLine = buffer[0];
  for (let i = 0; i < rows - 1; i++) {
    buffer[i] = buffer[i + 1];
  }
  // Clear last line
  buffer[rows - 1] = oldFirstLine;
};

export const vScrollDisplayDown = (buffer, rows) => {
  let oldLastLine = buffer[rows - 1];
  for (let i = rows - 1; i > 0; i--) {
    buffer[i] = buffer[i - 1];
  }
  // Clear first line
  buffer[0] = oldLastLine;
};
