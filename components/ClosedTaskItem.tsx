import React, { MouseEvent } from 'react'
import { MdClose } from 'react-icons/md'
import { Task } from '../lib/task'

type Props = {
  key: number
  task: Task
  toggleTask: (event: MouseEvent<HTMLInputElement>, task: Task) => void
  clearTask: (event: MouseEvent<HTMLElement>, task: Task) => void
}

export default function ClosedTaskItem(props: Props) {
  return (
    <li key={props.task.id} className="flex py-2" data-testid="closed-task-item">
      <input
        className="my-auto mr-2"
        type="checkbox"
        onClick={(e) => props.toggleTask(e, props.task)}
        defaultChecked={true}
      />
      <p className="line-through">{props.task.name}</p>
      <div className="my-auto ml-auto" onClick={(e) => props.clearTask(e, props.task)}>
        <MdClose />
      </div>
    </li>
  )
}
