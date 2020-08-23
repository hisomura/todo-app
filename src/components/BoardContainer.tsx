import TodoListContainer from "./TodoListContainer";
import NewTodoList from "./NewTodoList";
import React, { useState } from "react";
import { TodoList } from "../lib/todo";

type Props = {
  todoLists: TodoList[];
};

export default function BoardContainer(props: Props) {
  const [todoLists, setTodoLists] = useState(props.todoLists);

  const addTodoList = (name: string) => {
    setTodoLists([...todoLists, TodoList.create(name, [])]);
  };

  return (
    <div className="flex">
      {todoLists.map((list) => {
        return <TodoListContainer key={list.id} list={list} />;
      })}
      <NewTodoList addNewTodoList={addTodoList} />
    </div>
  );
}
