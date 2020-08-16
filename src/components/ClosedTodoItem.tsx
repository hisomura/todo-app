import React from "react";
import { MdClose } from "react-icons/md";
import { Todo } from "../lib/todo";

type Props = {
  key: string;
  todo: Todo;
  reopenTodo: (todo: Todo) => void;
  clearTodo: (todo: Todo) => void;
};

export default function ClosedTodoItem(props: Props) {
  return (
    <li key={props.todo.key} className="flex py-2" data-testid="closed-todo-item">
      <input
        className="my-auto mr-2"
        type="checkbox"
        onClick={() => props.reopenTodo(props.todo)}
        defaultChecked={true}
      />
      <p className="line-through">{props.todo.name}</p>
      <div className="my-auto ml-auto" onClick={() => props.clearTodo(props.todo)}>
        <MdClose />
      </div>
    </li>
  );
}
