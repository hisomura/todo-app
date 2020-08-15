import { Todo } from "./todo";

export interface TodoRepository {
  saveTodos(todos: Todo[]): void;

  getTodos(): Todo[];

  getOpenTodos(): Todo[];

  getClosedTodos(): Todo[];

  close(): void;
}

export class LocalStorageTodoRepository implements TodoRepository {
  protected todos: Todo[] = [];

  static create() {
    const repository = new LocalStorageTodoRepository();
    repository.init();
    return repository;
  }

  saveTodos(todos: Todo[]) {
    this.todos = todos;
    window.localStorage.setItem("todos", JSON.stringify(this.todos));
  }

  getTodos() {
    return this.todos;
  }

  getOpenTodos(): Todo[] {
    return this.todos.filter((t) => !t.closed);
  }

  getClosedTodos(): Todo[] {
    return this.todos.filter((t) => t.closed);
  }

  init() {
    const serialized = window?.localStorage?.getItem("todos");
    this.todos = serialized ? JSON.parse(serialized) : [];
  }

  close() {}
}

export class MockTodoRepository implements TodoRepository {
  protected todos: Todo[] = [];

  saveTodos(todos: Todo[]) {
    this.todos = todos;
  }

  getTodos() {
    return this.todos;
  }

  getOpenTodos(): Todo[] {
    return this.todos.filter((t) => !t.closed);
  }

  getClosedTodos(): Todo[] {
    return this.todos.filter((t) => t.closed);
  }

  close() {}
}
