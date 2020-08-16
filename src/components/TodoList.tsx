import React from "react";
import OpenTodoList from "./OpenTodoList";
import ClosedTodoList from "./ClosedTodoList";
import { TodoRepository } from "../lib/repository";
import { TodoListProvider } from "./todoListHook";
import InputTodo from "./InputTodo";

type Props = {
  repository: TodoRepository;
};

export default function TodoList(props: Props) {
  return (
    <>
      <TodoListProvider repository={props.repository}>
        <div className="max-w-xl mx-auto pt-2 z-0">
          <div className="shadow-xl rounded px-4 pb-4">
            <div className="pt-4">
              <h1>Todo</h1>
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
