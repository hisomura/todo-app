import React, { ChangeEventHandler, DragEventHandler, KeyboardEventHandler, MouseEvent, useState } from 'react'
import cn from 'classnames'
import { MdClearAll } from 'react-icons/md'
import { Task } from '../lib/task'
import { moved } from '../lib/array'
import ToggleExpandIcon from '../components/ToggleExpandIcon'
import OpenTaskItem from '../components/OpenTaskItem'
import ClosedTaskItem from '../components/ClosedTaskItem'

const preventDefault: DragEventHandler = (event) => event.preventDefault()

export default function Todo() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [formText, setFormText] = useState('')
  const [foldingClosedTasks, setFoldingClosedTasks] = useState(true)
  const [draggedTaskNextIndex, setDraggedTaskNextIndex] = useState<number | null>(null)
  const [draggedTaskId, setDraggedTaskId] = useState<number | null>(null)

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    // https://developer.mozilla.org/ja/docs/Web/API/Event/currentTarget
    setFormText(event.currentTarget.value)
  }

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // if (event.keyCode === 229) return
    if (event.key !== 'Enter') return
    if (formText === '') return
    event.currentTarget.value = ''
    setTasks([...tasks, Task.create(formText)])
    setFormText('')
  }

  const toggleTask = (event: MouseEvent<HTMLInputElement>, target: Task) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== target.id) return task
      return { ...task, closed: event.currentTarget.checked }
    })
    setTasks(newTasks)
  }

  const clearTask = (_event: MouseEvent<HTMLElement>, target: Task) => {
    setTasks(tasks.filter((task) => task.id !== target.id))
  }

  const moveTask = (taskId: number, targetIndex: number) => {
    const taskIndex = tasks.findIndex((t) => t.id === taskId)
    const result = moved(tasks, taskIndex, targetIndex)
    console.log(result)
    setTasks(result)
    setDraggedTaskNextIndex(null)
    setDraggedTaskId(null)
  }

  return (
    <div className="max-w-xl mx-auto py-8">
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
            if (draggedTaskId !== null && draggedTaskNextIndex !== null) moveTask(draggedTaskId, draggedTaskNextIndex)
          }}
        >
          <ul>
            <li className="py-2">
              + <input className="focus:outline-none ml-1" onKeyDown={onKeyDown} onChange={onChange} type="text" />
            </li>
            {tasks
              .filter((task) => !task.closed)
              .map((task, index) => (
                <OpenTaskItem
                  key={task.id}
                  task={task}
                  index={index}
                  toggleTask={toggleTask}
                  isNext={index === draggedTaskNextIndex}
                  setDraggedTaskNextIndex={setDraggedTaskNextIndex}
                  setDraggedTaskId={setDraggedTaskId}
                />
              ))}
            <li className={draggedTaskNextIndex === tasks.length ? 'border-t-2 border-blue-500' : 'border-t'} />
          </ul>
        </div>

        <div data-testid="closed-task-area">
          <div className="mt-2 py-1 flex justify-between">
            <h2>closed</h2>
            <div className="ml-auto mr-2" onClick={() => setTasks(tasks.filter((item) => !item.closed))}>
              <MdClearAll />
            </div>
            <ToggleExpandIcon
              expanded={foldingClosedTasks}
              onClick={() => setFoldingClosedTasks(!foldingClosedTasks)}
            />
          </div>
          <ul className={cn({ 'divide-y': true, hidden: foldingClosedTasks })}>
            {tasks
              .filter((task) => task.closed)
              .map((task) => (
                <ClosedTaskItem key={task.id} task={task} toggleTask={toggleTask} clearTask={clearTask} />
              ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
