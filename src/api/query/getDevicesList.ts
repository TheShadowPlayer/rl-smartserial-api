import { SerialPort } from "serialport";
import { DevicePort } from "types/general/serialDevice.types";
import { DeviceListResult } from "types/query/getDevicesList.types";

export const getDevicesList = async (): Promise<DeviceListResult> => {
  const PortList = await SerialPort.list();
  return {
    ports: PortList.map((port) => {
      const {
        locationId,
        manufacturer,
        path,
        pnpId,
        productId,
        serialNumber,
        vendorId,
      } = port;
      return {
        locationId,
        manufacturer,
        path,
        pnpId,
        productId,
        serialNumber,
        vendorId,
      } as DevicePort;
    }),
  };
};
