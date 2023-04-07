import { SUBSCRIPTIONS } from "api/subscription/subscriptions";
import PQueue from "p-queue";
import { SerialPort } from "serialport";
import {
  PublishSubscriptionMessageFunction,
  SerialDevicesType,
} from "types/general/general";
import {
  StartSerialDeviceConnectionInput,
  StartSerialDeviceConnectionResult,
} from "types/mutation/startSerialDeviceConnection.types";
import { DeviceMessage } from "types/subscription/deviceMessage.types";

const queue = new PQueue({ concurrency: 1, interval: 150 });

export const startSerialDeviceConnection = async (
  options: StartSerialDeviceConnectionInput,
  pubMessage: PublishSubscriptionMessageFunction<DeviceMessage>,
  serialDevices: SerialDevicesType
): Promise<StartSerialDeviceConnectionResult> => {
  const {
    baudRate,
    dataBits,
    hupcl,
    lock,
    parity,
    path,
    rtscts,
    xany,
    xoff,
    xon,
  } = options;
  const port = new SerialPort({
    baudRate,
    dataBits,
    hupcl,
    lock,
    parity,
    path,
    rtscts,
    xany,
    xoff,
    xon,
  });
  serialDevices[path] = { port };

  port.on("data", (data: Buffer) => {
    console.log("received message", path, data.toString());
    queue.add(() => {
      pubMessage(SUBSCRIPTIONS.SERIAL_MESSAGE, {
        date: new Date().toISOString(),
        message: data.toString(),
        path,
      });
    });
  });
  let successful = true;
  let done = false;

  port.on("error", (error) => {
    console.log("serial error", error);
    successful = false;
  });

  while (done === false) {
    await wait(100);
    if (!port.opening) {
      done = true;
    }
  }

  return { options, successful };
};

const wait = (time: number) =>
  new Promise((resolve) => {
    setTimeout(resolve, time);
  });
