import { ChangeEventHandler, KeyboardEventHandler, MouseEvent, useState } from 'react'
import cn from 'classnames'

type Task = {
  id: number
  name: string
  closed: boolean
}

const Task = {
  lastId: 0,
  id: () => {
    Task.lastId += 1
    return Task.lastId
  },
  create: (name: string, closed = false): Task => {
    return {
      id: Task.id(),
      name,
      closed,
    }
  },
}

export default function Home() {
  const [tasks, setTasks] = useState<Task[]>([
    Task.create('Show tasks', true),
    Task.create('Add a task', true),
    Task.create('Close a task', true),
    Task.create('Reopen a task', true),
    Task.create('Filter tasks by closed', true),
    Task.create('Add a tag'),
    Task.create('Remove a tag'),
    Task.create('Filter tasks by tag'),
    Task.create('Clear a task'),
    Task.create('Clear all closed task'),
    Task.create('Drag and Drop a task'),
  ])
  const [formText, setFormText] = useState('')

  const onChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    // https://developer.mozilla.org/ja/docs/Web/API/Event/currentTarget
    setFormText(event.currentTarget.value)
  }

  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // if (event.keyCode === 229) return
    if (event.key !== 'Enter') return
    event.currentTarget.value = ''
    setTasks([...tasks, Task.create(formText)])
    setFormText('')
  }

  const toggleTask = (event: MouseEvent<HTMLInputElement>, taskId: number) => {
    const newTasks = tasks.map((task) => {
      if (task.id !== taskId) return task
      return { ...task, closed: event.currentTarget.checked }
    })
    setTasks(newTasks)
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
              <li key={task.id} className="flex py-2">
                <input
                  className="my-auto mr-2"
                  type="checkbox"
                  onClick={(e) => toggleTask(e, task.id)}
                  defaultChecked={task.closed}
                />
                <p
                  className={cn({
                    'line-through': task.closed,
                  })}
                >
                  {task.name}
                </p>
              </li>
            ))}
        </ul>

        <div className="mt-2 py-1">
          <h2>closed</h2>
        </div>
        <ul className="divide-y">
          {tasks
            .filter((task) => task.closed)
            .map((task, index) => (
              <li key={task.id} className="flex py-2">
                <input
                  className="my-auto mr-2"
                  type="checkbox"
                  onClick={(e) => toggleTask(e, task.id)}
                  defaultChecked={task.closed}
                />
                <p
                  className={cn({
                    'line-through': task.closed,
                  })}
                >
                  {task.name}
                </p>
              </li>
            ))}
        </ul>
      </div>
    </div>
  )
}
