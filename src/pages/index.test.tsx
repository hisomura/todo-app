import { cleanup, render, screen } from '@testing-library/react'
import React from "react";
import Home from "./index";

describe('index.tsx', () => {
  afterEach(cleanup)

  test('shows title.', async () => {
    render(<Home />)
    expect(screen.getByText(/Todo/)).toBeVisible()
  })
})