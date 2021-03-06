import React from "react";
import { MdClose } from "react-icons/md";
import { Todo } from "../../lib/todo";
import { useTodosHook } from "../../lib/todosHook";

type Props = {
  key: string;
  todo: Todo;
};

export default function ClosedTodoItem(props: Props) {
  const { reopenTodo, clearTodo } = useTodosHook();
  return (
    <li key={props.todo.id} className="flex py-2" data-testid="closed-todo-item">
      <input className="my-auto mr-2" type="checkbox" onClick={() => reopenTodo(props.todo)} defaultChecked={true} />
      <p className="line-through text-sm">{props.todo.name}</p>
      <div className="my-auto ml-auto" onClick={() => clearTodo(props.todo)}>
        <MdClose />
      </div>
    </li>
  );
}
