import React from "react";
import { render, screen } from "@testing-library/react";
import { Todo, TodoList } from "../lib/todo";
import { RepositoryWriterProvider } from "../repositories/ReposiotryProvider";
import BoardContainer from "./BoardContainer";
import { getLocalStorageRepository } from "../repositories/localStorageRepository";
import userEvent from "@testing-library/user-event";

describe("BoardContainer.tsx", () => {
  function setInitialLocalStorageData(todoLists: TodoList[]) {
    const { writer } = getLocalStorageRepository();
    todoLists.forEach((list) => writer.storeTodoList(list));
  }

  beforeEach(() => {
    const { writer } = getLocalStorageRepository();
    writer.clearAll();
  })

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
    screen.getAllByText(/TodoList1/);
    screen.getAllByText(/Foobar/);
    screen.getAllByText(/New Todo List/);
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
    await userEvent.type(document.activeElement!, "NewTodoList{enter}");
    await screen.findAllByText(/NewTodoList/);
  });

  test("Removes a todo list.", async () => {
    const todoList = TodoList.create("TodoList1", [Todo.create("Foobar")]);
    setInitialLocalStorageData([todoList]);
    const { reader, writer } = getLocalStorageRepository();
    render(
      <RepositoryWriterProvider writer={writer}>
        <BoardContainer todoLists={reader.getTodoLists()} />
      </RepositoryWriterProvider>
    );

    screen.getAllByText(/TodoList1/);
    userEvent.click(screen.getByTestId("open-delete-todo-list-modal"));
    userEvent.click(await screen.findByRole("button", { name: "Delete" }));
    expect(screen.queryByText(/TodoList1/)).not.toBeInTheDocument();
  });
});
