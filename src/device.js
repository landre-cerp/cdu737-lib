import { HID, devices } from 'node-hid';

// if you have more than 1 device connected, you can use serial number too.
export const VID = 0x0483;
export const PID = 0x5b36;

export const initDevice = () => {
  let _deviceInfo = devices().find(
    (d) => d.vendorId === VID && d.productId === PID
  );

  let _device = null;
  if (_deviceInfo) {
    _device = new HID(_deviceInfo.path);
  } else {
    console.log('Device not found.');
  }

  return _device;
};
