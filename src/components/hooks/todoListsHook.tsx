import React, { useState } from "react";
import { moveTodoToAnotherList, Todo, TodoList } from "../../lib/todo";
import { RepositoryWriter } from "../../repositories/repository";

type TodoListsHooks = ReturnType<typeof useTodoLists>;
const TodoListsContext = React.createContext<undefined | TodoListsHooks>(undefined);

type Props = {
  children: any;
  todoListsHooks: TodoListsHooks;
};

function TodoListsContextProvider({ children, todoListsHooks }: Props) {
  return <TodoListsContext.Provider value={todoListsHooks}>{children}</TodoListsContext.Provider>;
}

function useTodoListsContext() {
  const context = React.useContext(TodoListsContext);
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

export { TodoListsContextProvider, useTodoListsContext, useTodoLists };
