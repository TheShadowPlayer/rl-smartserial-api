export type DevicePort = {
  locationId: string | undefined;
  manufacturer: string | undefined;
  path: string;
  pnpId: string | undefined;
  productId: string | undefined;
  serialNumber: string | undefined;
  vendorId: string | undefined;
};

export type DevicePortOptions = {
  path: string;
  baudRate: number;
  lock: boolean | undefined;
  dataBits: 5 | 6 | 7 | 8 | undefined;
  parity: "none" | "even" | "odd" | "mark" | "space" | undefined;
  rtscts: boolean | undefined;
  xon: boolean | undefined;
  xoff: boolean | undefined;
  xany: boolean | undefined;
  hupcl: boolean | undefined;
};
