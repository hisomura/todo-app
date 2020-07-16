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
  nextIndex: number | null
  constructor() {
    this.taskId = null
    this.nextIndex = null
  }
  dragStart(taskId: number, index: number) {
    this.taskId = taskId
    this.nextIndex = index
  }

  drop() {
    this.taskId = null
    this.nextIndex = null
  }

  dragOverTaskItem(nextIndex: number) {
    if (nextIndex !== this.nextIndex) {
      this.nextIndex = nextIndex
    }
  }
}
