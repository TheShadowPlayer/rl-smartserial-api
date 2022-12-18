import { DevicePortOptions } from "types/general/serialDevice.types";

export type StartSerialDeviceConnectionArgs = {
  options: StartSerialDeviceConnectionInput;
};

export type StartSerialDeviceConnectionInput = DevicePortOptions;

export type StartSerialDeviceConnectionResult = {
  successful: boolean;
  options: DevicePortOptions;
};
