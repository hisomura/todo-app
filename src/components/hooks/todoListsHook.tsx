import React, { useState } from "react";
import { moveTodoToAnotherList, Todo, TodoList } from "../../lib/todo";
import { RepositoryWriter } from "../../repositories/repository";

const TodoStateContext = React.createContext<undefined | ReturnType<typeof useTodoLists>>(undefined);

type Props = {
  children: any;
  writer: RepositoryWriter;
  todoLists: TodoList[];
};

function TodoListsProvider({ children, writer, todoLists }: Props) {
  const todos = useTodoLists(writer, todoLists);

  return <TodoStateContext.Provider value={todos}>{children}</TodoStateContext.Provider>;
}

function useTodoListsContext() {
  const context = React.useContext(TodoStateContext);
  if (context === undefined) {
    throw new Error("useTodoListFromContext must be used within a TodoListProvider");
  }
  return context;
}

function useTodoLists(writer: RepositoryWriter, initialTodoLists: TodoList[]) {
  const [todoLists, setTodoLists] = useState(initialTodoLists);

  const addTodoList = (name: string) => {
    const newTodoList = TodoList.create(name, []);
    setTodoLists([...todoLists, newTodoList]);
    writer.storeTodoList(newTodoList);
  };

  const deleteTodoList = (list: TodoList) => {
    setTodoLists(todoLists.filter((l) => l.id !== list.id));
    writer.deleteTodoList(list.id);
  };

  const moveTodo = (todo: Todo, fromList: TodoList, toList: TodoList) =>
    setTodoLists(moveTodoToAnotherList(todo, todoLists, fromList, toList));

  return { todoLists, addTodoList, deleteTodoList, moveTodo };
}

export { TodoListsProvider, useTodoListsContext, useTodoLists };
