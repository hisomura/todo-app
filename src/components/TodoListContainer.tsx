import React from "react";
import OpenTodoList from "./open/OpenTodoList";
import ClosedTodoList from "./closed/ClosedTodoList";
import InputTodo from "./InputTodo";
import { TodoList } from "../lib/todo";

type Props = {
  list: TodoList;
};

export default function TodoListContainer(props: Props) {
  return (
    <>
      <div className="mx-6 pt-2 z-0">
        <div className="w-96 shadow-xl rounded px-4 pb-4">
          <div className="pt-4">
            <h1>{props.list.name}</h1>
          </div>
          <InputTodo />
          <OpenTodoList />
          <ClosedTodoList />
        </div>
      </div>
    </>
  );
}
