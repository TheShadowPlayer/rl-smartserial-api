export type SendMessageArg = {
  input: SendMessageInput;
};

export type SendMessageInput = {
  path: string;
  message: string;
};

export type SendMessageResult = {
  path: string;
  message: string;
  date: string;
};
