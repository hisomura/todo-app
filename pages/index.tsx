import React from 'react';
import { ChangeEventHandler, KeyboardEventHandler, MouseEvent, useState } from 'react'
import cn from 'classnames'
import ToggleExpandIcon from '../components/ToggleExpandIcon'
import { MdClearAll } from 'react-icons/md'
import TaskItem from '../components/TaskItem'
import { Task } from '../lib/task'

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    Task.create('Show tasks', true),
    Task.create('Add a task', true),
    Task.create('Close a task', true),
    Task.create('Reopen a task', true),
    Task.create('Filter tasks by closed', true),
    Task.create('Folding closed tasks', true),
    Task.create('Clear a closed task', true),
    Task.create('Clear all closed task', true),
    Task.create('Drag and Drop a task'),
  ])
  const [formText, setFormText] = useState('')
  const [foldingClosedTasks, setFoldingClosedTasks] = useState(true)

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

  const clearTask = (event: MouseEvent<HTMLElement>, target: Task) => {
    setTasks(tasks.filter((task) => task.id !== target.id))
  }

  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="shadow-xl rounded px-4 pb-4">
        <div className="py-4">
          <h1>Todo</h1>
        </div>
        <ul className="divide-y">
          <li className="py-2">
            + <input className="focus:outline-none ml-1" onKeyDown={onKeyDown} onChange={onChange} type="text" />
          </li>
          {tasks
            .filter((task) => !task.closed)
            .map((task, index) => (
              <TaskItem key={task.id} task={task} index={index} toggleTask={toggleTask} />
            ))}
        </ul>

        <div className="mt-2 py-1 flex justify-between">
          <h2>closed</h2>
          <div className="ml-auto mr-2" onClick={() => setTasks(tasks.filter((item) => !item.closed))}>
            <MdClearAll />
          </div>
          <ToggleExpandIcon expanded={foldingClosedTasks} onClick={() => setFoldingClosedTasks(!foldingClosedTasks)} />
        </div>
        <ul className={cn({ 'divide-y': true, hidden: foldingClosedTasks })}>
          {tasks
            .filter((task) => task.closed)
            .map((task, index) => (
              <TaskItem key={task.id} task={task} index={index} toggleTask={toggleTask} clearTask={clearTask} />
            ))}
        </ul>
      </div>
    </div>
  )
}
