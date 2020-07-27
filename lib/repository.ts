import { Task } from './task'

export interface TaskRepository {
  saveTasks(tasks: Task[]): void
  getTasks(): Task[]
}

export class LocalStorageTaskRepository implements TaskRepository {
  protected tasks: Task[] = []
  static create() {
    const repository = new LocalStorageTaskRepository()
    repository.load()
    return repository
  }
  saveTasks(tasks: Task[]) {
    this.tasks = tasks
    window.localStorage.setItem('tasks', JSON.stringify(this.tasks))
  }
  getTasks() {
    return this.tasks
  }
  load() {
    const serialized = window?.localStorage?.getItem('tasks')
    this.tasks = serialized ? JSON.parse(serialized) : []
  }
}

export class MockTaskRepository implements TaskRepository {
  protected tasks: Task[] = []
  saveTasks(tasks: Task[]) {
    this.tasks = tasks
  }
  getTasks() {
    return this.tasks
  }
}
