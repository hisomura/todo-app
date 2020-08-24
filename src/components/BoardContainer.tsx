import TodoListContainer from "./TodoListContainer";
import NewTodoList from "./NewTodoList";
import React, { useState } from "react";
import { TodoList } from "../lib/todo";
import { useRepositoryWriter } from "../repositories/ReposiotryProvider";

type Props = {
  todoLists: TodoList[];
};

export default function BoardContainer(props: Props) {
  const [todoLists, setTodoLists] = useState(props.todoLists);
  const writer = useRepositoryWriter();

  const addTodoList = (name: string) => {
    const newTodoList = TodoList.create(name, []);
    setTodoLists([...todoLists, newTodoList]);
    writer.storeTodoList(newTodoList);
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
