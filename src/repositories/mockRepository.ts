import { RepositoryReader, RepositoryWriter } from "./repository";
import { Todo, TodoList } from "../lib/todo";

class MockRepositoryWriter implements RepositoryWriter {
  protected todoLists: TodoList[] = [];

  storeTodoList(todoList: TodoList) {
    this.todoLists.push(todoList);
  }

  updateTodoList(listId: string, props: Partial<TodoList>) {
    const index = this.todoLists.findIndex((l) => l.id === listId);
    if (index === undefined) return;
    this.todoLists[index] = {
      ...this.todoLists[index],
      ...props,
    };
  }

  storeTodos(listId: string, todos: Todo[]) {
    this.updateTodoList(listId, { todos });
  }
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
