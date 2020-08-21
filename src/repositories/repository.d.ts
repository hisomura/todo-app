import { Todo, TodoList } from "../lib/todo";

export interface RepositoryWriter {
  storeTodoList(todoList: TodoList): void;

  updateTodoList(listId: string, props: Partial<TodoList>): void;

  storeTodos(listId: string, todos: Todo[]): void;
}

export interface RepositoryReader {
  getTodoLists(): TodoList[];
}
