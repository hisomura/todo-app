import { ChangeEventHandler, KeyboardEventHandler, MouseEvent, useState } from 'react'

export default function Home() {
  const [tasks, setTasks] = useState([
    'Show Tasks',
    'Add a task',
    'Close a task',
    'Open a task',
    'Remove a task',
    'Drag and Drop a task',
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
    setTasks([...tasks, formText])
    setFormText('')
  }

  const onClick = (event: MouseEvent<HTMLInputElement>, taskIndex: number) => {
    const newTasks = tasks.filter((task, index) => index !== taskIndex)
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
          {tasks.map((task, index) => (
            <li key={index} className="flex py-2">
              <input className="my-auto mr-2" type="checkbox" onClick={(e) => onClick(e, index)} />
              <p>{task}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
