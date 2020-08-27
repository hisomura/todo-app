import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TodoListContainer from "./TodoListContainer";
import { Todo, TodoList } from "../lib/todo";
import { RepositoryWriterProvider } from "../repositories/ReposiotryProvider";
import { getMockRepository } from "../repositories/mockRepository";

describe("TodoListContainer.tsx", () => {
  test("adds and closes a todo, then expands closed todo list, then reopens a todo", async () => {
    const todoList = TodoList.create("TodoList1", []);
    const { writer } = getMockRepository([todoList]);
    render(
      <RepositoryWriterProvider writer={writer}>
        <TodoListContainer list={todoList} onDelete={() => {}}/>;
      </RepositoryWriterProvider>
    );

    // Add a todo
    expect(screen.queryByText(/Add Test/)).toBeNull();
    await userEvent.type(screen.getByRole("textbox"), "Add Test.{enter}");
    expect(await screen.findByText(/Add Test/)).toBeInTheDocument();

    // Close a todo
    expect(screen.queryByTestId("closed-todo-item")).toBeNull();
    expect(screen.getByTestId("open-todo-item")).toBeVisible();
    userEvent.click(screen.getByRole("checkbox"));
    expect(screen.queryByTestId("open-todo-item")).toBeNull();
    const closedTodoItem = await screen.findByTestId("closed-todo-item");
    expect(closedTodoItem).toBeInTheDocument();
    expect(closedTodoItem).not.toBeVisible();

    // Expand closed todo list
    const toggleFoldingClosedTodosButton = screen.getByTestId("toggle-folding-closed-todos-button");
    userEvent.click(toggleFoldingClosedTodosButton);
    expect(await screen.findByTestId("closed-todo-item")).toBeVisible();

    // Reopen a todo
    userEvent.click(screen.getByRole("checkbox"));
    expect(await screen.findByTestId("open-todo-item")).toBeVisible();
    expect(screen.queryByTestId("closed-todo-item")).not.toBeInTheDocument();
  });

  test("clears all closed todos", async () => {
    const todoList = TodoList.create("TodoList1", [
      Todo.create("Wash dishes", true),
      Todo.create("Clean my room", true),
      Todo.create("Measure my body weight", true),
    ]);
    const { writer } = getMockRepository([todoList]);
    render(
      <RepositoryWriterProvider writer={writer}>
        <TodoListContainer list={todoList} onDelete={() => {}}/>;
      </RepositoryWriterProvider>
    );

    // Make sure closed todos exist.
    const closedTodos = screen.getAllByTestId("closed-todo-item");
    expect(closedTodos).toHaveLength(3);
    closedTodos.forEach((item) => {
      expect(item).toBeInTheDocument();
    });

    // Clear all closed todos
    userEvent.click(screen.getByTestId("clear-all-closed-todos")); // Open a modal.
    userEvent.click(await screen.findByText("Clear"));
    expect(screen.queryByTestId("closed-todo-item")).not.toBeInTheDocument();
    // FIXME assert writer clear method called.
  });
});
