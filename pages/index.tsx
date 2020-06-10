import { KeyboardEventHandler, useState } from 'react'

export default function Home() {
  const [todoList, setTodo] = useState(['List items', 'Add item', 'Remove todo']);

  const addItem: KeyboardEventHandler<HTMLInputElement> = (event) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // if (event.keyCode === 229) return
    if (event.key === 'Process') return
    if (event.key === 'Enter') {
      setTodo([...todoList, 'New todo'])
    }
    console.log(event.key)
  }

  return (
    <div>
      <ul>
        {todoList.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
      <input onKeyDown={addItem} type="text" />
    </div>
  )
}
