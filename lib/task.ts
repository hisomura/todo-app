export type Task = {
  id: number
  name: string
  closed: boolean
}

export const Task = {
  lastId: 0,
  id: () => {
    Task.lastId += 1
    return Task.lastId
  },
  create: (name: string, closed = false): Task => {
    return {
      id: Task.id(),
      name,
      closed,
    }
  },
}
export class TaskDragManager {
  taskId: number | null
  constructor() {
    this.taskId = null
  }
  dragStart(taskId: number) {
    this.taskId = taskId
    console.log('drag start: ', this.taskId)
  }

  drop() {
    this.taskId = null
    console.log('drop', this.taskId)
  }
}
