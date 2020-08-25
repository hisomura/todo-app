import { RepositoryReader, RepositoryWriter } from "./repository";
import { Todo, TodoList } from "../lib/todo";

const STORAGE_KEY = "todo-app";

class LocalStorageRepositoryWriter implements RepositoryWriter {
  constructor(protected todoLists: TodoList[]) {}

  protected saveToLocalStorage() {
    const boards = [{ id: 1, name: "default board", todoLists: this.todoLists }];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(boards));
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

  deleteTodoList(_listId: string) {}

  storeTodos(listId: string, todos: Todo[]) {
    this.updateTodoList(listId, { todos });
  }
}

class LocalStorageRepositoryReader implements RepositoryReader {
  readonly todoLists: TodoList[] = [];

  constructor() {
    const serialized = localStorage?.getItem(STORAGE_KEY);
    const unSerialized = serialized && JSON.parse(serialized);
    this.todoLists = unSerialized ? unSerialized[0].todoLists : [];
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
