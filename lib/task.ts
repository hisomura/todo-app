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

export type TaskDragStatus = {
  taskId: Task['id']
  nextIndex: number
}