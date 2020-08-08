import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoList from './TodoList'
import { Todo } from '../lib/todo'
import { MockTodoRepository } from '../lib/repository'

describe('Todo.test.tsx', () => {
  afterEach(cleanup)

  test('Add and close a todo. Then expand closed todo list. Then Reopen a todo.', async () => {
    render(<TodoList repository={new MockTodoRepository()} />)

    // Add a todo
    expect(screen.queryByText(/Add Test/)).toBeNull()
    await userEvent.type(screen.getByRole('textbox'), 'Add Test.{enter}')
    expect(await screen.findByText(/Add Test/)).toBeInTheDocument()

    // Close a todo
    expect(screen.queryByTestId('closed-todo-item')).toBeNull()
    expect(screen.getByTestId('open-todo-item')).toBeVisible()
    userEvent.click(screen.getByRole('checkbox'))
    expect(screen.queryByTestId('open-todo-item')).toBeNull()
    const closedTodoItem = await screen.findByTestId('closed-todo-item')
    expect(closedTodoItem).toBeInTheDocument()
    expect(closedTodoItem).not.toBeVisible()

    // Expand closed todo list
    const toggleFoldingClosedTodosButton = screen.getByTestId('toggle-folding-closed-todos-button')
    userEvent.click(toggleFoldingClosedTodosButton)
    expect(await screen.findByTestId('closed-todo-item')).toBeVisible()

    // Reopen a todo
    userEvent.click(screen.getByRole('checkbox'))
    expect(await screen.findByTestId('open-todo-item')).toBeVisible()
    expect(screen.queryByTestId('closed-todo-item')).not.toBeInTheDocument()
  })

  test('Clear all closed todos.', async () => {
    const repository = new MockTodoRepository()
    repository.saveTodos([
      Todo.create('Wash dishes', true),
      Todo.create('Clean my room', true),
      Todo.create('Measure my body weight', true),
    ])

    render(<TodoList repository={repository} />)

    // Make sure closed todos exist.
    const closedTodos = screen.getAllByTestId('closed-todo-item')
    expect(closedTodos).toHaveLength(3)
    closedTodos.forEach((item) => {
      expect(item).toBeInTheDocument()
    })

    // Clear all closed todos
    userEvent.click(screen.getByTestId('clear-all-closed-todos')) // Open a modal.
    userEvent.click(await screen.findByText('Clear'))
    expect(screen.queryByTestId('closed-todo-item')).not.toBeInTheDocument()
    expect(repository.getTodos()).toEqual([])
  })
})
