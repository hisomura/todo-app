import { v4 as uuidV4 } from 'uuid';

export type Task = {
  key: string
  name: string
  closed: boolean
}

export const Task = {
  create: (name: string, closed = false): Task => ({ key: uuidV4(), name, closed }),
  convert: (key: string, name: string, closed: boolean): Task => ({ key, name, closed }),
}

export type TaskDragStatus = {
  taskKey: Task['key']
  nextIndex: number
}
