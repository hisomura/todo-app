export default function Home() {
  const todoList = ['List items', 'Add item', 'Remove todo']

  return (
    <div>
      <ul>
        {todoList.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </div>
  )
}
