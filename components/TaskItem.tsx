import React, { MouseEvent } from 'react'
import cn from 'classnames'
import { MdClose } from 'react-icons/md'
import { Task, TaskDragManager } from '../lib/task'

type Props = {
  key: number
  task: Task
  index: number
  toggleTask: (event: MouseEvent<HTMLInputElement>, task: Task) => void
  clearTask?: (event: MouseEvent<HTMLElement>, task: Task) => void
  dragManager: TaskDragManager
}

export default function TaskItem(props: Props) {
  return (
    <li
      draggable
      key={props.task.id}
      className="flex py-2"
      data-testid={props.clearTask ? 'task-item-closed' : 'task-item-open'}
      onDragStart={(_e) => {
        props.dragManager.dragStart(props.task.id)
      }}
    >
      <input
        className="my-auto mr-2"
        type="checkbox"
        onClick={(e) => props.toggleTask(e, props.task)}
        defaultChecked={props.task.closed}
      />
      <p className={cn({ 'line-through': props.task.closed })}>{props.task.name}</p>
      {props.clearTask ? (
        <div className="my-auto ml-auto" onClick={(e) => props.clearTask!(e, props.task)}>
          <MdClose />
        </div>
      ) : null}
    </li>
  )
}
