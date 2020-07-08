import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from './index'

test('Add Task.', async () => {
  render(<Home />)
  await userEvent.type(screen.getByRole('textbox'), 'Add Test.{enter}')
  expect(await screen.findByText(/Add Test/)).toBeInTheDocument()
})
