import React from "react";
import { Todo } from "../lib/todo";
import { useTodosHook } from "../lib/todosHook";
import { createInputTextOnKeyDownCallback } from "../lib/inputText";

export default function InputTodo() {
  const { addTodo } = useTodosHook();

  const onKeyDown = createInputTextOnKeyDownCallback((input) => addTodo(Todo.create(input)));

  return (
    <div className="py-2">
      <label htmlFor="new-todo" hidden={true}>
        Input new todo.
      </label>
      + <input id="new-todo" className="focus:outline-none ml-1 w-11/12" onKeyDown={onKeyDown} type="text" />
    </div>
  );
}
