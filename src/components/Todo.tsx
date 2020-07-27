import React, { DragEventHandler, KeyboardEventHandler, useEffect, useReducer, useState } from 'react'
import { MdClearAll } from 'react-icons/md'
import { Task, TaskDragStatus } from '../lib/task'
import { moved } from '../lib/array'
import ToggleFoldingButton from './ToggleFoldingButton'
import OpenTaskItem from './OpenTaskItem'
import ClosedTaskItem from './ClosedTaskItem'
import ClearAllModal from './ClearAllModal'
import { TaskRepository } from '../lib/repository'

const preventDefault: DragEventHandler = (event) => event.preventDefault()

function useDragState() {
  const [dragStatus, setDragStatus] = useState<TaskDragStatus | null>(null)

  const dragStart = (taskId: TaskDragStatus['taskId']) => {
    setDragStatus({ taskId, nextIndex: taskId })
  }

  const setNextIndex = (nextIndex: TaskDragStatus['nextIndex']) => {
    if (!dragStatus) throw new Error(' In spite of not starting drag and drop, setNextIndex() called.')
    if (dragStatus.nextIndex === nextIndex) return
    setDragStatus({ ...dragStatus, nextIndex })
  }

  const dragEnd = () => setDragStatus(null)

  return [dragStatus, dragStart, setNextIndex, dragEnd] as const
}

function useTasks(initialTasks: Task[]) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks)

  const addTask = (task: Task) => {
    setTasks([...tasks, task])
  }

  const toggleTask = (target: Task) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== target.id) return task
      return { ...task, closed: !task.closed }
    })
    setTasks(newTasks)
  }

  const clearTask = (target: Task) => {
    setTasks(tasks.filter((task) => task.id !== target.id))
  }

  const clearAllClosedTasks = () => {
    setTasks(tasks.filter((item) => !item.closed))
  }

  const moveTask = (status: TaskDragStatus) => {
    const taskIndex = tasks.findIndex((t) => t.id === status.taskId)
    setTasks(moved(tasks, taskIndex, status.nextIndex))
  }

  return [tasks, setTasks, addTask, toggleTask, clearTask, moveTask, clearAllClosedTasks] as const
}

type Props = {
  repository: TaskRepository
}

export default function Todo(props: Props) {
  const [tasks, , addTask, toggleTask, clearTask, moveTask, clearAllClosedTasks] = useTasks(props.repository.getTasks())
  const [dragStatus, dragStart, setNextIndex, dragEnd] = useDragState()
  const [foldingClosedTasks, toggleFoldingClosedTasks] = useReducer((state: boolean) => !state, true)
  const [modalOpen, setModalOpen] = useState(false)

  useEffect(() => props.repository.saveTasks(tasks))

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // if (event.keyCode === 229) return
    if (event.key !== 'Enter') return
    if (event.currentTarget.value === '') return
    const maxId = Math.max(...tasks.map((task) => task.id)) // FIXME
    addTask(Task.create(maxId + 1, event.currentTarget.value))
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
            data-testid="open-task-area"
            onDragOver={preventDefault}
            onDrop={(e) => {
              e.stopPropagation()
              e.preventDefault()
              if (dragStatus) moveTask(dragStatus)
              dragEnd()
            }}
          >
            <ul>
              <li className="py-2">
                + <input className="focus:outline-none ml-1" onKeyDown={onKeyDown} type="text" />
              </li>
              {tasks
                .filter((task) => !task.closed)
                .map((task, index) => (
                  <OpenTaskItem
                    key={task.id}
                    task={task}
                    index={index}
                    toggleTask={toggleTask}
                    isNext={index === dragStatus?.nextIndex}
                    dragStart={dragStart}
                    dragEnd={dragEnd}
                    setNextIndex={setNextIndex}
                  />
                ))}
              <li className={dragStatus?.nextIndex === tasks.length ? 'border-t-2 border-blue-500' : 'border-t'} />
            </ul>
          </div>

          <div data-testid="closed-task-area">
            <div className="mt-2 py-1 flex justify-between">
              <h2>closed</h2>
              <div
                className="ml-auto mr-2"
                hidden={foldingClosedTasks || !tasks.some((task) => task.closed)}
                onClick={() => setModalOpen(true)}
                data-testid="clear-all-closed-tasks"
              >
                <MdClearAll />
              </div>
              <ToggleFoldingButton folding={foldingClosedTasks} onClick={toggleFoldingClosedTasks} />
            </div>
            <ul className="divide-y" hidden={foldingClosedTasks}>
              {tasks
                .filter((task) => task.closed)
                .map((task) => (
                  <ClosedTaskItem key={task.id} task={task} toggleTask={toggleTask} clearTask={clearTask} />
                ))}
            </ul>
          </div>
        </div>
      </div>
      <ClearAllModal open={modalOpen} onClear={clearAllClosedTasks} onClose={() => setModalOpen(false)} />
    </>
  )
}
