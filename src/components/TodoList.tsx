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

function useTodos(repository: TodoRepository) {
  const [todos, setTodos] = useState<Todo[]>(repository.getTodos())

  const addTodo = (todo: Todo) => {
    setTodos([...todos, todo])
  }

  const toggleTodo = (target: Todo) => {
    const newTodos = todos.map((todo) => {
      if (todo.key !== target.key) return todo
      return { ...todo, closed: !todo.closed }
    })
    setTodos(newTodos)
  }

  const clearTodo = (target: Todo) => {
    setTodos(todos.filter((todo) => todo.key !== target.key))
  }

  const clearAllClosedTodos = () => {
    setTodos(todos.filter((item) => !item.closed))
  }

  const moveTodo = (status: TodoDragStatus) => {
    const todoIndex = todos.findIndex((t) => t.key === status.todoKey)
    setTodos(moved(todos, todoIndex, status.nextIndex))
  }

  useEffect(() => {
    repository.saveTodos(todos)
  }, [todos])

  useEffect(() => {
    setTodos(repository.getTodos())
  }, [repository])


  return [todos, setTodos, addTodo, toggleTodo, clearTodo, moveTodo, clearAllClosedTodos] as const
}

type Props = {
  repository: TodoRepository
}

export default function TodoList(props: Props) {
  const [todos, , addTodo, toggleTodo, clearTodo, moveTodo, clearAllClosedTodos] = useTodos(props.repository)
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
              {todos
                .filter((todo) => !todo.closed)
                .map((todo, index) => (
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
              <li className={dragStatus?.nextIndex === todos.length ? 'border-t-2 border-blue-500' : 'border-t'} />
            </ul>
          </div>

          <div data-testid="closed-todo-area">
            <div className="mt-2 py-1 flex justify-between">
              <h2>closed</h2>
              <div
                className="ml-auto mr-2"
                hidden={foldingClosedTodos || !todos.some((todo) => todo.closed)}
                onClick={() => setModalOpen(true)}
                data-testid="clear-all-closed-todos"
              >
                <MdClearAll />
              </div>
              <ToggleFoldingButton folding={foldingClosedTodos} onClick={toggleFoldingClosedTodos} />
            </div>
            <ul className="divide-y" hidden={foldingClosedTodos}>
              {todos
                .filter((todo) => todo.closed)
                .map((todo) => (
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
