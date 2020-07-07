import React from 'react'
import { render, screen } from '@testing-library/react'
import Home from './index'

test('renders a message', () => {
  render(<Home />)
  screen.getByText('Todo');
  // screen.debug()
})
