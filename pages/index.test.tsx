import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from './index'

test('renders a message', () => {
  render(<Home />)
  screen.getByText('Todo')
  expect(screen.getByRole('textbox')).toBeInTheDocument()
  // screen.debug()
})
