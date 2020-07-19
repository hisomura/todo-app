import React from 'react'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Todo from './Todo'

afterEach(cleanup)

test('Add and close a task.', async () => {
  render(<Todo />)

  // Add a task.
  expect(screen.queryByText(/Add Test/)).toBeNull()
  await userEvent.type(screen.getByRole('textbox'), 'Add Test.{enter}')
  expect(await screen.findByText(/Add Test/)).toBeInTheDocument()

  // Close a task.
  expect(screen.queryByTestId('closed-task-item')).toBeNull()
  expect(screen.getByTestId('open-task-item')).toBeInTheDocument()
  const checkBoxList = screen.getAllByRole('checkbox')
  userEvent.click(checkBoxList[0])
  expect(await screen.findByTestId('closed-task-item')).toBeInTheDocument()
  expect(screen.queryByTestId('open-task-item')).toBeNull()
})

test('Add and close a task by drag and drop.', async () => {
  render(<Todo />)

  // Add a task.
  expect(screen.queryByText(/Add Test/)).toBeNull()
  await userEvent.type(screen.getByRole('textbox'), 'Add Test.{enter}')
  expect(await screen.findByText(/Add Test/)).toBeInTheDocument()

  // Close a task.
  const taskItem = screen.queryByTestId('open-task-item')
  if (!taskItem) throw new Error('taskItem is null')
  const dragTarget = screen.queryByTestId('closed-task-area')
  if (!dragTarget) throw new Error('dragTarget is null')
  fireEvent.dragStart(taskItem)
  fireEvent.drop(dragTarget)

  expect(await screen.findByTestId('closed-task-item')).toBeInTheDocument()
  expect(screen.queryByTestId('open-task-item')).toBeNull()
})
