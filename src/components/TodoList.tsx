import React, { DragEventHandler, KeyboardEventHandler, useEffect, useReducer, useState } from 'react'
import { MdClearAll } from 'react-icons/md'
import { Todo } from '../lib/todo'
import { moved } from '../lib/array'
import ToggleFoldingButton from './ToggleFoldingButton'
import OpenTodoItem from './OpenTodoItem'
import ClosedTodoItem from './ClosedTodoItem'
import ClearAllModal from './ClearAllModal'
import { TodoRepository } from '../lib/repository'

const preventDefault: DragEventHandler = (event) => event.preventDefault()

function inRect(rect: DOMRect, clientX: number, clientY: number) {
  return rect.left <= clientX && clientX <= rect.right && rect.top <= clientY && clientY <= rect.bottom
}

type TodoStatus = {
  openTodos: Todo[]
  closedTodos: Todo[]
  dropTargetIndex: number | null
}

function useTodos(repository: TodoRepository) {
  const [todoStatus, setTodoStatus] = useState<TodoStatus>({
    openTodos: repository.getOpenTodos(),
    closedTodos: repository.getClosedTodos(),
    dropTargetIndex: null,
  })

  const addTodo = (todo: Todo) => {
    setTodoStatus({
      ...todoStatus,
      openTodos: [todo, ...todoStatus.openTodos],
    })
  }

  const toggleTodo = (target: Todo) => {
    const newTarget = { ...target, closed: !target.closed } // required?
    if (target.closed) {
      setTodoStatus({
        ...todoStatus,
        openTodos: [...todoStatus.openTodos, newTarget],
        closedTodos: todoStatus.closedTodos.filter((t) => t.key !== target.key),
      })
    } else {
      setTodoStatus({
        ...todoStatus,
        openTodos: todoStatus.openTodos.filter((t) => t.key !== target.key),
        closedTodos: [...todoStatus.closedTodos, newTarget],
      })
    }
  }

  const clearTodo = (target: Todo) => {
    setTodoStatus({ ...todoStatus, closedTodos: todoStatus.closedTodos.filter((t) => t.key !== target.key) })
  }

  const clearAllClosedTodos = () => {
    setTodoStatus({ ...todoStatus, closedTodos: [] })
  }

  const moveTodo = (todoKey: string) => {
    const todoIndex = todoStatus.openTodos.findIndex((t) => t.key === todoKey)
    if (todoStatus.dropTargetIndex === null) throw new Error('DropTargetIndex is empty.')
    setTodoStatus({
      ...todoStatus,
      openTodos: moved(todoStatus.openTodos, todoIndex, todoStatus.dropTargetIndex),
      dropTargetIndex: null,
    })
  }

  const setDropTargetIndex = (nextIndex: number | null) => {
    if (todoStatus.dropTargetIndex === nextIndex) return
    setTodoStatus({ ...todoStatus, dropTargetIndex: nextIndex })
  }

  useEffect(() => {
    repository.saveTodos([...todoStatus.openTodos, ...todoStatus.closedTodos])
  }, [todoStatus])

  useEffect(() => {
    setTodoStatus({
      openTodos: repository.getOpenTodos(),
      closedTodos: repository.getClosedTodos(),
      dropTargetIndex: null,
    })
  }, [repository])

  return [
    todoStatus,
    setTodoStatus,
    addTodo,
    toggleTodo,
    clearTodo,
    setDropTargetIndex,
    moveTodo,
    clearAllClosedTodos,
  ] as const
}

type Props = {
  repository: TodoRepository
}

export default function TodoList(props: Props) {
  const [todoStatus, , addTodo, toggleTodo, clearTodo, setDropTargetIndex, moveTodo, clearAllClosedTodos] = useTodos(
    props.repository
  )
  const [foldingClosedTodos, toggleFoldingClosedTodos] = useReducer((state: boolean) => !state, true)
  const [modalOpen, setModalOpen] = useState(false)

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // if (event.keyCode === 229) return
    if (event.key !== 'Enter') return
    if (event.currentTarget.value === '') return
    addTodo(Todo.create(event.currentTarget.value))
    event.currentTarget.value = ''
  }

  return (
    <>
      <div className="max-w-xl mx-auto pt-2 z-0">
        <div className="shadow-xl rounded px-4 pb-4">
          <div className="pt-4">
            <h1>Todo</h1>
          </div>
          <div
            data-testid="open-todo-area"
            onDragOver={preventDefault}
            onDragLeave={(e) => {
              const rect = (e.target as HTMLDivElement).getBoundingClientRect()
              if (inRect(rect, e.clientX, e.clientY)) return
              setDropTargetIndex(null)
            }}
            onDrop={(e) => {
              e.stopPropagation()
              e.preventDefault()
              const todoKey = e.dataTransfer?.getData('todo-key')
              if (todoKey) moveTodo(todoKey)
            }}
          >
            <ul>
              <li className="py-2">
                <label htmlFor="new-todo" hidden={true}>
                  Input new todo.
                </label>
                + <input id="new-todo" className="focus:outline-none ml-1 w-11/12" onKeyDown={onKeyDown} type="text" />
              </li>
              {todoStatus.openTodos.map((todo, index) => (
                <OpenTodoItem
                  key={todo.key}
                  todo={todo}
                  index={index}
                  toggleTodo={toggleTodo}
                  isNext={index === todoStatus.dropTargetIndex}
                  setNextIndex={setDropTargetIndex}
                />
              ))}
              <li
                className={
                  todoStatus.dropTargetIndex === todoStatus.openTodos.length ? 'border-t-2 border-blue-500' : 'border-t'
                }
              />
            </ul>
          </div>

          <div data-testid="closed-todo-area">
            <div className="mt-2 py-1 flex justify-between">
              <h2>closed</h2>
              <div
                className="ml-auto mr-2"
                hidden={foldingClosedTodos || todoStatus.closedTodos.length === 0}
                onClick={() => setModalOpen(true)}
                data-testid="clear-all-closed-todos"
              >
                <MdClearAll />
              </div>
              <ToggleFoldingButton folding={foldingClosedTodos} onClick={toggleFoldingClosedTodos} />
            </div>
            <ul className="divide-y" hidden={foldingClosedTodos}>
              {todoStatus.closedTodos.map((todo) => (
                <ClosedTodoItem key={todo.key} todo={todo} toggleTodo={toggleTodo} clearTodo={clearTodo} />
              ))}
            </ul>
          </div>
        </div>
      </div>
      <ClearAllModal open={modalOpen} onClear={clearAllClosedTodos} onClose={() => setModalOpen(false)} />
    </>
  )
}
