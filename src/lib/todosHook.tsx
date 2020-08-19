import React, { useEffect, useState } from "react";
import { Todo, TodoList } from "./todo";
import { moved } from "./array";
import { RepositoryWriter } from "../repositories/repository";

type TodosState = {
  openTodos: Todo[];
  closedTodos: Todo[];
  dropTargetIndex: number | null;
};

const TodoStateContext = React.createContext<undefined | ReturnType<typeof useTodos>>(undefined);

function useTodos(writer: RepositoryWriter, todoList: TodoList) {
  const [state, setTodoStatus] = useState<TodosState>({
    openTodos: todoList.todos.filter((t) => !t.closed),
    closedTodos: todoList.todos.filter((t) => t.closed),
    dropTargetIndex: null,
  });

  const addTodo = (todo: Todo) => setTodoStatus({ ...state, openTodos: [todo, ...state.openTodos] });

  const closeTodo = (todo: Todo) => {
    setTodoStatus({
      ...state,
      openTodos: state.openTodos.filter((t) => t.id !== todo.id),
      closedTodos: [...state.closedTodos, todo],
    });
  };

  const reopenTodo = (todo: Todo) => {
    setTodoStatus({
      ...state,
      openTodos: [...state.openTodos, todo],
      closedTodos: state.closedTodos.filter((t) => t.id !== todo.id),
    });
  };

  const clearTodo = (todo: Todo) =>
    setTodoStatus({ ...state, closedTodos: state.closedTodos.filter((t) => t.id !== todo.id) });

  const clearAllClosedTodos = () => setTodoStatus({ ...state, closedTodos: [] });

  const moveTodo = (todo: Todo) => {
    if (state.dropTargetIndex === null) throw new Error("DropTargetIndex is empty.");
    const todoIndex = state.openTodos.findIndex((t) => t.id === todo.id);
    if (todoIndex === undefined) throw new Error(`Todo(${todo.id}) not exists.`);
    setTodoStatus({
      ...state,
      openTodos: moved(state.openTodos, todoIndex, state.dropTargetIndex),
      dropTargetIndex: null,
    });
  };

  const setDropTargetIndex = (nextIndex: number | null) => {
    if (state.dropTargetIndex === nextIndex) return;
    if (nextIndex && (nextIndex < 0 || state.openTodos.length + 1 < nextIndex))
      throw new Error(`${nextIndex} is out of bounds.`);

    setTodoStatus({ ...state, dropTargetIndex: nextIndex });
  };

  useEffect(() => writer.storeTodos([...state.openTodos, ...state.closedTodos], todoList.id), [state]);

  useEffect(() => {
    setTodoStatus({
      openTodos: todoList.todos.filter((t) => !t.closed),
      closedTodos: todoList.todos.filter((t) => t.closed),
      dropTargetIndex: null,
    });
  }, [writer, todoList]);

  return {
    ...state,
    setTodoStatus,
    addTodo,
    closeTodo,
    reopenTodo,
    clearTodo,
    clearAllClosedTodos,
    moveTodo,
    setDropTargetIndex,
  };
}

type Props = {
  children: any;
  writer: RepositoryWriter;
  todoList: TodoList;
};

function TodosProvider({ children, writer, todoList }: Props) {
  const todos = useTodos(writer, todoList);

  return <TodoStateContext.Provider value={todos}>{children}</TodoStateContext.Provider>;
}

function useTodosHook() {
  const context = React.useContext(TodoStateContext);
  if (context === undefined) {
    throw new Error("useTodoListFromContext must be used within a TodoListProvider");
  }
  return context;
}

export { TodosProvider, useTodosHook, useTodos };
