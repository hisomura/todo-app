import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Todo from './Todo'
import { Task } from '../lib/task'
import { MockTaskRepository } from '../lib/repository'

describe('Todo.test.tsx', () => {
  afterEach(cleanup)

  test('Add and close a task. Then expand closed task list. Then Reopen a task.', async () => {
    render(<Todo repository={new MockTaskRepository()} />)

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

  test('Clear all closed tasks.', async () => {
    const repository = new MockTaskRepository()
    repository.saveTasks([
      Task.create(1, 'Wash dishes', true),
      Task.create(2, 'Clean my room', true),
      Task.create(3, 'Measure my body weight', true),
    ])

    render(<Todo repository={repository} />)

    // Make sure closed tasks exist.
    const closedTasks = screen.getAllByTestId('closed-task-item')
    expect(closedTasks).toHaveLength(3)
    closedTasks.forEach((item) => {
      expect(item).toBeInTheDocument()
    })

    // Clear all closed tasks
    userEvent.click(screen.getByTestId('clear-all-closed-tasks')) // Open a modal.
    userEvent.click(await screen.findByText('Clear'))
    expect(screen.queryByTestId('closed-task-item')).not.toBeInTheDocument()
    expect(repository.getTasks()).toEqual([])
  })
})
