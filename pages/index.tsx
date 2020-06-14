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

  const onClick = (event: MouseEvent<HTMLInputElement>, todoIndex: number) => {
    const newTodoList = todoList.filter((item, index) => index !== todoIndex)
    setTodoList(newTodoList)
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
          {todoList.map((item, index) => (
            <li key={index} className="flex py-2">
              <input className="my-auto mr-2" type="checkbox" onClick={(e) => onClick(e, index)} />
              <p>{item}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
