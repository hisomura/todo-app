import { Todo } from './todo'

export interface TodoRepository {
  saveTodos(todos: Todo[]): void
  getTodos(): Todo[]
}

export class LocalStorageTodoRepository implements TodoRepository {
  protected todos: Todo[] = []
  static create() {
    const repository = new LocalStorageTodoRepository()
    repository.load()
    return repository
  }
  saveTodos(todos: Todo[]) {
    this.todos = todos
    window.localStorage.setItem('todos', JSON.stringify(this.todos))
  }
  getTodos() {
    return this.todos
  }
  load() {
    const serialized = window?.localStorage?.getItem('todos')
    this.todos = serialized ? JSON.parse(serialized) : []
  }
}

export class MockTodoRepository implements TodoRepository {
  protected todos: Todo[] = []
  saveTodos(todos: Todo[]) {
    this.todos = todos
  }
  getTodos() {
    return this.todos
  }
}
