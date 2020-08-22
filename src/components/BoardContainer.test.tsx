import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import { Todo, TodoList } from "../lib/todo";
import { RepositoryWriterProvider } from "../repositories/ReposiotryProvider";
import BoardContainer from "./BoardContainer";
import { getLocalStorageRepository } from "../repositories/localStorageRepository";
import userEvent from "@testing-library/user-event";

describe("BoardContainer.tsx", () => {
  afterEach(cleanup);

  function setInitialLocalStorageData(todoLists: TodoList[]) {
    const { writer } = getLocalStorageRepository();
    todoLists.forEach((list) => writer.storeTodoList(list));
  }

  test("shows todo list title and its todo title.", async () => {
    const todoList = TodoList.create("TodoList1", [Todo.create("Foobar")]);
    setInitialLocalStorageData([todoList]);
    const { reader, writer } = getLocalStorageRepository();
    render(
      <RepositoryWriterProvider writer={writer}>
        <BoardContainer todoLists={reader.getTodoLists()} />
      </RepositoryWriterProvider>
    );

    // Add a todo
    expect(screen.getByText(/TodoList1/)).toBeVisible();
    expect(screen.getByText(/Foobar/)).toBeVisible();
    expect(screen.getByText(/New Todo List/)).toBeVisible();
  });

  test("adds new todo list.", async () => {
    const todoList = TodoList.create("TodoList1", [Todo.create("Foobar")]);
    setInitialLocalStorageData([todoList]);
    const { reader, writer } = getLocalStorageRepository();
    render(
      <RepositoryWriterProvider writer={writer}>
        <BoardContainer todoLists={reader.getTodoLists()} />
      </RepositoryWriterProvider>
    );

    expect(screen.queryByText(/NewTodoList/)).not.toBeInTheDocument();
    userEvent.click(screen.getByTestId("add-new-todo-list"));
    expect(await screen.findByText(/NewTodoList/)).toBeVisible();
  });
});
