import { Todo, TodoList } from "../lib/todo";

export interface RepositoryWriter {
  storeTodoList(todoList: TodoList): void;

  storeTodos(todos: Todo[], todoListId: TodoList['id']): void;
}

export interface RepositoryReader {
  getTodoLists(): TodoList[];
}
