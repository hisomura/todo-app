import React from 'react'
import { Todo } from '../lib/todo'

type Props = {
  key: string
  todo: Todo
  index: number
  toggleTodo: (todo: Todo) => void
  dragStart: (todoKey: string, index: number) => void
  setNextIndex: (nextIndex: number) => void
  dragEnd: () => void
  isNext: boolean
}

export default function OpenTodoItem(props: Props) {
  const className = 'flex py-2 ' + (props.isNext ? 'border-t-2 border-blue-500' : 'border-t')
  return (
    <li
      draggable={true}
      key={props.todo.key}
      className={className}
      data-testid="open-todo-item"
      onDragStart={() => props.dragStart(props.todo.key, props.index)}
      onDragOver={(e) => {
        e.preventDefault()
        const rect = (e.target as HTMLLIElement).getBoundingClientRect()
        const middleHeight = rect.top + rect.height / 2
        const isUpper = middleHeight > e.clientY
        props.setNextIndex(isUpper ? props.index : props.index + 1)
      }}
      onDragEnd={props.dragEnd}
    >
      <input className="my-auto mr-2" type="checkbox" onClick={() => props.toggleTodo(props.todo)} />
      <p>{props.todo.name}</p>
    </li>
  )
}
