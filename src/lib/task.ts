export type Task = {
  id: number
  name: string
  closed: boolean
}

export const Task = {
  create: (id: number, name: string, closed = false): Task => ({ id, name, closed }),
}

export type TaskDragStatus = {
  taskId: Task['id']
  nextIndex: number
}
