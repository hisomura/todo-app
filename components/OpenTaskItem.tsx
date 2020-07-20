import React, { MouseEvent } from 'react'
import { Task } from '../lib/task'

type Props = {
  key: number
  task: Task
  index: number
  toggleTask: (event: MouseEvent<HTMLInputElement>, task: Task) => void
  clearTask?: (event: MouseEvent<HTMLElement>, task: Task) => void
  setDraggedTaskNextIndex: (index: number) => void
  setDraggedTaskId: (index: number) => void
  isNext: boolean
}

export default function OpenTaskItem(props: Props) {
  const className = 'flex py-2 ' + (props.isNext ? 'border-t-2 border-blue-500' : 'border-t')
  return (
    <li
      draggable={true}
      key={props.task.id}
      className={className}
      data-testid="open-task-item"
      onDragOver={(e) => {
        e.preventDefault()
        const rect = (e.target as HTMLLIElement).getBoundingClientRect()
        const middleHeight = rect.top + rect.height / 2
        const isUpper = middleHeight > e.clientY
        props.setDraggedTaskNextIndex(isUpper ? props.index : props.index + 1)
      }}
      onDragStart={(_e) => {
        props.setDraggedTaskId(props.task.id)
      }}
    >
      <input className="my-auto mr-2" type="checkbox" onClick={(e) => props.toggleTask(e, props.task)} />
      <p>{props.task.name}</p>
    </li>
  )
}
