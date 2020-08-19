import { RepositoryReader, RepositoryWriter } from "./repository";
import { Todo, TodoList } from "../lib/todo";

class MockRepositoryWriter implements RepositoryWriter {
  protected todoLists: TodoList[] = [];

  storeTodoList(todoList: TodoList) {
    this.todoLists.push(todoList);
  }

  storeTodos(_todos: Todo[], _todoListId: TodoList["id"]) {}
}

class MockRepositoryReader implements RepositoryReader {
  constructor(protected todoLists: TodoList[]) {}

  getTodoLists(): TodoList[] {
    return this.todoLists;
  }
}

export function getMockRepository(todoLists: TodoList[]) {
  return {
    reader: new MockRepositoryReader(todoLists),
    writer: new MockRepositoryWriter(),
  };
}
