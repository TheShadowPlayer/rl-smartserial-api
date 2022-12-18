import { SUBSCRIPTIONS } from "api/subscription/subscriptions";
import { SerialPort } from "serialport";

export type PublishSubscriptionMessageFunction<T> = (
  subscription: SUBSCRIPTIONS,
  data: T
) => void;

export type SerialDevice = { port: SerialPort };
export type SerialDevicesType = { [name: string]: SerialDevice };
