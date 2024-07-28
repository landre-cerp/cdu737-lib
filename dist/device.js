"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.initDevice = exports.PIDS = exports.VID = void 0;
const node_hid_1 = require("node-hid");
// if you have more than 1 device connected, you can use serial number too.
exports.VID = 0x0483;
exports.PIDS = { captain: 0x5b36, copilot: 0x5b35 }; // captain mode
const initDevice = (PID) => {
    let _deviceInfo = (0, node_hid_1.devices)().find((d) => d.vendorId === exports.VID && d.productId === PID);
    let _device = null;
    if (_deviceInfo) {
        if (_deviceInfo.path)
            _device = new node_hid_1.HID(_deviceInfo.path);
    }
    else {
        console.log('Device not found.');
    }
    return _device;
};
exports.initDevice = initDevice;
