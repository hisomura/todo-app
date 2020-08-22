import TodoListContainer from "./TodoListContainer";
import NewTodoList from "./NewTodoList";
import React, { useState } from "react";
import { TodoList } from "../lib/todo";

type Props = {
  todoLists: TodoList[];
};

export default function BoardContainer(props: Props) {
  const [todoLists, setTodoLists] = useState(props.todoLists);

  const addTodoList = () => {
    setTodoLists([...todoLists, TodoList.create("NewTodoList" + Math.random().toString().slice(5), [])]);
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
