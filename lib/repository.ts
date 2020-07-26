import { Task } from './task'

export class LocalStorageTaskRepository {
  protected tasks: Task[] = []
  saveTasks(tasks: Task[]) {
    this.tasks = tasks
    window.localStorage.setItem('tasks', JSON.stringify(this.tasks))
  }
  getTasks() {
    const serialized = window?.localStorage?.getItem('tasks')
    this.tasks = serialized ? JSON.parse(serialized) : []
    return this.tasks
  }
}
