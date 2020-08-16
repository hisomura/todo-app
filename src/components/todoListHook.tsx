import React, { useEffect, useState } from "react";
import { Todo } from "../lib/todo";
import { TodoRepository } from "../lib/repository";
import { moved } from "../lib/array";

type TodosState = {
  openTodos: Todo[];
  closedTodos: Todo[];
  dropTargetIndex: number | null;
};

const TodoStateContext = React.createContext<undefined | ReturnType<typeof useTodoList>>(undefined);

function useTodoList(repository: TodoRepository) {
  const [state, setTodoStatus] = useState<TodosState>({
    openTodos: repository.getOpenTodos(),
    closedTodos: repository.getClosedTodos(),
    dropTargetIndex: null,
  });

  const addTodo = (todo: Todo) => setTodoStatus({ ...state, openTodos: [todo, ...state.openTodos] });

  const closeTodo = (todo: Todo) => {
    setTodoStatus({
      ...state,
      openTodos: state.openTodos.filter((t) => t.key !== todo.key),
      closedTodos: [...state.closedTodos, todo],
    });
  };

  const reopenTodo = (todo: Todo) => {
    setTodoStatus({
      ...state,
      openTodos: [...state.openTodos, todo],
      closedTodos: state.closedTodos.filter((t) => t.key !== todo.key),
    });
  };

  const clearTodo = (todo: Todo) =>
    setTodoStatus({ ...state, closedTodos: state.closedTodos.filter((t) => t.key !== todo.key) });

  const clearAllClosedTodos = () => setTodoStatus({ ...state, closedTodos: [] });

  const moveTodo = (todo: Todo) => {
    if (state.dropTargetIndex === null) throw new Error("DropTargetIndex is empty.");
    const todoIndex = state.openTodos.findIndex((t) => t.key === todo.key);
    if (todoIndex === undefined) throw new Error(`Todo(${todo.key}) not exists.`);
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

  useEffect(() => repository.saveTodos([...state.openTodos, ...state.closedTodos]), [state]);

  useEffect(() => {
    setTodoStatus({
      openTodos: repository.getOpenTodos(),
      closedTodos: repository.getClosedTodos(),
      dropTargetIndex: null,
    });
  }, [repository]);

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
  repository: TodoRepository;
};

function TodoListProvider({ children, repository }: Props) {
  const todoList = useTodoList(repository);

  return <TodoStateContext.Provider value={todoList}>{children}</TodoStateContext.Provider>;
}

function useTodoListFromContext() {
  const context = React.useContext(TodoStateContext);
  if (context === undefined) {
    throw new Error("useTodoListFromContext must be used within a TodoListProvider");
  }
  return context;
}

export { TodoListProvider, useTodoListFromContext, useTodoList };
