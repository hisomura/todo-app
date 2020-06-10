import { ChangeEventHandler, KeyboardEventHandler, useState } from 'react'

export default function Home() {
  const [todoList, setTodo] = useState(['List items', 'Add item', 'Remove todo'])
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
    setTodo([...todoList, formText])
    setFormText('')
  }

  return (
    <div>
      <ul>
        {todoList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      <input onKeyDown={onKeyDown} onChange={onChange} type="text" />
    </div>
  )
}
