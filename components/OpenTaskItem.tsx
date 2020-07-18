import React, { MouseEvent, useState } from 'react'
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
  const [className, setClassName] = useState('flex py-2')
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
        const newClassName = 'flex py-2 ' + (isUpper ? 'border-t-2' : 'border-b-2')
        setClassName(newClassName) // TODO currently not working
        props.dragManager.dragOverTaskItem(isUpper ? props.index : props.index + 1)
      }}
      onDragStart={(_e) => props.dragManager.dragStart(props.task.id, props.index)}
    >
      <input className="my-auto mr-2" type="checkbox" onClick={(e) => props.toggleTask(e, props.task)} />
      <p>{props.task.name}</p>
    </li>
  )
}
