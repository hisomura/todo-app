import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Home from './index'
import { MockTodoRepository } from '../lib/repository'
import { Todo } from '../lib/todo'

jest.mock('../lib/firebase', () => {
  return {
    loginWithGithub: () => {
      const repository = new MockTodoRepository()
      repository.saveTodos([Todo.create('hello', false)])
      return ['user-id-1', repository]
    },
  }
})

describe('index.tsx', () => {
  afterEach(cleanup)

  test('shows title.', async () => {
    render(<Home />)
    expect(screen.getByText(/Todo/)).toBeVisible()
  })

  test('shows a user ID when a user click sign-in button.', async () => {
    render(<Home />)
    userEvent.click(screen.getByText(/Sign in/))
    expect(await screen.findByText(/user-id-1/)).toBeVisible()
    expect(await screen.findByText(/hello/)).toBeVisible()
  })
})
