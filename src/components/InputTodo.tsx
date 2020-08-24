import React from "react";
import { Todo } from "../lib/todo";
import { useTodosHook } from "../lib/todosHook";
import { createInputTextOnKeyDownCallback } from "../lib/inputText";

type Props = {
  todoListId: string;
};

export default function InputTodo(props: Props) {
  const { addTodo } = useTodosHook();

  const onKeyDown = createInputTextOnKeyDownCallback((input) => addTodo(Todo.create(input)));

  return (
    <div className="py-2">
      <label htmlFor={`new-todo-${props.todoListId}`} hidden={true}>
        Input new todo.
      </label>
      +{" "}
      <input
        id={`new-todo-${props.todoListId}`}
        className="focus:outline-none ml-1 w-10/12 text-sm"
        onKeyDown={onKeyDown}
        type="text"
      />
    </div>
  );
}
