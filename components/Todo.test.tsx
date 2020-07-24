import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Todo from './Todo'

describe('Todo.test.tsx', () => {
  afterEach(cleanup)

  test('Add and close a task. Then expand closed task list. Then Reopen a task.', async () => {
    render(<Todo />)

    // Add a task
    expect(screen.queryByText(/Add Test/)).toBeNull()
    await userEvent.type(screen.getByRole('textbox'), 'Add Test.{enter}')
    expect(await screen.findByText(/Add Test/)).toBeInTheDocument()

    // Close a task
    expect(screen.queryByTestId('closed-task-item')).toBeNull()
    expect(screen.getByTestId('open-task-item')).toBeVisible()
    userEvent.click(screen.getByRole('checkbox'))
    expect(screen.queryByTestId('open-task-item')).toBeNull()
    const closedTaskItem = await screen.findByTestId('closed-task-item')
    expect(closedTaskItem).toBeInTheDocument()
    expect(closedTaskItem).not.toBeVisible()

    // Expand closed task list
    const toggleFoldingClosedTasksButton = screen.getByTestId('toggle-folding-closed-tasks-button')
    userEvent.click(toggleFoldingClosedTasksButton)
    expect(await screen.findByTestId('closed-task-item')).toBeVisible()

    // Reopen a task
    userEvent.click(screen.getByRole('checkbox'))
    expect(await screen.findByTestId('open-task-item')).toBeVisible()
    expect(screen.queryByTestId('closed-task-item')).not.toBeInTheDocument()
  })

  test('Add two tasks and clear all.', async () => {
    render(<Todo />)

    // Add two tasks
    await userEvent.type(screen.getByRole('textbox'), 'Wash dishes.{enter}')
    await userEvent.type(screen.getByRole('textbox'), 'Clean my room.{enter}')

    // Close tasks
    const checkBoxList = screen.getAllByRole('checkbox')
    expect(checkBoxList).toHaveLength(2)
    userEvent.click(checkBoxList[0])
    userEvent.click(checkBoxList[1])

    // Expand closed task list
    expect((await screen.getAllByTestId('closed-task-item'))[0]).not.toBeVisible()
    userEvent.click(screen.getByTestId('toggle-folding-closed-tasks-button'))
    screen.getAllByTestId('closed-task-item').forEach((item) => {
      expect(item).toBeVisible()
    })

    // Clear all closed tasks
    userEvent.click(screen.getByTestId('clear-all-closed-tasks'))
    expect(screen.queryByTestId('closed-task-item')).not.toBeInTheDocument()
  })
})
