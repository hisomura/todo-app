import React from 'react'
import { render, screen, cleanup } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from './index'

afterEach(cleanup)

test('Add and close a task.', async () => {
  render(<Home />)

  // Add a task.
  expect(screen.queryByText(/Add Test/)).toBeNull()
  await userEvent.type(screen.getByRole('textbox'), 'Add Test.{enter}')
  expect(await screen.findByText(/Add Test/)).toBeInTheDocument()

  // Close a task.
  expect(screen.queryByTestId('task-item-closed')).toBeNull()
  expect(screen.getByTestId('task-item-open')).toBeInTheDocument()
  const checkBoxList = screen.getAllByRole('checkbox')
  userEvent.click(checkBoxList[0])
  expect(await screen.findByTestId('task-item-closed')).toBeInTheDocument()
  expect(screen.queryByTestId('task-item-open')).toBeNull()
})
