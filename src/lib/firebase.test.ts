import { Todo } from './todo'
import {convertDatabaseTodos, convertTodosForDatabase} from './firebase'

describe('convertTodosForDatabase', () => {
  test('convert Todos to DatabaseTodos', () => {
    const todos: Todo[] = [
      { key: 'key1', name: 'hello', closed: false },
      { key: 'key2', name: 'hello, world', closed: true },
      { key: 'key3', name: 'Hi', closed: false },
    ]

    const databaseTodos = convertTodosForDatabase(todos)

    expect(databaseTodos).toEqual({
      key1: { name: 'hello', closed: false },
      key2: { name: 'hello, world', closed: true },
      key3: { name: 'Hi', closed: false },
    })
  })

  test('convert [] to {}', () => {
    const databaseTodos = convertTodosForDatabase([])
    expect(databaseTodos).toEqual({})
  })
})

describe('convertDatabaseTodosToTodos', () => {
  test('convert DatabaseTodos to Todos', () => {
    const databaseTodos = {
      key1: { name: 'hello', closed: false },
      key2: { name: 'hello, world', closed: true },
      key3: { name: 'Hi', closed: false },
    }

    const todos = convertDatabaseTodos(databaseTodos)
    expect(todos).toEqual([
      { key: 'key1', name: 'hello', closed: false },
      { key: 'key2', name: 'hello, world', closed: true },
      { key: 'key3', name: 'Hi', closed: false },
    ])
  })

  test('convert {} to []', () => {
    const firebaseTodos = convertDatabaseTodos({})
    expect(firebaseTodos).toEqual([])
  })
})
