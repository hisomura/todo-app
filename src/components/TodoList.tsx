import React from "react";
import OpenTodoList from "./open/OpenTodoList";
import ClosedTodoList from "./closed/ClosedTodoList";
import { TodoRepository } from "../lib/repository";
import { TodoListProvider } from "../lib/todoListHook";
import InputTodo from "./InputTodo";

type Props = {
  repository: TodoRepository;
};

export default function TodoList(props: Props) {
  return (
    <>
      <TodoListProvider repository={props.repository}>
        <div className="mx-6 pt-2 z-0">
          <div className="w-96 shadow-xl rounded px-4 pb-4">
            <div className="pt-4">
              <h1>TodoList1</h1>
            </div>
            <InputTodo />
            <OpenTodoList />
            <ClosedTodoList />
          </div>
        </div>
      </TodoListProvider>
    </>
  );
}
