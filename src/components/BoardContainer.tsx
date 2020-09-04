import TodoListContainer from "./TodoListContainer";
import NewTodoList from "./NewTodoList";
import React from "react";
import { TodoList } from "../lib/todo";
import { useRepositoryWriter } from "../repositories/ReposiotryProvider";
import { TodoListsContextProvider, useTodoLists } from "./hooks/todoListsHook";

type Props = {
  todoLists: TodoList[];
};

export default function BoardContainer(props: Props) {
  const writer = useRepositoryWriter();
  const hooks = useTodoLists(writer, props.todoLists);

  return (
    <TodoListsContextProvider todoListsHooks={hooks}>
      <div className="flex">
        {hooks.todoLists.map((list) => {
          return <TodoListContainer key={list.id} list={list} onDelete={hooks.deleteTodoList} />;
        })}
        <NewTodoList addNewTodoList={hooks.addTodoList} />
      </div>
    </TodoListsContextProvider>
  );
}
