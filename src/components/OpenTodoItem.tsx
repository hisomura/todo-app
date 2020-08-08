import React, { DragEventHandler } from 'react'
import { Todo } from '../lib/todo'

type Props = {
  key: string
  todo: Todo
  index: number
  toggleTodo: (todo: Todo) => void
  setNextIndex: (nextIndex: number) => void
  dragEndHandler: () => void
  isNext: boolean
}

export default function OpenTodoItem(props: Props) {
  const className = 'flex py-2 ' + (props.isNext ? 'border-t-2 border-blue-500' : 'border-t')
  const onDragStart: DragEventHandler = (e) => {
    e.dataTransfer!.setData('todo-key', props.todo.key)
    e.dataTransfer!.effectAllowed = 'move'
  }
  return (
    <li
      draggable={true}
      key={props.todo.key}
      className={className}
      data-testid="open-todo-item"
      onDragStart={onDragStart}
      onDragOver={(e) => {
        e.preventDefault()
        const rect = (e.target as HTMLLIElement).getBoundingClientRect()
        const middleHeight = rect.top + rect.height / 2
        const isUpper = middleHeight > e.clientY
        props.setNextIndex(isUpper ? props.index : props.index + 1)
      }}
      onDragEnd={props.dragEndHandler}
    >
      <input className="my-auto mr-2" type="checkbox" onClick={() => props.toggleTodo(props.todo)} />
      <p>{props.todo.name}</p>
    </li>
  )
}
