import React, { MouseEvent } from 'react'
import cn from 'classnames'
import { MdClose } from 'react-icons/md'
import { Task } from '../lib/task'

type Props = {
  key: number
  task: Task
  index: number
  toggleTask: (event: MouseEvent<HTMLInputElement>, task: Task) => void
  clearTask?: (event: MouseEvent<HTMLElement>, task: Task) => void
}

export default function TaskItem(props: Props) {
  return (
    <li key={props.task.id} className="flex py-2">
      <input
        className="my-auto mr-2"
        type="checkbox"
        onClick={(e) => props.toggleTask(e, props.task)}
        defaultChecked={props.task.closed}
      />
      <p className={cn({ 'line-through': props.task.closed })}>{props.task.name}</p>
      {props.clearTask ? (
        <div className="my-auto ml-auto" onClick={(e) => props.clearTask(e, props.task)}>
          <MdClose />
        </div>
      ) : null}
    </li>
  )
}
