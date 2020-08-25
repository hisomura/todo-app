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

  const deleteTodoList = (list: TodoList) => {
    setTodoLists(todoLists.filter((l) => l.id !== list.id));
    writer.deleteTodoList(list.id);
  };

  return (
    <div className="flex">
      {todoLists.map((list) => {
        return <TodoListContainer key={list.id} list={list} onDelete={deleteTodoList} />;
      })}
      <NewTodoList addNewTodoList={addTodoList} />
    </div>
  );
}
