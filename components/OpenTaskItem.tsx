import React, { MouseEvent } from 'react'
import { Task, TaskDragManager } from '../lib/task'

type Props = {
  key: number
  task: Task
  index: number
  toggleTask: (event: MouseEvent<HTMLInputElement>, task: Task) => void
  clearTask?: (event: MouseEvent<HTMLElement>, task: Task) => void
  dragManager: TaskDragManager
}

export default function OpenTaskItem(props: Props) {
  return (
    <li
      draggable={true}
      key={props.task.id}
      className="flex py-2"
      data-testid="open-task-item"
      onDragOver={(_e) => props.dragManager.dragOverTaskItem(props.index)}
      onDragStart={(_e) => props.dragManager.dragStart(props.task.id, props.index)}
    >
      <input className="my-auto mr-2" type="checkbox" onClick={(e) => props.toggleTask(e, props.task)} />
      <p>{props.task.name}</p>
    </li>
  )
}
