import { v4 as uuidV4 } from "uuid";

export type Todo = {
  id: string;
  name: string;
  closed: boolean;
};

export const Todo = {
  create: (name: string, closed = false): Todo => ({ id: uuidV4(), name, closed }),
  convert: (key: string, name: string, closed: boolean): Todo => ({ id: key, name, closed }),
};

export type TodoList = {
  id: string;
  name: string;
  todos: Todo[];
};

export const TodoList = {
  create: (name: string): TodoList => ({ id: uuidV4(), name, todos: [] }),
};
