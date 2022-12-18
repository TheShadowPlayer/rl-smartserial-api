import { SerialDevicesType } from "types/general/general";
import {
  SendMessageInput,
  SendMessageResult,
} from "types/mutation/sendMessage.types";

export const sendMessage = (
  input: SendMessageInput,
  serialDevices: SerialDevicesType
): SendMessageResult => {
  const knownDevices = Object.keys(serialDevices);
  const isKnownDevice = knownDevices.includes(input.path);
  if (isKnownDevice) {
    serialDevices[input.path].port.write(input.message);
  } else {
    console.error("device is not known", input);
  }

  return { ...input, date: new Date().toISOString() };
};
