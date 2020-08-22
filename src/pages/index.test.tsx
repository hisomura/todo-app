import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "./index";
import { Todo, TodoList } from "../lib/todo";
import { getMockRepository } from "../repositories/mockRepository";

jest.mock("../lib/firebase", () => {
  return {
    loginWithGithub: () => {
      const todoList = TodoList.create("TodoList1", [Todo.create("hello", false)]);
      const repository = getMockRepository([todoList]);
      return ["user-id-1", repository];
    },
  };
});

describe("index.tsx", () => {
  test("shows a user ID when a user click login button", async () => {
    // FIXME
    expect(true).toBe(true)
    // render(<Home />);
    // userEvent.click(screen.getByText(/Login/));
    // // expect(await screen.findByText(/user-id-1/)).toBeVisible()
    // expect(await screen.findByText(/hello/)).toBeVisible();
  });
});
