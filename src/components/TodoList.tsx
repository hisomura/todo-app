import React, { DragEventHandler, KeyboardEventHandler, useEffect, useReducer, useState } from 'react'
import { MdClearAll } from 'react-icons/md'
import { Todo, TodoDragStatus } from '../lib/todo'
import { moved } from '../lib/array'
import ToggleFoldingButton from './ToggleFoldingButton'
import OpenTodoItem from './OpenTodoItem'
import ClosedTodoItem from './ClosedTodoItem'
import ClearAllModal from './ClearAllModal'
import { TodoRepository } from '../lib/repository'

const preventDefault: DragEventHandler = (event) => event.preventDefault()

function useDragState() {
  const [dragStatus, setDragStatus] = useState<TodoDragStatus | null>(null)

  const dragStart = (todoKey: TodoDragStatus['todoKey'], index: number) => {
    setDragStatus({ todoKey: todoKey, nextIndex: index })
  }

  const setNextIndex = (nextIndex: TodoDragStatus['nextIndex']) => {
    if (!dragStatus) throw new Error(' In spite of not starting drag and drop, setNextIndex() called.')
    if (dragStatus.nextIndex === nextIndex) return
    setDragStatus({ ...dragStatus, nextIndex })
  }

  const dragEnd = () => setDragStatus(null)

  return [dragStatus, dragStart, setNextIndex, dragEnd] as const
}

type TodoStatus = {
  openTodos: Todo[]
  closedTodos: Todo[]
  dragTargetIndex: number | null
}

function useTodos(repository: TodoRepository) {
  const [todoStatus, setTodoStatus] = useState<TodoStatus>({
    openTodos: repository.getOpenTodos(),
    closedTodos: repository.getClosedTodos(),
    dragTargetIndex: null,
  })

  const addTodo = (todo: Todo) => {
    setTodoStatus({
      ...todoStatus,
      openTodos: [...todoStatus.openTodos, todo],
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

  const moveTodo = (status: TodoDragStatus) => {
    const todoIndex = todoStatus.openTodos.findIndex((t) => t.key === status.todoKey)
    setTodoStatus({
      ...todoStatus,
      openTodos: moved(todoStatus.openTodos, todoIndex, status.nextIndex),
    })
  }

  useEffect(() => {
    repository.saveTodos([...todoStatus.openTodos, ...todoStatus.closedTodos])
  }, [todoStatus])

  useEffect(() => {
    setTodoStatus({
      openTodos: repository.getOpenTodos(),
      closedTodos: repository.getClosedTodos(),
      dragTargetIndex: null,
    })
  }, [repository])

  return [todoStatus, setTodoStatus, addTodo, toggleTodo, clearTodo, moveTodo, clearAllClosedTodos] as const
}

type Props = {
  repository: TodoRepository
}

export default function TodoList(props: Props) {
  const [todoStatus, , addTodo, toggleTodo, clearTodo, moveTodo, clearAllClosedTodos] = useTodos(props.repository)
  const [dragStatus, dragStart, setNextIndex, dragEnd] = useDragState()
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
      <div className="max-w-xl mx-auto py-8 z-0">
        <div className="shadow-xl rounded px-4 pb-4">
          <div className="py-4">
            <h1>Todo</h1>
          </div>
          <div
            data-testid="open-todo-area"
            onDragOver={preventDefault}
            onDrop={(e) => {
              e.stopPropagation()
              e.preventDefault()
              if (dragStatus) moveTodo(dragStatus)
              dragEnd()
            }}
          >
            <ul>
              <li className="py-2">
                + <input className="focus:outline-none ml-1" onKeyDown={onKeyDown} type="text" />
              </li>
              {todoStatus.openTodos.map((todo, index) => (
                <OpenTodoItem
                  key={todo.key}
                  todo={todo}
                  index={index}
                  toggleTodo={toggleTodo}
                  isNext={index === dragStatus?.nextIndex}
                  dragStart={dragStart}
                  dragEnd={dragEnd}
                  setNextIndex={setNextIndex}
                />
              ))}
              <li
                className={
                  dragStatus?.nextIndex === todoStatus.openTodos.length ? 'border-t-2 border-blue-500' : 'border-t'
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
