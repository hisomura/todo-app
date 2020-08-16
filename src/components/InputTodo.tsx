import React, { KeyboardEventHandler } from "react";
import { Todo } from "../lib/todo";
import { useTodoListFromContext } from "./todoListHook";

export default function InputTodo() {
  const { addTodo } = useTodoListFromContext();
  const onKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    // https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/keyCode
    // if (event.keyCode === 229) return
    if (event.key !== "Enter") return;
    if (event.currentTarget.value === "") return;
    addTodo(Todo.create(event.currentTarget.value));
    event.currentTarget.value = "";
  };

  return (
    <div className="py-2">
      <label htmlFor="new-todo" hidden={true}>
        Input new todo.
      </label>
      + <input id="new-todo" className="focus:outline-none ml-1 w-11/12" onKeyDown={onKeyDown} type="text" />
    </div>
  );
}