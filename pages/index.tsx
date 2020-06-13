import { ChangeEventHandler, KeyboardEventHandler, MouseEvent, useState } from 'react'

export default function Home() {
  const [todoList, setTodoList] = useState(['List items', 'Add item', 'Remove todo'])
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
    setTodoList([...todoList, formText])
    setFormText('')
  }

  const onClick = (event: MouseEvent<HTMLButtonElement>, todoIndex: number) => {
    const newTodoList = todoList.filter((item, index) => index !== todoIndex)
    setTodoList(newTodoList)
  }

  return (
    <div>
      <h1 className="text-xl bg-gray-200">Todo List</h1>
      <ul>
        {todoList.map((item, index) => (
          <li key={index}>
            {item}
            <button
              onClick={(e) => {
                onClick(e, index)
              }}
            >
              remove
            </button>
          </li>
        ))}
      </ul>
      <input onKeyDown={onKeyDown} onChange={onChange} type="text" />
    </div>
  )
}
