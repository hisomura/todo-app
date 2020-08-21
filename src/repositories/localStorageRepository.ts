import { RepositoryReader, RepositoryWriter } from "./repository";
import { Todo, TodoList } from "../lib/todo";

const TODO_LISTS_STORAGE_KEY = "todoLists";

class LocalStorageRepositoryWriter implements RepositoryWriter {
  constructor(protected todoLists: TodoList[]) {}

  protected saveToLocalStorage() {
    localStorage.setItem(TODO_LISTS_STORAGE_KEY, JSON.stringify(this.todoLists));
  }

  storeTodoList(todoList: TodoList) {
    const index = this.todoLists.findIndex((l) => l.id === todoList.id);
    if (index === -1) {
      this.todoLists.push(todoList);
    } else {
      this.todoLists[index] = todoList;
    }
    this.saveToLocalStorage();
  }

  updateTodoList(listId: string, props: Partial<TodoList>) {
    const index = this.todoLists.findIndex((l) => l.id === listId);
    if (index === undefined) return;
    this.todoLists[index] = {
      ...this.todoLists[index],
      ...props,
    };
    this.saveToLocalStorage();
  }

  storeTodos(listId: string, todos: Todo[]) {
    this.updateTodoList(listId, { todos });
  }
}

class LocalStorageRepositoryReader implements RepositoryReader {
  readonly todoLists: TodoList[] = [];

  constructor() {
    const serialized = localStorage?.getItem(TODO_LISTS_STORAGE_KEY);
    this.todoLists = serialized ? JSON.parse(serialized) : [];
  }

  getTodoLists(): TodoList[] {
    return this.todoLists;
  }
}

export function getLocalStorageRepository() {
  const reader = new LocalStorageRepositoryReader();
  return {
    reader,
    writer: new LocalStorageRepositoryWriter(reader.getTodoLists()),
  };
}
