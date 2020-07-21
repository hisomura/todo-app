import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
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
