import { cleanup, render, screen } from '@testing-library/react'
import React from "react";
import Home from "./index";
import userEvent from "@testing-library/user-event";

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
  })
})