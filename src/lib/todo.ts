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
  create: (name: string, todos: Todo[]): TodoList => ({ id: uuidV4(), name, todos }),
};

export const moveTodoToAnotherList = (todo: Todo, todoLists: TodoList[], fromList: TodoList, toList: TodoList) => {
  return todoLists.reduce<TodoList[]>((acc, current) => {
    if (current.id === fromList.id) {
      acc.push({
        ...fromList,
        todos: fromList.todos.filter((t) => t.id !== todo.id),
      });
    } else if (current.id === toList.id) {
      acc.push({
        ...toList,
        todos: [...toList.todos, todo],
      });
    } else {
      acc.push(current);
    }

    return acc;
  }, []);
};