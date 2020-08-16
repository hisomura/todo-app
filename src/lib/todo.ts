import { v4 as uuidV4 } from "uuid";

export type Todo = {
  key: string;
  name: string;
  closed: boolean;
};

export const Todo = {
  create: (name: string, closed = false): Todo => ({ key: uuidV4(), name, closed }),
  convert: (key: string, name: string, closed: boolean): Todo => ({ key, name, closed }),
};